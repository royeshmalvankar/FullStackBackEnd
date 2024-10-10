<h1>SETUP INSTRUCTION</h1>

1. Prerequisites
Node.js: Ensure you have Node.js installed (version 14.x or higher recommended). You can download it from Node.js official website.
MongoDB: You need access to a MongoDB database. You can use a local MongoDB installation or a cloud service like MongoDB Atlas.

2. Clone the Repository
If your code is hosted on a version control system (like GitHub), you can clone it:
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name

3. Navigate to the Project Directory
Change into the directory where your backend code is located:
cd path/to/your/backend

4. Install Dependencies
Install the required dependencies listed in package.json. If there’s no package.json, you’ll need to create one and manually add dependencies:
npm install

5. Configure Environment Variables
Create a .env file in your project root (if not already present) and set the following environment variables:
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
Replace the values with your actual MongoDB connection string and a secret key for JWT.

6. Start the MongoDB Server
If you're using a local MongoDB server, make sure it’s running. If you're using MongoDB Atlas, ensure your IP is whitelisted and you have the correct connection string.

8. Run the Application
Start your Node.js server using:
npm start

<h1>ENVIRONMENT VARIABLE</h1>

1. PORT
Description: Specifies the port on which your server will listen for incoming requests.
Example: PORT=3001
Usage: Helps to avoid hardcoding the port number in your application code, allowing for flexibility during development or deployment.

3. MONGO_URI
Description: The connection string to your MongoDB database. This can be a URI for a local database or a cloud database like MongoDB Atlas.
Example:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
Usage: Allows the application to connect to the database without exposing the connection details in the code. Always ensure sensitive information like passwords is kept secret.

4. JWT_SECRET
Description: A secret key used for signing JSON Web Tokens (JWT). This is crucial for authenticating users and managing sessions.
Example: JWT_SECRET=your_jwt_secret_key
Usage: Provides a way to secure your tokens. Changing this key will invalidate all existing tokens, requiring users to log in again.

<h1>API DOCUMENTATION</h1>

<h2>User API Endpoints</h2>

1. User Registration
Endpoint: POST /user/register
Description: Register a new user.
Request Body:
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "role": "buyer" // optional, defaults to "buyer"
}
Responses:
201 Created:
{
  "message": "User registered successfully",
  "user": "John Doe"
}
400 Bad Request:
{
  "error": "Please enter all fields"
}
500 Internal Server Error:
{
  "error": "User already exists"
}

2. User Login
Endpoint: POST /user/login
Description: Log in an existing user and receive access and refresh tokens.
Request Body:
{
  "email": "johndoe@example.com",
  "password": "password123"
}
Responses:
200 OK:
{
  "message": "User logged in successfully",
  "accessToken": "your_access_token",
  "refreshToken": "your_refresh_token",
  "userid": "user_id_here"
}
400 Bad Request:
{
  "error": "Please enter all fields"
}
404 Not Found:
{
  "error": "User does not exist please register"
}
401 Unauthorized:
{
  "error": "Invalid credentials"
}

3. Refresh Token
Endpoint: POST /user/refreshToken
Description: Generate a new access token using the refresh token.
Request Body:
{
  "refreshToken": "your_refresh_token"
}
Responses:
200 OK:
{
  "message": "Token refreshed successfully",
  "accessToken": "new_access_token"
}
400 Bad Request:
{
  "error": "Please provide a refresh token"
}
500 Internal Server Error:
{
  "error": "Invalid refresh token"
}

4. User Logout
Endpoint: GET /user/logout
Description: Log out a user and blacklist the token.
Headers:
Authorization: Bearer your_access_token
Responses:
200 OK:
{
  "message": "User logged out successfully"
}

5. Get User ID
Endpoint: GET /user/userid
Description: Retrieve user information (excluding password).
Headers:
Authorization: Bearer your_access_token
Responses:
200 OK:
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "role": "buyer"
}
500 Internal Server Error:
{
  "error": "Error retrieving user"
}

