exports = async function(data, token){
    const hmacSHA256 = require("crypto-js/hmac-sha256");

    let payload = data;
    delete payload._id;
    
    let currentTime = new Date().toISOString();
    let resourceId = payload.candidateId;

    let result = {
      resourceId: resourceId,
      resource: payload,
      resourceType: payload.type,
      triggeredAt: currentTime,
      token: hmacSHA256(resourceId + currentTime, token).toString(),
    }

    return result;
};