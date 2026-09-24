module.exports = function status(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.statusCode = req.method === 'GET' ? 200 : 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({research:'europe-pmc',jev:'not-configured',synthesis:process.env.ANTHROPIC_API_KEY?'claude':'not-configured',auth:process.env.DATABASE_URL?'wmed-account':'not-configured',mode:'public-preview'}));
};
