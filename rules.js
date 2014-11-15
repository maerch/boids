var Vector = require('./vector.js');

var rules = {};

rules.center = function(boids, j) {
  var vector = new Vector(0, 0);
  var boid   = boids[j];
  for(var i=0; i<boids.length; i++) {
    if(i!==j) {
      var current = boids[i].loc;
      vector.add(current);
    }
  }
  vector.x /= (boids.length-1)
  vector.y /= (boids.length-1)
  return vector;
}

rules.cohesion = function(boids, j) {
  var cntr = rules.center(boids,j);

  cntr.subtract(boids[j].loc);
  cntr.x /= 100
  cntr.y /= 100

  return cntr;
};

rules.separation = function(boids, j) {
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
  return new Vector(0.3, 0);
}

rules.moveToMouse = function(boids, j) {
  var v = mouse.clone().subtract(boids[j].loc);

  v.x /= 100;
  v.y /= 100;

  return v;
}

module.exports = rules;
