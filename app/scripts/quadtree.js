function Quadtree(x1, y1, x2, y2, level) {
  this.x1 = x1;
  this.x2 = x2;
  this.y1 = y1;
  this.y2 = y2;

  this.objects = [];
  this.nodes   = [];
  this.leaf    = true;

  this.level   = level || 1;
}

Quadtree.prototype = {
  MAX_OBJECTS: 5,
  MAX_LEVEL:   5
}

Quadtree.prototype.insert = function(x, y) {
  if(isNaN(x) || isNaN(y)) return;
  if(this.leaf) {
    if(this.objects.length<this.MAX_OBJECTS || this.level === this.MAX_LEVEL) {
      this.objects.push({x: x, y: y});
      return this;
    } else {
      this.split();
      return this.insert(x, y);
    }
  } else {
    var upper = (y<(y2-y1)/2);
    var left  = (x<(x2-x1)/2);
    if(upper && left)  return this.nodes[0].insert(x, y);
    if(upper)          return this.nodes[1].insert(x, y);
    if(lower && left)  return this.nodes[2].insert(x, y);
    if(lower)          return this.nodes[3].insert(x, y);
  }
}

Quadtree.prototype.split = function() {

}

Quadtree.prototype.retrieve(x1, y1, x2, y2) {
  var points = [];

  return points;
}

module.exports = Quadtree;
