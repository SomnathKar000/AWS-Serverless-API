# AWS-Serverless-API

## Serverless API Advantages :

1. No need to provision or manage the servers
2. Horizontal Scalability
3. Never pay for idle
4. More reliable

## Prerequisites

Before deploying and running the project, ensure you have the following prerequisites:

- Node.js
- AWS account with proper permissions
- Serverless Framework CLI
- AWS CLI configured with valid credentials

## Installation

1. Clone the repository: `https://github.com/SomnathKar000/AWS-Serverless-API`
2. Navigate to the project directory: `cd AWS-Serverless-API`
3. Install the dependencies: `npm install`
4. Set up your AWS credentials by configuring the AWS CLI:

## Configuration

Before deploying the project, you need to configure the following:

1. DynamoDB Table: Create a DynamoDB table in your AWS account and note down its name. Set the `DYNAMODB_TABLE_NAME` environment variable in the `serverless.yml` file with the table name.

2. AWS Region: Set the desired AWS region in the `serverless.yml` file using the `region` property.

The Serverless Framework will package your code, create the necessary AWS resources, and deploy the API endpoints.

## Usage

The CRUD API provides the following endpoints:

### /products

- **Method:** GET
- **Description:** Retrieves a list of all products.

### /product/{productId}

- **Method:** GET
- **Description:** Retrieves information about a specific product.
- **Path Parameter:**
  - `productId`: The unique identifier of the product to retrieve.

### /product

- **Method:** POST
- **Description:** Creates a new product.
- **Request Body:**

  - Include the `productId` field in the request body to create a new product. This is the only required field.

- **Example Request Body:**

  ```json
  {
    "productId": "12345",
    "name": "Sample Product",
    "price": 19.99,
    "description": "A description of the product."
  }
  ```

This endpoint creates a new product with the provided details. The `productId` field must be unique, and it's a required field.

### /product/{productId}

- **Method:** PATCH
- **Description:** Updates an existing product.
- **Path Parameter:**
  - `productId`: The unique identifier of the product to update.
- **Request Body:**
  - Include product details in the request body to update the existing product.

### /product/{productId}

- **Method:** DELETE
- **Description:** Deletes a specific product.
- **Path Parameter:**
  - `productId`: The unique identifier of the product to delete.

You can use tools like cURL or API testing clients (e.g., Postman) to interact with the API endpoints.

**AWS API Gateway Base URL:** `https://ozkgj0har5.execute-api.ap-south-1.amazonaws.com/dev`

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.
