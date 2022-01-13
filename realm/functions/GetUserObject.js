exports = async function(arg){
    var collection = context.services.get("test123").db("testing").collection("users");
    var result = await collection.findOne({"_id":arg});

    return result;
};