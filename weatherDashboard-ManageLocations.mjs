// Use ES modules imports
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand, 
    QueryCommand,
    DeleteCommand 
} from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient();
const dynamoDB = DynamoDBDocumentClient.from(client);
const LOCATIONS_TABLE = 'WeatherDashboard-Locations';

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
                // List user's saved locations
                return await getUserLocations(userId);
                
            case 'POST':
                // Add a new location
                const locationToAdd = JSON.parse(event.body);
                return await addLocation(userId, locationToAdd);
                
            case 'DELETE':
                // Remove a location
                const locationId = event.queryStringParameters?.locationId || 
                                   event.pathParameters?.locationId;
                                   
                if (!locationId) {
                    return formatResponse(400, { message: 'Location ID is required for deletion' });
                }
                
                return await deleteLocation(userId, locationId);
                
            default:
                return formatResponse(405, { message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        return formatResponse(500, { message: 'Error managing locations', error: error.message });
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

// Get all locations for a user
async function getUserLocations(userId) {
    const params = {
        TableName: LOCATIONS_TABLE,
        KeyConditionExpression: 'UserId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };
    
    try {
        const result = await dynamoDB.send(new QueryCommand(params));
        
        return formatResponse(200, {
            locations: result.Items || []
        });
    } catch (error) {
        console.error('Error retrieving locations:', error);
        throw new Error('Failed to retrieve locations');
    }
}

// Add a new location for a user
async function addLocation(userId, locationData) {
    // Validate the location data
    if (!locationData.name || !locationData.id) {
        return formatResponse(400, { message: 'Location name and ID are required' });
    }
    
    const locationItem = {
        UserId: userId,
        LocationId: locationData.id,
        Name: locationData.name,
        Country: locationData.country || '',
        Coordinates: locationData.coordinates || { lat: 0, lon: 0 },
        IsFavorite: locationData.isFavorite || false,
        CreatedAt: new Date().toISOString()
    };
    
    const params = {
        TableName: LOCATIONS_TABLE,
        Item: locationItem
    };
    
    try {
        await dynamoDB.send(new PutCommand(params));
        
        return formatResponse(201, {
            message: 'Location added successfully',
            location: locationItem
        });
    } catch (error) {
        console.error('Error adding location:', error);
        throw new Error('Failed to add location');
    }
}

// Delete a location for a user
async function deleteLocation(userId, locationId) {
    const params = {
        TableName: LOCATIONS_TABLE,
        Key: {
            UserId: userId,
            LocationId: locationId
        }
    };
    
    try {
        await dynamoDB.send(new DeleteCommand(params));
        
        return formatResponse(200, {
            message: 'Location deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting location:', error);
        throw new Error('Failed to delete location');
    }
}

function formatResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Required for CORS
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS'
        },
        body: JSON.stringify(body)
    };
} 