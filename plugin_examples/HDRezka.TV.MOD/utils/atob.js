'use strict';
/**
 * Implementation of atob() according to the HTML and Infra specs, except that
 * instead of throwing INVALID_CHARACTER_ERR we return null.
 */
function atob(data) {
  data = ''.concat(data);
  data = data.replace(/[ \t\n\f\r]/g, '');
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, '');
  }
  if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
    return null;
  }
  var output = '';
  var buffer = 0;
  var accumulatedBits = 0;
  for (var i = 0; i < data.length; i++) {
    buffer <<= 6;
    buffer |= atobLookup(data[i]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 0xff0000) >> 16);
      output += String.fromCharCode((buffer & 0xff00) >> 8);
      output += String.fromCharCode(buffer & 0xff);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  }
  else
  if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 0xff00) >> 8);
    output += String.fromCharCode(buffer & 0xff);
  }
  return output;
};
/**
 * A lookup table for atob(), which converts an ASCII character to the
 * corresponding six-bit number.
 */
var keystr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function atobLookup(chr) {
  var index = keystr.indexOf(chr);
  return index < 0 ? undefined : index;
};
module.exports = atob;