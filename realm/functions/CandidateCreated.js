exports = async function(changeEvent) {
    const axios = require("axios");
    const companyId = changeEvent.fullDocument.companyId;
  
    var webhookData = await context.functions.execute("GetWebhook", companyId, 'candidate.created');
    
    if (!webhookData) {
      console.log('No webhook set up for event candidate.created for companyId: ' + companyId);
  
      return;
    }
  
    var userData = await context.functions.execute("GetUserObject", changeEvent.fullDocument._id);
    
    if (!userData) {
      console.log('Cannot find user entity with id: ' + changeEvent.fullDocument._id);
  
      return;
    }
  
    var payload = await context.functions.execute("CreateWebhookPayload", changeEvent.fullDocument, webhookData.token);
  
    var webhookCallStatus = '';
    var webhookCallOutput = {};
    try {
      const webhook = await axios.post(webhookData.webhookUrl, payload, {
          "Content-Type": "application/json",
        });
      webhookCallStatus = 'success';
      webhookCallOutput = { status: webhook.status };
    } catch (error) {
      webhookCallStatus = 'failed';
      webhookCallOutput = { errorMessage: error.message };
    }

    const webhookCallData = {
      companyId: companyId,
      webhookUrl: webhookData.webhookUrl,
      payload: payload,
      status: webhookCallStatus,
      output: webhookCallOutput
    }
  
    const webhookCall = await context.functions.execute("CreateWebhookCall", webhookCallData);
  };
  