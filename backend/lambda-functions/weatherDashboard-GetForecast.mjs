// Use ES modules imports
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';

// Initialize DynamoDB client
const client = new DynamoDBClient();
const dynamoDB = DynamoDBDocumentClient.from(client);
const CACHE_TABLE = 'WeatherDashboard-Cache';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY';

export const handler = async (event) => {
    try {
        // Parse the incoming request
        const locationId = event.queryStringParameters?.locationId || 
                          event.pathParameters?.locationId;
        
        const days = event.queryStringParameters?.days || 5; // Default to 5-day forecast
                          
        // If no location provided, return error
        if (!locationId) {
            return formatResponse(400, { message: 'Location ID is required' });
        }
        
        console.log(`Fetching ${days}-day forecast for location:`, locationId);
        
        // Try to get cached data first
        const cachedData = await getForecastFromCache(locationId, days);
        if (cachedData) {
            console.log('Returning cached forecast data');
            return formatResponse(200, cachedData);
        }
        
        // If no cached data, fetch from API
        console.log('No forecast cache found, fetching from API');
        const forecastData = await fetchForecastFromAPI(locationId, days);
        
        // Cache the result
        await cacheForecastData(locationId, forecastData, days);
        
        return formatResponse(200, forecastData);
    } catch (error) {
        console.error('Error:', error);
        return formatResponse(500, { message: 'Error fetching forecast data', error: error.message });
    }
};

async function getForecastFromCache(locationId, days) {
    const params = {
        TableName: CACHE_TABLE,
        Key: {
            LocationId: locationId,
            DataType: `forecast-${days}day`
        }
    };
    
    try {
        const result = await dynamoDB.send(new GetCommand(params));
        
        // Check if we have valid cached data that isn't expired
        if (result.Item && result.Item.Timestamp) {
            const timestamp = new Date(result.Item.Timestamp);
            const now = new Date();
            
            // If data is less than 3 hours old, use it (forecasts change less frequently)
            if ((now - timestamp) < 3 * 60 * 60 * 1000) {
                return result.Item.Data;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Forecast cache retrieval error:', error);
        return null; // Proceed to fetch from API if cache retrieval fails
    }
}

async function fetchForecastFromAPI(locationId, days) {
    try {
        // First need to get coordinates for the location if it's a city name
        let lat, lon;
        
        if (locationId.includes(',')) {
            // Already have coordinates
            [lat, lon] = locationId.split(',');
            console.log(`Using provided coordinates: lat=${lat}, lon=${lon}`);
        } else {
            // Need to get coordinates for the city
            // Ensure the location is properly encoded for URL
            const encodedLocation = encodeURIComponent(locationId);
            console.log(`Encoded location query: ${encodedLocation}`);
            
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodedLocation}&limit=1&appid=${WEATHER_API_KEY}`;
            console.log(`Fetching location coordinates from: ${geoUrl.replace(WEATHER_API_KEY, 'API_KEY_HIDDEN')}`);
            const geoResponse = await axios.get(geoUrl);
            
            console.log(`Geo API response status: ${geoResponse.status}`);
            console.log(`Geo API response data: ${JSON.stringify(geoResponse.data)}`);
            
            if (!geoResponse.data || geoResponse.data.length === 0) {
                throw new Error(`Location not found: ${locationId}`);
            }
            
            lat = geoResponse.data[0].lat;
            lon = geoResponse.data[0].lon;
            console.log(`Resolved coordinates: lat=${lat}, lon=${lon}`);
        }
        
        // Now fetch the forecast data using coordinates
        const cnt = days * 8; // API returns data in 3-hour increments, so 8 per day
        console.log(`Requesting ${cnt} data points for a ${days}-day forecast`);
        
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial&cnt=${cnt}`;
        
        console.log('Fetching forecast from URL:', url.replace(WEATHER_API_KEY, 'API_KEY_HIDDEN'));
        const response = await axios.get(url);
        
        console.log(`Forecast API response status: ${response.status}`);
        console.log(`Received forecast data with ${response.data?.list?.length || 0} time slots`);
        
        // Process and format the forecast data
        const locationName = response.data.city.name;
        const country = response.data.city.country;
        
        // Group forecast by days
        const dailyForecasts = processDailyForecasts(response.data.list);
        
        // Format the response data
        return {
            location: {
                name: locationName,
                country: country,
                coordinates: {
                    lat,
                    lon
                }
            },
            forecast: dailyForecasts,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('API forecast fetch error:', error);
        
        // Log more detailed error information
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(`Error response status: ${error.response.status}`);
            console.error(`Error response data: ${JSON.stringify(error.response.data)}`);
            console.error(`Error response headers: ${JSON.stringify(error.response.headers)}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from API');
            console.error(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
        
        throw new Error('Failed to fetch forecast data from API: ' + error.message);
    }
}

function processDailyForecasts(forecastList) {
    // Group by day
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!dailyData[day]) {
            dailyData[day] = {
                date: day,
                temperatures: [],
                weather: [],
                humidity: [],
                wind: [],
                precipitation: []
            };
        }
        
        // Add data points
        dailyData[day].temperatures.push(item.main.temp);
        dailyData[day].weather.push(item.weather[0].main);
        dailyData[day].humidity.push(item.main.humidity);
        dailyData[day].wind.push(item.wind.speed);
        dailyData[day].precipitation.push(item.pop || 0); // Probability of precipitation
    });
    
    // Calculate daily summaries
    return Object.values(dailyData).map(day => {
        // Find most common weather condition
        const weatherCounts = day.weather.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
        
        const mostCommonWeather = Object.entries(weatherCounts)
            .sort((a, b) => b[1] - a[1])[0][0];
            
        // Find weather description for the most common weather
        const weatherItem = forecastList.find(item => {
            const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
            return itemDate === day.date && item.weather[0].main === mostCommonWeather;
        });
        
        // Calculate averages and max/min
        return {
            date: day.date,
            temperature: {
                min: Math.min(...day.temperatures),
                max: Math.max(...day.temperatures),
                avg: day.temperatures.reduce((sum, temp) => sum + temp, 0) / day.temperatures.length
            },
            weather: {
                main: mostCommonWeather,
                description: weatherItem.weather[0].description,
                icon: weatherItem.weather[0].icon
            },
            humidity: Math.round(day.humidity.reduce((sum, h) => sum + h, 0) / day.humidity.length),
            wind: {
                avg: day.wind.reduce((sum, speed) => sum + speed, 0) / day.wind.length,
                max: Math.max(...day.wind)
            },
            precipitation: {
                probability: Math.max(...day.precipitation) // Highest probability of the day
            }
        };
    });
}

async function cacheForecastData(locationId, forecastData, days) {
    const params = {
        TableName: CACHE_TABLE,
        Item: {
            LocationId: locationId,
            DataType: `forecast-${days}day`,
            Data: forecastData,
            Timestamp: new Date().toISOString(),
            TTL: Math.floor(Date.now() / 1000) + 3 * 60 * 60 // 3 hour TTL
        }
    };
    
    try {
        await dynamoDB.send(new PutCommand(params));
        console.log('Forecast data cached successfully');
    } catch (error) {
        console.error('Forecast cache storage error:', error);
        // We'll still return the data even if caching fails
    }
}

function formatResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Required for CORS
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(body)
    };
} 