module.exports = async function handler(req,res) {
 const {cases}=await import('../../scripts/wmed-app/server/cases.mjs');
 return cases(req,res);
};
