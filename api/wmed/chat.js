module.exports = async function handler(req,res) {
 const {chat}=await import('../../scripts/wmed-app/server/wmed-chat.mjs');
 return chat(req,res);
};
