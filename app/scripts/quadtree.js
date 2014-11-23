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

Quadtree.prototype.insert = function(object) {
  var x = object.x;
  var y = object.y;
  if(isNaN(x) || isNaN(y)) return;

  if(this.leaf) {
    if(this.objects.length<this.MAX_OBJECTS || this.level === this.MAX_LEVEL) {
      this.objects.push(object);
      return this;
    } else {
      this.split();
      return this.insert(object);
    }
  } else {
    var upper = (y<(this.y2-this.y1)/2);
    var lower = !upper;
    var left  = (x<(this.x2-this.x1)/2);
    var right = !left;
    if(upper && left)  return this.nodes[0].insert(object);
    if(upper && right) return this.nodes[1].insert(object);
    if(lower && left)  return this.nodes[2].insert(object);
    if(lower && right) return this.nodes[3].insert(object);
  }
}

Quadtree.prototype.split = function() {
  var x1 = this.x1, x2 = this.x2, y1 = this.y1, y2 = this.y2, level = this.level;

  this.leaf     = false;
  this.nodes[0] = new Quadtree(x1,        y1,        (x2-x1)/2, (y2-y1)/2, level+1);
  this.nodes[1] = new Quadtree((x2-x1)/2, y1,         x2,       (y2-y1)/2, level+1);
  this.nodes[2] = new Quadtree(x1,        (y2-y1)/2, (x2-x1)/2, y2,        level+1);
  this.nodes[3] = new Quadtree((x2-x1)/2, (y2-y1)/2, x2,        y2,        level+1);

  this.objects.forEach(function(object) {
    this.insert(object);
  }.bind(this));
  this.objects.length = 0;
}

Quadtree.prototype.retrieve = function(x1, y1, x2, y2) {
  var points = [];

  return points;
}

module.exports = Quadtree;
