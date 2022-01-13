exports = async function(data){
    const service = context.services.get("test123");
    const collection = service.db("testing").collection("webhook_calls");

    const doc = {
      url: data.webhookUrl,
      companyId: data.companyId,
      payload: data.payload,
      status: data.status,
      createdAt: new Date().toISOString(),
      output: data.output
    }

    const result = await collection.insertOne(doc);

    return result;
};