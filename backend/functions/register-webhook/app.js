var validator = require("valid-url");

const clientPromise = require("./mongodb-client");

exports.lambdaHandler = async (event, context) => {
  let Body = JSON.parse(event.body);

  let validationErrors = validateInput(Body);

  if (validationErrors !== null) {
    return validationErrors;
  }

  let signedToken = gerRandomString(32);
  let companyId = parseInt(Body.companyId);
  let eventType = Body.eventType;
  let url = Body.url;

  console.log({ signedToken, companyId, eventType, url });

  try {
    const client = await clientPromise;

    const database = client.db(process.env.MONGODB_DATABASE);
    const webhooks = database.collection("webhooks");

    const doc = {
      webhookUrl: url,
      companyId: companyId,
      eventType: "candidate.created",
      token: signedToken,
    };

    const result = await webhooks.insertOne(doc);

    console.log(`webhook created with the _id: ${result.insertedId}`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Webhook created",
        data: {
          token: signedToken,
        },
      }),
    };
  } catch (error) {
    console.error("Error", error.stack);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Webhook creation failed",
        error: error.stack,
      }),
    };
  }
};

function validateInput(body) {
  let errors = [];

  if (!validator.isUri(body.url)) {
    errors.push("Required field url not found or invalid");
  }

  if (!body.companyId || isNaN(body.companyId)) {
    errors.push("Required field companyId not found or invalid");
  }

  if (!body.eventType) {
    errors.push("Required field eventType not found or invalid");
  }

  if (errors.length > 0) {
    return {
      statusCode: 422,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Validation errors",
        error: errors,
      }),
    };
  }

  return null;
}

function gerRandomString(length, onlyNumbers = false) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  if (onlyNumbers === true) {
    var characters = "0123456789";
  }
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
