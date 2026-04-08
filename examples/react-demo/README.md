# ZeroScale API React Demo

A complete React application demonstrating how to integrate with the ZeroScale API for managing hosts and reviews.

## Features

- User authentication with JWT tokens
- Browse and search hosts
- View host details and reviews
- Responsive design
- Error handling and loading states

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3001
```

## Usage

1. **Login**: Use any email/password to get an API token
2. **Browse Hosts**: View all available hosts with filtering
3. **View Details**: Click on hosts to see reviews and details

## API Integration

The demo uses these ZeroScale API endpoints:

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/hosts` - List hosts with pagination
- `GET /api/v1/hosts/:id` - Get host details
- `GET /api/v1/reviews/:hostId` - Get host reviews

## Technical Stack

- React 18
- Vite for development
- Axios for HTTP requests
- React Router for navigation
- CSS Grid for responsive layout

## Configuration

Update the API base URL in `src/App.jsx`:

```javascript
const API_BASE = 'https://api.zeroscale.dev/api/v1';
```

For local development, use:
```javascript
const API_BASE = 'http://localhost:3000/api/v1';
```
