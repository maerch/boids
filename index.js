var debounce = require('debounce');
var ticker   = require('ticker');

var canvas   = document.createElement('canvas');
var ctx      = canvas.getContext('2d');

function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.normalize = function() {
    var x = this.x;
    var y = this.y;
    var length = Math.sqrt(x*x + y*y);
    this.x = x / length;
    this.y = y / length;
    return this;
  }
}
module.exports = Vector;

function Boid(x, y) {
  this.loc = new Vector(x, y);
  this.vel = new Vector(x, y).normalize();
  this.speed = Math.random() * 5;
}

var boids = [];
for(var i=0; i<50; i++) {
  boids.push(new Boid(Math.random() * 400, Math.random() * 400));
}

var mouse = {
  x: 0,
  y: 0
}

document.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX || e.pageX;
  mouse.y = e.clientY || e.pageY;
}, false);

window.onresize = debounce(function() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}, 200);
window.onresize();

document.body.style.margin  = '0';
document.body.style.padding = '0';
document.body.appendChild(canvas);

ticker(window, 60).on('tick', function() {

  boids.forEach(function(boid) {
    boid.loc.x += boid.vel.x * boid.speed;
    boid.loc.y += boid.vel.y * boid.speed;

    boid.vel.x = mouse.x - boid.loc.x;
    boid.vel.y = mouse.y - boid.loc.y;

    boid.vel.normalize();

    if(boid.loc.y > canvas.height - 10 || boid.loc.y < 0) {
      boid.vy *= -1;
    }
    if(boid.loc.x > canvas.width - 10  || boid.loc.x < 0) {
      boid.vx *= -1;
    }
  });
  
}).on('draw', function() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  boids.forEach(function(boid) {
    ctx.fillRect(boid.loc.x, boid.loc.y, 10, 10);
  })
});
