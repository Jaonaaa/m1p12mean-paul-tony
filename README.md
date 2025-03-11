![Vroom-Back Logo](https://res.cloudinary.com/dxvb6pnu2/image/upload/f_auto/q_auto/Vroom_htcmmd?_a=BAMCkGcc0)

# Vroom-Back

Backend of the Vroom project, an application to manage a garage. This backend handles user authentication, role-based access control, and provides APIs for managing the internal processes of the garage.

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Role-Based Access Control**: Different access levels for managers and mechanics.
- **User Management**: APIs to manage user profiles and roles.
- **Dashboard**: APIs to support the dashboard for managing internal processes.

## Technologies

- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and garage data.
- **JWT**: JSON Web Tokens for secure authentication.
- **Bcrypt**: Library for hashing passwords.
- **Cloudinary**: Service for managing user profile pictures.

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/vroom-back.git
   cd vroom-back
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a [.env](http://_vscodecontentref_/0) file in the root directory and add the following environment variables:

   ```env
   JWT_KEY=your_jwt_secret_key
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the server:
   ```sh
   npm start
   ```
