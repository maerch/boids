var Vector = require('./vector.js');

function Boid(x, y) {
  this.loc = new Vector(
                  Math.round(Math.random() * window.innerWidth), 
                  Math.round(Math.random() * window.innerHeight)
                );
  this.vel = new Vector(Math.random()*2-1, Math.random()*2-1).normalize();
  this.speed = 3;
  this.color = "rgb(" + Math.round(Math.random()*255) + "," +
                        Math.round(Math.random()*255) + "," +
                        Math.round(Math.random()*255) + ")";
  console.log("Created random color " + this.color);
}

module.exports = Boid
