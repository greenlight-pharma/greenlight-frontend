module.exports=async function(req,res){const {privacy}=await import('../../scripts/wmed-app/server/privacy.mjs');return privacy(req,res)};
