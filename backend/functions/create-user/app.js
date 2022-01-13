var emailValidator = require("email-validator");
const { v4: uuidv4 } = require("uuid");
const clientPromise = require("./mongodb-client");

exports.lambdaHandler = async (event, context) => {
  let Body = JSON.parse(event.body);
  let validationErrors = validateInput(Body);

  if (validationErrors !== null) {
    return validationErrors;
  }

  const userId = uuidv4();

  const doc = {
    type: "candidate",
    userId: userId,
    companyId: parseInt(Body.companyId),
    email: Body.email,
    firstName: Body.firstName,
    lastName: Body.lastName,
    createdAt: new Date().toISOString(),
  };

  try {
    const client = await clientPromise;

    const database = client.db(process.env.MONGODB_DATABASE);
    const users = database.collection("users");

    const result = await users.insertOne(doc);

    console.log(`candidate created with the _id: ${result.insertedId}`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "User created",
        data: {
          id: userId,
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
        message: "Candidate creation failed",
        error: error.stack,
      }),
    };
  }
};

function validateInput(body) {
  let errors = [];

  if (!emailValidator.validate(body.email)) {
    errors.push("Required field email not found or invalid");
  }

  if (isNaN(body.companyId)) {
    errors.push("Required field companyId not found or invalid");
  }

  if (!body.firstName) {
    errors.push("Required field first name not found");
  }

  if (!body.lastName) {
    errors.push("Required field last name not found");
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
        errors: errors,
      }),
    };
  }

  return null;
}
