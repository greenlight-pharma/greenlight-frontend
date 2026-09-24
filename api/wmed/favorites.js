module.exports = async function handler(req,res) {
 const {favorites}=await import('../../scripts/wmed-app/server/favorites.mjs');
 return favorites(req,res);
};
