var speakeasy = require('speakeasy');
var QRCode = require('qrcode');

var secret = speakeasy.generateSecret({length: 20});
console.log(secret.base32); // secret of length 20

QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
  //console.log(data_url); // get QR code data URL
});
