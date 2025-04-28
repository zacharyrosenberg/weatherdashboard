# Weather Dashboard with AWS

## Project Overview

A serverless weather dashboard that displays current conditions and forecasts for user-selected locations. Users can create accounts, save favorite locations, and view personalized weather data.

## Architecture

### Frontend

- **Technology**: React.js with hooks for state management
- **Hosting**: AWS Amplify for automatic deployment
- **Features**:
  - Responsive design for mobile/desktop
  - Weather visualization components (temperature, precipitation, wind, etc.)
  - Location search with autocomplete
  - User preferences panel
  - Dark/light mode toggle

### Backend (Serverless)

- **API Layer**: AWS API Gateway + Lambda functions
  - `/weather` endpoint to fetch current conditions
  - `/forecast` endpoint for multi-day forecasts
  - `/locations` endpoint for user's saved locations
  - `/preferences` endpoint for user settings
- **External API Integration**: Lambda function to proxy requests to weather data providers (OpenWeatherMap, WeatherAPI, etc.)
- **Caching**: DynamoDB for storing recent weather data to minimize API calls

### Data Storage

- **User Data**: DynamoDB tables for:
  - User preferences (temperature units, dashboard layout)
  - Saved locations (cities, custom locations)
- **Weather Cache**: Temporary storage of weather data to reduce API calls

### Authentication

- **AWS Cognito**: User sign-up, sign-in, and profile management
- **JWT Tokens**: Secure API access

## Implementation Steps

1. **Set up AWS resources**

   - Create Cognito user pool
   - Set up DynamoDB tables
   - Configure Lambda functions
   - Create API Gateway endpoints

2. **Create React frontend**

   - Set up project with Create React App or Next.js
   - Implement core UI components
   - Create responsive layouts

3. **Implement authentication flow**

   - Sign-up and sign-in screens
   - Password reset functionality
   - Profile management

4. **Build core weather functionality**

   - Current conditions display
   - Multi-day forecast
   - Location search and saving

5. **Add user preferences**

   - Units (Celsius/Fahrenheit)
   - Dashboard layout customization
   - Default locations

6. **Deploy and connect services**
   - Set up Amplify hosting
   - Connect frontend to API Gateway
   - Test end-to-end functionality

## AWS Services Used

- **Amplify**: Frontend hosting and continuous deployment
- **Lambda**: Serverless backend functions
- **API Gateway**: RESTful API endpoints
- **DynamoDB**: NoSQL data storage
- **Cognito**: User authentication and management
- **CloudWatch**: Monitoring and logging
- **IAM**: Security and access management

## Learning Opportunities

- Serverless architecture patterns
- React frontend development
- API integration and data transformation
- User authentication flows
- AWS service integration
- Working with third-party APIs

This project provides a great introduction to AWS while creating something useful that you can actually use daily and showcase in your portfolio.
