module.exports = async function handler(req,res) {
 const {history}=await import('../../scripts/wmed-app/server/wmed-history.mjs');
 return history(req,res);
};
