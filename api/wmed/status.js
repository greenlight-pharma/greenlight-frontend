module.exports = function status(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.statusCode = req.method === 'GET' ? 200 : 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({research:'europe-pmc',jev:'not-configured',synthesis:'vytal-assistant',auth:'vytal-account',mode:'public-preview'}));
};
