import AWS from "aws-sdk";

AWS.config.update({
  region: "ap-south-1",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const dynamodbTableName = "products-table";

const healthPath = "/health";
const productPath = "/product";
const productsPath = "/products";

exports.handler = async (event) => {
  let response;
  if (event.httpMethod === "GET" && event.path === healthPath) {
    response = buildResponse(200);
  } else if (event.httpMethod === "GET" && event.path === productsPath) {
    response = await getProducts();
  } else if (event.httpMethod === "GET" && event.path === productPath) {
    response = await getProduct(event.queryStringParameters.productId);
  } else if (event.httpMethod === "POST" && event.path === productPath) {
    response = await postProduct(JSON.parse(event.body));
  } else if (event.httpMethod === "PATCH" && event.path === productPath) {
    const productBody = JSON.parse(event.body);
    response = await updateProduct(
      productBody.productId,
      productBody.updateKey,
      productBody.updateValue
    );
  } else if (event.httpMethod === "DELETE" && event.path === productPath) {
    response = await deleteProduct(JSON.parse(event.body).productId);
  } else {
    response = buildResponse(404, "404 Not Found");
  }
  return response;
};

const getProducts = async () => {
  const params = {
    TableName: dynamodbTableName,
  };
  const allProducts = await getAllDynamoData(params, []);
  const body = {
    Success: true,
    products: allProducts,
  };
  return buildResponse(200, body);
};

const getAllDynamoData = async (dbParams, Items) => {
  try {
    const products = await dynamodb.scan(dbParams).promise();
    Items = Items.concat(products.Items);
    if (products.LastEvaluatedKey) {
      dbParams.ExclusiveStartKey = products.LastEvaluatedKey;
      await getAllDynamoData(dbParams, Items);
    }
    return Items;
  } catch (error) {
    return buildResponse(400, error.message);
  }
};

const getProduct = async (productId) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      productId: productId,
    },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        const body = {
          Success: true,
          Item: response,
        };
        return buildResponse(200, body);
      },
      (error) => buildResponse(400, error.message)
    );
};

const postProduct = async (Item) => {
  const params = {
    TableName: dynamodbTableName,
    Item,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        const body = {
          Success: true,
          Item,
        };
        return buildResponse(200, body);
      },
      (error) => buildResponse(400, error.message)
    );
};

const updateProduct = async (productId, updateKey, updateValue) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      productId: productId,
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ":value": updateValue,
    },
    ReturnValues: "UPDATED_NEW",
  };
  return await dynamodb
    .update(params)
    .promise()
    .then(
      (response) => {
        const body = {
          Success: true,
          Item: response,
        };
        return buildResponse(200, body);
      },
      (error) => buildResponse(400, error.message)
    );
};

const deleteProduct = async (productId) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      productId: productId,
    },
    ReturnValues: "ALL_OLD",
  };
  return await dynamodb
    .delete(params)
    .promise()
    .then(
      (response) => {
        const body = {
          Success: true,
          Item: response,
        };
        return buildResponse(200, body);
      },
      (error) => buildResponse(400, error.message)
    );
};

const buildResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};
