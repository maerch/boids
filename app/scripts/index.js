var debounce = require('debounce');
var ticker   = require('ticker');

var Vector   = require('./vector.js');
var Boid     = require('./boid.js');

var rules    = require('./rules.js');

var boidCount = 50;
var fps       = 60;
var canvas   = document.createElement('canvas');
var ctx      = canvas.getContext('2d');

var resizeCanvas = function() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.onresize = debounce(resizeCanvas, 200);
resizeCanvas();

var boids = [];
for(var i=0; i<boidCount; i++) {
  boids.push(new Boid(Math.random() * 400, Math.random() * 400));
}

var mouse = new Vector(0, 0);

document.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX || e.pageX;
  mouse.y = e.clientY || e.pageY;
}, false);


document.body.style.margin  = '0';
document.body.style.padding = '0';
document.body.appendChild(canvas);

var cohesion   = true;
var alignment  = true;
var separation = true;
var wind       = false;

var drawBoid = function(boid) {
  var scale = 5

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.moveTo(boid.loc.x, boid.loc.y);
  // Front
  ctx.lineTo(boid.loc.x + boid.vel.x * scale, boid.loc.y + boid.vel.y * scale);
  // Sites
  ctx.lineTo(boid.loc.x - boid.vel.x * scale, boid.loc.y + boid.vel.y * scale);
  ctx.lineTo(boid.loc.x + boid.vel.x * scale, boid.loc.y - boid.vel.y * scale);
  // Front
  ctx.lineTo(boid.loc.x + boid.vel.x * scale, boid.loc.y + boid.vel.y * scale);
  // Back
  ctx.lineTo(boid.loc.x - boid.vel.x * 2 * scale, boid.loc.y - boid.vel.y * 2 * scale);
  // Sites
  ctx.lineTo(boid.loc.x - boid.vel.x * scale, boid.loc.y + boid.vel.y * scale);
  ctx.lineTo(boid.loc.x + boid.vel.x * scale, boid.loc.y - boid.vel.y * scale);
  // Back
  ctx.lineTo(boid.loc.x - boid.vel.x * 2 * scale, boid.loc.y - boid.vel.y * 2 * scale);
  // Sites
  ctx.lineTo(boid.loc.x - boid.vel.x * scale, boid.loc.y + boid.vel.y * scale);
  ctx.lineTo(boid.loc.x + boid.vel.x * scale, boid.loc.y - boid.vel.y * scale);

  ctx.shadowColor = '#ff3300';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#ff3300';
  ctx.stroke();
}

ticker(window, 60).on('tick', function() {

  boids.forEach(function(boid, i) {

    var apply = [];
    if(cohesion) 
      apply.push(rules.cohesion(boids, i));
    if(separation) 
      apply.push(rules.separation(boids, i));
    if(alignment)
      apply.push(rules.alignment(boids, i));
    if(wind)
      apply.push(rules.wind(boids, i));

    apply.forEach(function(rule) {
      boid.vel.x = boid.vel.x + rule.x;
      boid.vel.y = boid.vel.y + rule.y;
    })

    var len = boid.vel.length();
    if(len>3) {
      boid.vel.normalize().scale(3);
    }

    boid.loc.x += boid.vel.x
    boid.loc.y += boid.vel.y

    if(boid.loc.y > canvas.height) {
      boid.loc.y = 0;
    }
    if(boid.loc.y < 0) {
      boid.loc.y = canvas.height;
    }
    if(boid.loc.x > canvas.width) {
      boid.loc.x = 0;
    }
    if(boid.loc.x < 0) {
      boid.loc.x = canvas.width;
    }
  });
  
}).on('draw', function() {
  var halfHeight = canvas.height/2
  var halfWidth  = canvas.width/2

  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  boids.forEach(function(boid, i) {
    global.drawBoid(boid);
  })
});

$("#cohesion").change(function () {
  cohesion = $(this).is(":checked");
}).change();
$("#alignment").change(function () {
  alignment = $(this).is(":checked");
}).change();
$("#separation").change(function () {
  separation = $(this).is(":checked");
}).change();
$("#wind").change(function () {
  wind = $(this).is(":checked");
}).change();
