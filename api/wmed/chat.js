module.exports = async function handler(req,res) {
 const {chat}=await import('../../scripts/wmed-app/server/vytal-assistant.mjs');
 return chat(req,res);
};