6. Get User by ID
Endpoint: GET /user/:id
Description: Get a specific user by their ID (admins can view all users, others can only view their own).
Headers:
Authorization: Bearer your_access_token
Responses:
200 OK:
{
  "_id": "user_id_here",
  "name": "John Doe",
  "email": "johndoe@example.com"
}
400 Bad Request:
{
  "error": "Profile Only api endpoint"
}
500 Internal Server Error:
{
  "error": "User not found"
}

7. Update User
Endpoint: PATCH /user/update/:id
Description: Update a user's information (admin only).
Request Body:
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "newpassword123",
  "role": "admin"
}
Responses:
200 OK:
{
  "message": "User updated successfully"
}
400 Bad Request:
{
  "error": "Please enter fields"
}
500 Internal Server Error:
{
  "error": "User not found"
}

8. Delete User
Endpoint: GET /user/delete/:id
Description: Delete a user by ID (admin only).
Responses:
200 OK:
{
  "message": "User deleted successfully"
}
500 Internal Server Error:
{
  "error": "User not found"
}

<h2>Product API Endpoints</h2>

1. Get All Products
Endpoint: GET /product/
Description: Retrieve all products. Admins and buyers can view all products; sellers can view their own products.
Headers:
Authorization: Bearer your_access_token
Responses:
200 OK:
{
  "products": [
    {
      "_id": "product_id_here",
      "name": "Product Name",
      "description": "Product Description",
      "price": 100,
      "quantity": 10,
      "sellerId": "user_id_here"
    }
  ]
}
400 Bad Request:
{
  "error": "Error retrieving products"
}

2. Search Products
Endpoint: GET /product/search
Description: Search for products based on query parameters like name and price.
Query Parameters:
name: Partial name of the product (optional)
min: Minimum price (optional)
max: Maximum price (optional)
page: Page number for pagination (optional, defaults to 1)
limit: Number of products per page (optional, defaults to 10)
order: Sort order (asc/desc, optional, defaults to asc)
sortby: Field to sort by (optional)
Responses:
200 OK:
{
  "products": [
    {
      "_id": "product_id_here",
      "name": "Product Name",
      "description": "Product Description",
      "price": 100,
      "quantity": 10,
      "sellerId": "user_id_here"
    }
  ]
}
400 Bad Request:
{
  "error": "Error searching products"
}

3. Get Product by ID
Endpoint: GET /product/:id
Description: Retrieve a specific product by ID.
Headers:
Authorization: Bearer your_access_token
Responses:
200 OK:
{
  "product": {
    "_id": "product_id_here",
    "name": "Product Name",
    "description": "Product Description",
    "price": 100,
    "quantity": 10,
    "sellerId": "user_id_here"
  }
}
400 Bad Request:
{
  "message": "Product not found"
}
500 Internal Server Error:

{
  "error": "Error retrieving product"
}

4. Add Product
Endpoint: POST /product/add
Description: Add a new product (admin and seller only).
Request Body:
{
  "name": "New Product",
  "description": "Product Description",
  "price": 100,
  "quantity": 10
}
Responses:
200 OK:
{
  "message": "Product added successfully",
  "product": {
    "_id": "product_id_here",
    "name": "New Product",
    "description": "Product Description",
    "price": 100,
    "quantity": 10,
    "sellerId": "user_id_here"
  }
}

<h1>AUTHENTICATION AND AUTHORISATION</h1>

<h2>1. What is a JWT?</h2>
A JSON Web Token is a compact, URL-safe means of representing claims to be transferred between two parties. The token consists of three parts:

Header: Contains metadata about the token, such as the type (JWT) and the signing algorithm (e.g., HMAC SHA256).
Payload: Contains the claims, which can include user information, token expiration, and user roles.
Signature: Created by combining the encoded header, the encoded payload, and a secret key using the specified algorithm. This signature is used to verify that the sender of the JWT is who it claims to be and to ensure that the message wasn’t changed along the way.

<h2>2. Securing Routes with JWT</h2>

A. Authentication Flow
User Login:

When a user logs in, they provide their credentials (e.g., email and password).
The server validates these credentials against the database.
Token Generation:

