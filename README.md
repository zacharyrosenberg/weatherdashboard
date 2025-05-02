# Weather Dashboard

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange)](https://aws.amazon.com/serverless/)
[![React](https://img.shields.io/badge/React-Frontend-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A modern, serverless weather application that provides real-time weather data and forecasts with a beautiful, responsive interface. Built with React on the frontend and AWS serverless technologies on the backend.

![Weather Dashboard Screenshot](docs/images/dashboard-preview.png)

## ✨ Features

- **Real-time Weather Data**: Current conditions with detailed metrics (temperature, humidity, wind, pressure, etc.)
- **Multi-day Forecasts**: Plan ahead with accurate 7-day weather predictions
- **Location Management**: Save favorite locations for quick access
- **User Authentication**: Secure login/registration with profile management
- **Personalization**: Customize units (°C/°F), dashboard layout, and theme preferences
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Eye-friendly interface for day and night usage
- **Offline Capability**: Basic functionality when network connectivity is limited

## 🏗️ Architecture

This project demonstrates a modern serverless architecture using AWS services:

### Frontend

- **React.js**: Component-based UI with hooks for state management
- **Next.js**: Server-side rendering and static site generation
- **AWS Amplify**: Automated deployment with CI/CD pipeline
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Visualizations**: Dynamic charts and weather condition displays

### Backend (Serverless)

- **API Gateway**: RESTful endpoints with authentication
- **Lambda Functions**: Event-driven computing for API requests
- **Weather API Integration**: Proxied requests to external weather data providers
- **Efficient Caching**: Minimized API calls for better performance and reduced costs

### Authentication & Authorization

- **AWS Cognito**: User registration, login, and profile management
- **JWT Tokens**: Secure API access with token-based authentication
- **Protected Routes**: Client-side route protection for authenticated users
- **User Preferences**: Personalized settings stored per user

### Data Layer

- **DynamoDB**: NoSQL storage for user preferences and location data
- **Weather Cache**: Temporary storage to optimize third-party API usage

### Security

- **AWS Cognito**: Secure user authentication and authorization
- **JWT Tokens**: Protected API access
- **IAM Roles**: Fine-grained permission control

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- AWS Account
- AWS CLI configured locally

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard

# Install dependencies
npm install

# Configure AWS Amplify
amplify configure
amplify init
```

### Local Development

```bash
# Start the development server
npm run dev

# Run tests
npm test
```

### Deployment

```bash
# Deploy to AWS
amplify push
amplify publish
```

## 📋 Implementation Status

✅ Core UI components  
✅ Weather data display  
✅ Forecast visualization  
✅ Responsive design  
✅ User authentication system  
✅ Profile management  
⬜ Location saving  
⬜ User preferences  
⬜ AWS Cognito integration  
⬜ Backend API deployment

## 🔧 AWS Services Utilized

- **Amplify**: Frontend hosting with continuous deployment
- **Lambda**: Serverless computing for backend logic
- **API Gateway**: API management and request routing
- **DynamoDB**: Flexible NoSQL database storage
- **Cognito**: User authentication and management
- **CloudWatch**: Monitoring and logging
- **IAM**: Security and access control

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [OpenWeatherMap API](https://openweathermap.org/api) for weather data
- [AWS Documentation](https://docs.aws.amazon.com/) for comprehensive guides
- [React Community](https://reactjs.org/community/support.html) for development support

---

Built with ❤️ by [Zack Rosenberg](https://github.com/zacharyrosenberg)
