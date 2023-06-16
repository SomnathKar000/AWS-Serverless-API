# AWS-Serverless-API

This project provides a serverless CRUD (Create, Read, Update, Delete) API for DynamoDB using AWS Lambda and the Serverless Framework.

## Serverless API Advantages :

1. No need to provision or manage the servers
2. Horizontal Scalability
3. Never pay for idle
4. More reliable

## Prerequisites

Before deploying and running the project, ensure you have the following prerequisites:

- Node.js (version X.X.X)
- AWS account with proper permissions
- Serverless Framework CLI (version X.X.X)
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

- GET /products: Retrieves all products.
- GET /product/{productId}: Retrieves a specific product.
- POST /product: Creates a new product.
- PATCH /product/{productId}: Updates a specific product.
- DELETE /product/{productId}: Deletes a specific product.

You can use tools like cURL or API testing clients (e.g., Postman) to interact with the API endpoints.

AWS API Gateway Base URL: `https://ozkgj0har5.execute-api.ap-south-1.amazonaws.com/dev`

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.
