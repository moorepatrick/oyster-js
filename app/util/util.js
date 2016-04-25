var crypto = require('crypto');

function normalize(str) {
  var normalized = str.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  if (normalized[normalized.length - 1] === '-') {
    normalized = normalized.slice(0, normalized.lastIndexOf('-'));
  }
  return normalized;
}

function sha256Hash(value){
  var hash = crypto.createHash('sha256');
  return hash.update(value).digest('base64');
}

module.exports.normalize = normalize;
module.exports.sha256Hash = sha256Hash;
