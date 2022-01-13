exports = async function(companyId, eventType){
    var service = context.services.get("test123");
    var collection = service.db("testing").collection("webhooks");
    var result = await collection.findOne({"companyId":companyId, "eventType": 'candidate.created'});

    return result;
};