var Vector = require('./vector.js');

var rules = {};

rules.center = function(boid, boids) {
  if(boids.length===1) {
    return boid.loc.clone();
  } else {
    var vector = new Vector(0, 0);
    boids.forEach(function(current) {
      if(current.id!==boid.id) {
        vector.add(current.loc);
      }
    });
    return vector.divide(boids.length-1);
  }
}

rules.neighbors = function(boid, boids, radius) {
  var neighbors = [];
  boids.forEach(function(current) {
    if(current.id!==boid.id) {
      var distance = current.loc.distanceTo(boid.loc);
      if(distance < radius) {
        neighbors.push(current);
      }
    }
  });
  return neighbors;
}

rules.cohesion = function(boid, neighbors) {
  neighbors.push(boid);
  var cntr = rules.center(boid, neighbors);
  return cntr.subtract(boid.loc).divide(100);
};

rules.separation = function(boid, neighbors) {
  var vector = new Vector(0, 0);
  neighbors.forEach(function(neighbor) {
    if(boid.id!=neighbor.id) {
      var distanceVector = neighbor.loc.clone().subtract(boid.loc);
      var distance       = distanceVector.length();

      if(distance < 20) {
        if(distance===0) 
          distance = 0.0001;
        distanceVector.scale(-Math.log(distance)+3);
        vector.subtract(distanceVector);
      }
    }
  })
  return vector;
};

rules.alignment = function(boid, neighbors) {
  var vector = new Vector(0, 0);
  if(neighbors.length === 0) return new Vector(0, 0);
  neighbors.forEach(function(neighbor) {
    vector.add(neighbor.vel);
  })

  vector.divide(neighbors.length);
  vector.subtract(boid.vel);
  vector.divide(8);

  return vector;
};

rules.attraction = function(boid, attractedToVec) {
  return attractedToVec.clone().subtract(boid.loc).divide(40);
}

rules.repulsion = function(boid, repulsedByVec) {
  return rules.attraction(boid, repulsedByVec).scale(-3);
}

module.exports = rules;
