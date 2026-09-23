module.exports = async function handler(req,res) {
 const {academic}=await import('../../scripts/wmed-app/server/academic.mjs');
 return academic(req,res);
};
