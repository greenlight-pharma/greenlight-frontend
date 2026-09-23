module.exports = async function handler(req,res) {
 const {auth}=await import('../../scripts/wmed-app/server/vytal-assistant.mjs');
 return auth(req,res);
};
