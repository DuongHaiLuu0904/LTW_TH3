# Photo Sharing App

This is a Photo Sharing App with a Node.js/Express backend and React frontend.

## Project Structure

- Backend (Node.js/Express):
  - API endpoints for users, photos, and user photos
  - MongoDB database connection
  - Routes for handling API requests

- Frontend (React):
  - Components for displaying users and photos
  - Fetching data from the backend API
  - Responsive design

## Implementation Details

### Backend API Endpoints

- `/api/user/list` - Get all users
- `/api/user/:id` - Get a specific user
- `/api/photosOfUser/:id` - Get photos of a specific user
- `/api/photo/list` - Get all photos

### Frontend Components

- UserList - Displays a list of all users
- UserDetail - Shows detailed information about a specific user
- UserPhotos - Displays photos posted by a specific user

### Data Fetching

The application uses the `fetchModel` function in `lib/fetchModelData.js` to request data from the backend API.
