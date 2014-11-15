var debounce, resize;

debounce = require('debounce');

window.onresize = debounce(resize, 200);

resize = function(e) {
  return console.log('Window changed');
};
