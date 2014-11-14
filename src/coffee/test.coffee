debounce = require('debounce')

window.onresize = debounce(resize, 200)

resize = (e) -> 
  console.log('Window changed'); 
