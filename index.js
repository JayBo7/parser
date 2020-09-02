const fs = require('fs');

var file = process.argv[2];
var key = true
var param = '';
var value = '';
var parameters = {}

function parser(path) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    // get rid of spaces
    var trimData = data.replace(/ /g, '');
    for (var ch = 0; ch < trimData.length; ch++) {
      if (trimData[ch] === '=') {
        // toggle key to false as we are longer adding to the key
        key = false;
      } else if (trimData[ch] === '\n' || trimData[ch + 1] === undefined) { // check for newline or end of file so we can add key-value pairs to our parameters object
        if (trimData[ch + 1] === undefined) {
          // edge case for end of file
          value += trimData[ch];
        }
        // check for comments and empty strings
        if (param[0] !== '#' && param) {
          // change strings to true or false booleans
          // we also add params to our parameters object exactly how they are written on the config file
          if (['true','on','yes'].includes(value)) {
            parameters[param] = true;
          } else if (['false','off','no'].includes(value)) {
            parameters[param] = false;
          } else if (String(parseFloat(value)).length === value.length) { // check for numerics and make sure we aren't parsing numbers from strings that start with numbers
            parameters[param] = parseFloat(value);
          } else {
            parameters[param] = value;
          }
        }
        // reset our variables and toggle
        value = '';
        param = '';
        key = true;
      } else {
        if (key) {
          param += trimData[ch];
        } else {
          value += trimData[ch];
        }
      }
    }
    console.log(parameters);
  });
}

// run our program only if there is a file
file && parser(file);