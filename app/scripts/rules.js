var Vector = require('./vector.js');

var rules = {};

rules.center = function(boids, j) {
  var vector = new Vector(0, 0);
  var boid   = boids[j];

  if(boids.length===1) {
    vector = boid.loc.clone();
  } else {
    for(var i=0; i<boids.length; i++) {
      if(i!==j) {
        var current = boids[i].loc;
        vector.add(current);
      }
    }
    vector.x /= (boids.length-1)
    vector.y /= (boids.length-1)
  }
  return vector;
}

rules.neighbors = function(boids, j, radius) {
  var boid      = boids[j];
  var neighbors = [];
  for(var i=0; i<boids.length; i++) {
    if(i!==j) {
      var current = boids[i].loc;
      var distance = current.distanceTo(boid.loc);
      if(distance < radius) {
        neighbors.push(boids[i]);
      }
    }
  }
  return neighbors;
}

rules.cohesion = function(boids, j) {
  var neighbors = rules.neighbors(boids, j, 200);
  neighbors.push(boids[j]);
  var cntr = rules.center(neighbors, neighbors.length-1);

  cntr.subtract(boids[j].loc);
  cntr.x /= 100;
  cntr.y /= 100;

  return cntr;
};

rules.separation = function(boids, j) {
  var vector = new Vector(0, 0);
  for(var i=0; i<boids.length; i++) {
    if(i!==j) {
      var distanceVector = boids[i].loc.clone().subtract(boids[j].loc);
      var l = distanceVector.length();

      if(l < 20) {
        var x = Math.cos(l / 20 * Math.PI / 2);
        vector.subtract(distanceVector.scale(x));
      }
    }
  }
  return vector;
};

rules.alignment = function(boids, j) {
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

rules.wind = function(boids, j) {
  return new Vector(1.3, 1.1);
}

rules.moveToMouse = function(boids, j) {
  var v = mouse.clone().subtract(boids[j].loc);

  v.x /= 100;
  v.y /= 100;

  return v;
}

module.exports = rules;
