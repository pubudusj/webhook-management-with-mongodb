const clientPromise = require("./mongodb-client");

exports.lambdaHandler = async (event, context) => {
  let companyId = parseInt(event.pathParameters.companyId);

  if (!companyId) {
    return {
      statusCode: 422,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Validation errors",
        errors: "companyId required",
      }),
    };
  }

  let data = await fetchWebhookHistory(companyId);
  console.log(data)
  if (data !== undefined) {
    result = data;
  } else {
    result = [];
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      data: result,
    }),
  };
};

async function fetchWebhookHistory(companyId) {
  try {
    const client = await clientPromise;

    const database = client.db(process.env.MONGODB_DATABASE);
    const webhook_calls = database.collection("webhook_calls");

    const query = { companyId: companyId };
    console.log(query);
    const cursor = await webhook_calls.find(query);

    console.log(`webhook calls for companyID: ${companyId}`);
    
    
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
      
      return;
    }
    
    let result = [];
    await cursor.forEach(function(doc) { result.push(doc); });
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error", error.stack);

    return;
  }
}
