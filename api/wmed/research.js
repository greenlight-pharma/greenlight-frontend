module.exports = async function research(req, res) {
  const { publicResearch } = await import('../../scripts/wmed-app/server/public-research.mjs');
  return publicResearch(req, res);
};
