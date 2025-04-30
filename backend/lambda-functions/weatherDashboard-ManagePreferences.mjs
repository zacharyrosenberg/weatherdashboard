// Use ES modules imports
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand,
    UpdateCommand
} from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient();
const dynamoDB = DynamoDBDocumentClient.from(client);
const USERS_TABLE = 'WeatherDashboard-Users';

export const handler = async (event) => {
    try {
        // Get user from auth context
        const userId = getUserId(event);
        
        if (!userId) {
            return formatResponse(401, { message: 'Unauthorized. User ID is required.' });
        }
        
        // Determine the action to take based on HTTP method
        const httpMethod = event.httpMethod || event.requestContext?.http?.method;
        
        switch (httpMethod) {
            case 'GET':
                // Get user preferences
                return await getUserPreferences(userId);
                
            case 'PUT':
            case 'POST':
                // Update user preferences
                const preferences = JSON.parse(event.body);
                return await updateUserPreferences(userId, preferences);
                
            default:
                return formatResponse(405, { message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        return formatResponse(500, { message: 'Error managing preferences', error: error.message });
    }
};

// Extract user ID from the event
function getUserId(event) {
    // From API Gateway JWT authorizer
    if (event.requestContext?.authorizer?.jwt?.claims?.sub) {
        return event.requestContext.authorizer.jwt.claims.sub;
    }
    
    // From Cognito authorizer
    if (event.requestContext?.authorizer?.claims?.sub) {
        return event.requestContext.authorizer.claims.sub;
    }
    
    // For testing purposes - remove in production
    if (event.queryStringParameters?.userId) {
        return event.queryStringParameters.userId;
    }
    
    return null;
}

// Get user preferences
async function getUserPreferences(userId) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            UserId: userId
        }
    };
    
    try {
        const result = await dynamoDB.send(new GetCommand(params));
        
        if (!result.Item) {
            // If user doesn't exist yet, return default preferences
            return formatResponse(200, {
                preferences: getDefaultPreferences()
            });
        }
        
        return formatResponse(200, {
            preferences: result.Item.Preferences || getDefaultPreferences()
        });
    } catch (error) {
        console.error('Error retrieving preferences:', error);
        throw new Error('Failed to retrieve preferences');
    }
}

// Update user preferences
async function updateUserPreferences(userId, preferences) {
    // Validate the preferences
    if (!preferences) {
        return formatResponse(400, { message: 'Preferences data is required' });
    }
    
    // First check if the user already exists
    const getParams = {
        TableName: USERS_TABLE,
        Key: {
            UserId: userId
        }
    };
    
    try {
        const result = await dynamoDB.send(new GetCommand(getParams));
        
        if (!result.Item) {
            // User doesn't exist yet, create a new record
            const newUser = {
                UserId: userId,
                Preferences: preferences,
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString()
            };
            
            const putParams = {
                TableName: USERS_TABLE,
                Item: newUser
            };
            
            await dynamoDB.send(new PutCommand(putParams));
            
            return formatResponse(201, {
                message: 'Preferences created successfully',
                preferences: preferences
            });
        } else {
            // User exists, update preferences
            const updateParams = {
                TableName: USERS_TABLE,
                Key: {
                    UserId: userId
                },
                UpdateExpression: 'set Preferences = :preferences, UpdatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':preferences': preferences,
                    ':updatedAt': new Date().toISOString()
                },
                ReturnValues: 'ALL_NEW'
            };
            
            const updateResult = await dynamoDB.send(new UpdateCommand(updateParams));
            
            return formatResponse(200, {
                message: 'Preferences updated successfully',
                preferences: updateResult.Attributes.Preferences
            });
        }
    } catch (error) {
        console.error('Error updating preferences:', error);
        throw new Error('Failed to update preferences');
    }
}

// Default preferences
function getDefaultPreferences() {
    return {
        temperatureUnit: 'fahrenheit',
        dashboardLayout: 'default',
        theme: 'light',
        defaultLocation: null
    };
}

function formatResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Required for CORS
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS'
        },
        body: JSON.stringify(body)
    };
} 