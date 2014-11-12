var debounce = require('debounce');
var ticker   = require('ticker');

var boidCount = 50;
var canvas   = document.createElement('canvas');
var ctx      = canvas.getContext('2d');

var resizeCanvas = function() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.onresize = debounce(resizeCanvas, 200);
resizeCanvas();

function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.normalize = function() {
    var length = this.length();
    this.x = this.x / length;
    this.y = this.y / length;
    return this;
  }

  this.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  this.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  this.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  this.clone = function() {
    return new Vector(this.x, this.y);
  }
}
module.exports = Vector;

function Boid(x, y) {
  this.loc = new Vector(
                  Math.round(Math.random() * window.innerWidth), 
                  Math.round(Math.random() * window.innerHeight)
                );
  this.vel = new Vector(Math.random()*2-1, Math.random()*2-1).normalize();
  this.speed = 2;
}

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

var cohesion = function(boids, j) {
  var vector = new Vector(0, 0);
  for(var i=0; i<boids.length; i++) {
    if(i!==j) {
      vector.add(boids[i].loc);
    }
  }
  vector.x /= (boids.length-1)
  vector.y /= (boids.length-1)

  vector.subtract(boids[j].loc);
  vector.x /= 100
  vector.y /= 100

  return vector;
};

var separation = function(boids, j) {
  var vector = new Vector(0, 0);
  for(var i=0; i<boids.length; i++) {
    if(i!==j) {
      var distanceVector = boids[i].loc.clone().subtract(boids[j].loc);
      if(distanceVector.length() < 20) {
        vector.subtract(distanceVector);
      }
    }
  }
  return vector;
};

var alignment = function(boids, j) {
  var vector = new Vector(0, 0);
  for(var i=0; i<boids.length; i++) {
    if(i!==j) {
      vector.x += boids[i].vel.x
      vector.y += boids[i].vel.y
    }
  }
  vector.x /= (boids.length-1)
  vector.y /= (boids.length-1)

  vector.subtract(boids[j].vel);
  vector.x /= 8
  vector.y /= 8

  return vector;
};

var wind = function(boids, j) {
  return new Vector(0.5, 0.7);
}

var moveToMouse = function(boids, j) {
  var v = mouse.clone().subtract(boids[j].loc);

  v.x /= 100;
  v.y /= 100;

  return v;

}

ticker(window, 60).on('tick', function() {

  boids.forEach(function(boid, i) {

    var rules = [];
    rules.push(cohesion(boids, i));
    rules.push(separation(boids, i));
    rules.push(alignment(boids, i));
    rules.push(wind(boids, i));
    rules.push(moveToMouse(boids, i));

    rules.forEach(function(rule) {
      boid.vel.x = boid.vel.x + rule.x;
      boid.vel.y = boid.vel.y + rule.y;
    })

    boid.vel.normalize();

    boid.loc.x += boid.vel.x * boid.speed;
    boid.loc.y += boid.vel.y * boid.speed;

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
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'red';
  boids.forEach(function(boid) {
    ctx.fillRect(boid.loc.x, boid.loc.y, 10, 10);
  })
});