Upon successful authentication, the server generates a JWT containing user information (like user ID, role) in the payload.
This token is then sent back to the client (e.g., web browser or mobile app).
Client Storage:

The client stores the token, typically in local storage or cookies.
B. Securing Routes
Authorization Header:

For subsequent requests to protected routes, the client sends the JWT in the Authorization header using the format: Bearer <token>.
Middleware for Verification:

The server uses middleware to intercept requests to protected routes. This middleware performs the following tasks:
Extracts the token from the Authorization header.
Validates the token by verifying the signature and checking claims such as expiration time.
If the token is valid, the user information from the token (e.g., user ID and role) is attached to the request object, making it accessible to route handlers.
Access Control:

Based on the user's role (e.g., admin, seller, buyer) attached to the token, the server decides whether the user is authorized to perform certain actions (CRUD operations) on the resources.

<h2>3. User Authorization for CRUD Operations</h2>

A. Create (POST)
Authorization: Typically restricted to certain roles, such as admin or seller.
Process:
The user sends a request to create a resource (e.g., add a product).
The server checks the user’s role from the JWT payload.
If authorized, the server processes the request; otherwise, it returns an error (e.g., 403 Forbidden).
B. Read (GET)
Authorization: Generally available to all authenticated users, but can be restricted based on user roles for certain resources.
Process:
The user requests data (e.g., view products).
The server checks the user's role; if the user is permitted, the server retrieves the requested data.
C. Update (PATCH/PUT)
Authorization: Usually restricted to the owner of the resource (e.g., the seller of a product) or admin.
Process:
The user sends a request to update a resource.
The server checks the user’s role and whether they own the resource.
If authorized, the server updates the resource; otherwise, it returns an error.
D. Delete (DELETE)
Authorization: Typically restricted to the owner of the resource or admin.
Process:
The user requests to delete a resource.
The server checks the user’s role and ownership of the resource.
If authorized, the server deletes the resource; otherwise, it returns an error.

<h1>DEPLOYMENT INSTRUCTION</h1>

Step-by-Step Deployment Instructions for Render
1. Create a Render Account
If you don’t have an account yet, go to Render.com and sign up for an account.

2. Prepare Your Application
Ensure your application is running locally without issues. This includes confirming all dependencies are installed and the server starts correctly.

Add a start script in your package.json file if you haven't already:
{
  "scripts": {
    "start": "node index.js"
  }
}

3. Push Your Code to GitHub or GitLab
Render requires your code to be in a Git repository (GitHub, GitLab, or Bitbucket).
Push your local code to your preferred Git provider.

4. Create a New Web Service on Render
Log in to Render and click on the New button in the top right corner, then select Web Service.

Connect Your Repository:

Select your Git provider (e.g., GitHub, GitLab).
Authorize Render to access your repositories if prompted.
Choose the repository that contains your Node.js application.
Configure the Web Service:

Name: Give your service a name.
Environment: Choose Node.
Build Command: You can leave it as the default or set it to:
npm install
Start Command:
npm start
Region: Choose the region that is closest to your users for better performance.
Set Up Environment Variables:

In the "Environment" section, click on "Add Environment Variable".
Add your environment variables (e.g., MONGO_URI, JWT_SECRET, etc.) as they are used in your application.
Select Branch: Choose the branch you want to deploy (usually main or master).

Click on the "Create Web Service" Button: Render will now start building and deploying your application.

5. Monitor the Deployment
After creating the web service, Render will automatically build and deploy your application.
You can monitor the deployment process in the Render dashboard. If there are any build errors, they will be displayed here, allowing you to debug.

6. Access Your Application
Once the deployment is successful, Render will provide you with a URL (e.g., https://your-app-name.onrender.com).
Use this URL to access your deployed application.

7. Additional Settings
If needed, you can configure Auto Deploys for automatic deployments on new commits to your selected branch.
You can also set up Custom Domains if you want to use your domain name.

8. Debugging Issues
If you encounter any issues, check the logs in the Render dashboard. You can access logs by clicking on your service and then selecting the "Logs" tab.
Ensure that your application starts correctly and that all environment variables are set up properly.
