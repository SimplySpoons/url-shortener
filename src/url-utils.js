// Tests that URL format is compliant and return true/false
export function isValidUrl(url) {
  let regEx = /^https?:\/\/(\S+\.)?(\S+\.)(\S+)\S*/;
  return regEx.test(url);
}

// Pulls in request object and shortCode, and returns full URL
export function createFullUrl(req, url) {
  return `${req.protocol}://${req.hostname}:${getPort()}/${url}`;
}
 
function getPort() {
  return process.env.PORT || 8000;
}