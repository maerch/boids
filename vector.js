
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
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  this.clone = function() {
    return new Vector(this.x, this.y);
  }

  this.distanceTo = function(anotherVector) {
    return Math.sqrt(Math.pow(this.x - anotherVector.x, 2) + Math.pow(this.y - anotherVector.y, 2));
  }

  this.wrap = function() {
    this.x = Math.min(this.x, canvas.width  - this.x);
    this.y = Math.min(this.y, canvas.height - this.y);
    return this;
  }
}

module.exports = Vector
