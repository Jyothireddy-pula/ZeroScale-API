# ZeroScale API Node.js Client

A complete Node.js client demonstrating how to integrate with the ZeroScale API for managing hosts and reviews.

## Features

- Simple API client class
- Automatic authentication handling
- Error handling and response parsing
- Support for all API endpoints
- Environment-based configuration

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your API credentials

# Run the example
node example.js
```

## Usage

```javascript
const ZeroScaleAPI = require('./index.js');

// Initialize the API client
const api = new ZeroScaleAPI({
  baseURL: 'https://api.zeroscale.dev/api/v1', // or your local API
  token: 'your-jwt-token-here' // optional, can be set later
});

// Login and get token
const loginResult = await api.login('user@example.com', 'password123');
if (loginResult.success) {
  api.setToken(loginResult.token); // Auto-sets token for future requests
}

// Get all hosts with pagination and filtering
const hosts = await api.getHosts({
  page: 1,
  limit: 10,
  state: 'California',
  rating: 4
});

// Create a new host
const newHost = await api.createHost({
  name: 'Amazing Restaurant',
  state: 'New York',
  description: 'Best food in the city',
  rating: 4.5
});

// Get reviews for a host
const reviews = await api.getReviews('host-id-here', {
  page: 1,
  limit: 5
});

// Get user profile
const profile = await api.getUserProfile();
```

## Available Methods

### Authentication
- `login(email, password)` - User login
- `getUserProfile()` - Get current user profile

### Hosts
- `getHosts(options)` - List hosts with pagination/filtering
- `getHost(id)` - Get specific host details
- `createHost(hostData)` - Create new host
- `updateHost(id, hostData)` - Update existing host
- `deleteHost(id)` - Delete host

### Reviews
- `getReviews(hostId, options)` - Get reviews for a host
- `createReview(reviewData)` - Create new review
- `updateReview(id, reviewData)` - Update existing review
- `deleteReview(id)` - Delete review

## Response Format

All methods return a consistent format:

```javascript
{
  success: true|false,
  data: {...}, // only on success
  error: 'Error message', // only on failure
  pagination: {...} // for list endpoints
}
```

## Environment Variables

```bash
ZEROSCALE_API_URL=https://api.zeroscale.dev/api/v1
ZEROSCALE_TOKEN=your-jwt-token-here
```

## Error Handling

The client automatically handles:
- Network errors
- API error responses
- Timeout errors
- JSON parsing errors

All errors are returned in the consistent format shown above.
