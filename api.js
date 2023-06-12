const db = require("./connectDB");
const {
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getProduct = async (event) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ productId: event.pathParameters.productId }),
    };
    const { Item } = await db.send(new GetItemCommand(params));
    const body = {
      Success: true,
      message: "Successfully retrieved Product",
      data: Item ? unmarshall(Item) : {},
      rawData: Item,
    };
    return buildResponse(body);
  } catch (error) {
    return customError(500, error.message, error.stack);
  }
};

const createProduct = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body),
    };
    const data = await db.send(new PutItemCommand(params));
    const response = {
      Success: true,
      message: "Successfully created product ",
      data: body,
      rawData: data,
    };
    return buildResponse(response);
  } catch (error) {
    return customError(500, error.message, error.stack);
  }
};

const updateProduct = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const objectKeys = Object.keys(body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ productId: event.pathParameters.productId }),
      UpdateExpression: `SET ${objectKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: objectKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        objectKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: body[key],
          }),
          {}
        )
      ),
    };
    const data = await db.send(new UpdateItemCommand(params));
    const response = {
      Success: true,
      message: "Successfully updated product ",
      data: body,
      rawData: data,
    };
    return buildResponse(response);
  } catch (error) {
    return customError(500, error.message, error.stack);
  }
};

const deleteProduct = async (event) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ productId: event.pathParameters.productId }),
    };
    const data = await db.send(new DeleteItemCommand(params));
    const body = {
      Success: true,
      message: "Successfully deleted product ",
      data: data,
    };
    return buildResponse(body);
  } catch (error) {
    return customError(500, error.message, error.stack);
  }
};

const getAllProducts = async (event) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };
    const Items = await getAllDynamoData(params, []);
    const body = {
      Success: true,
      message: "Successfully retrieved all products ",
      data: Items.map((item) => unmarshall(item)),
      rawData: Items,
    };
    return buildResponse(body);
  } catch (error) {
    return customError(500, error.message, error.stack);
  }
};

const getAllDynamoData = async (dbParams, Items) => {
  try {
    const Products = await db.send(new ScanCommand(dbParams));
    Items = Items.concat(Products.Items);
    if (Products.LastEvaluatedKey) {
      dbParams.ExclusiveStartKey = Products.LastEvaluatedKey;
      await getAllDynamoData(dbParams, Items);
    }
    return Items;
  } catch (error) {
    return customError(500, error.message, error.stack);
  }
};

const buildResponse = (body) => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};

const customError = (statusCode, message, stack) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      Status: false,
      message: message,
      stack: stack ? stack : {},
    }),
  };
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
