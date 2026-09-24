module.exports = async function handler(req,res) {
 const {migrating}=await import('../../scripts/wmed-app/server/migrating.mjs');
 return migrating(req,res);
};
