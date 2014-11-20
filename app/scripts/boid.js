var Vector = require('./vector');

function Boid(id) {
  this.loc = new Vector(
                  Math.round(Math.random() * window.innerWidth), 
                  Math.round(Math.random() * window.innerHeight)
                );
  this.vel = new Vector(Math.random()*2-1, Math.random()*2-1).normalize();
  this.id  = id
}

module.exports = Boid
