var debounce = require('debounce');
var ticker   = require('ticker');

var Vector   = require('./vector.js');
var Boid     = require('./boid.js');

var rules    = require('./rules.js');

var boidCount = 50;
var predCount = 3;
var foodCount = 3;
var fps       = 60;
var canvas   = document.createElement('canvas');
var ctx      = canvas.getContext('2d');

var cohesionColor = "#FFFF00";
var separationColor = "#83F52C";
var alignmentColor = "#67C8FF"

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
var rgba = hexToRgb(cohesionColor);
cohesionColor = "rgba("+rgba.r+", " + rgba.g + ", " + rgba.b + ", 0.3)"
var rgba = hexToRgb(separationColor);
separationColor = "rgba("+rgba.r+", " + rgba.g + ", " + rgba.b + ", 0.3)"
var rgba = hexToRgb(alignmentColor);
alignmentColor = "rgba("+rgba.r+", " + rgba.g + ", " + rgba.b + ", 0.3)"

var repulsionNeighborhood  = 100;
var attractionNeighborhood = 200;

var resizeCanvas = function() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.onresize = debounce(resizeCanvas, 200);
resizeCanvas();

var boids = [];
for(var i=0; i<boidCount; i++) {
  boids.push(new Boid(i));
}

var predators = [];
for(var i=0; i<predCount; i++) {
  predators.push(new Boid(i));
}

var food = [];
var maxResource = 200;
var growingRate = 0.1;
var eatingRate  = 0.2;
for(var i=0; i<foodCount; i++) {
  var foodBoid = new Boid(i);
  foodBoid.resources = maxResource;
  food.push(foodBoid);
}

var mouse = new Vector(0, 0);

document.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX || e.pageX;
  mouse.y = e.clientY || e.pageY;
}, false);


document.body.style.margin  = '0';
document.body.style.padding = '0';
document.body.appendChild(canvas);

var cohesion          = true;
var alignment         = true;
var separation        = true;

var predatorsOnCanvas = false;
var foodOnCanvas      = false;

var pause      = false;
var tracking   = false;

var drawNeighborCircle = function(boid, radius, color) {
  ctx.beginPath();
  ctx.arc(boid.loc.x, boid.loc.y, radius, 0, 2 * Math.PI, false);
  ctx.lineWidth = 1;
  ctx.shadowColor = color;
  ctx.fillStyle   = color;
  ctx.fill();
  ctx.closePath();
}

var drawFood = function(food, pulse) {
  pulse = (pulse && (pulse + 3)) || 1;
  ctx.beginPath();
  ctx.arc(food.loc.x, food.loc.y, 20, 0, 2 * Math.PI, false);
  ctx.lineWidth = 25 + Math.sin(pulse) * 5;
  ctx.shadowColor = '#BFFF00';
  ctx.strokeStyle = '#BFFF00';
  ctx.stroke();
  ctx.closePath();
};

var drawPredator = function(predator, pulse) {
  pulse = (pulse && (pulse + 3)) || 1;

  var spikes = 15
  var scale = 5;
  var outerRadius = 25 + Math.sin(pulse)*5;
  var innerRadius = 25 + Math.sin(pulse + Math.PI)*5;
  
  var rot=Math.PI/2*3;
  var x=predator.loc.x;
  var y=predator.loc.y;
  var cx=x;
  var cy=y
  var step=Math.PI/spikes;

  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#ff0000';
  ctx.fillStyle   = '#ff0000'
  ctx.beginPath();
  ctx.moveTo(cx,cy-outerRadius)
  for(i=0;i<spikes;i++){
    x=cx+Math.cos(rot)*outerRadius;
    y=cy+Math.sin(rot)*outerRadius;
    ctx.lineTo(x,y)
    rot+=step

    x=cx+Math.cos(rot)*innerRadius;
    y=cy+Math.sin(rot)*innerRadius;
    ctx.lineTo(x,y)
    rot+=step
  }
  ctx.lineTo(cx,cy-outerRadius);
  ctx.lineWidth = 8
  ctx.stroke();
  ctx.closePath();
}

var drawBoid = function(boid) {
  var scale = 5;

  var velocity = boid.vel;

  ctx.beginPath();
  ctx.lineWidth = 1;
  // 1) Move to front
  ctx.moveTo(boid.loc.x + velocity.x * scale, boid.loc.y + velocity.y * scale);
  // 2) Draw to the back
  ctx.lineTo(boid.loc.x - velocity.x * 2 * scale, boid.loc.y - velocity.y * 2 * scale);
  // 3) Draw to the left site
  ctx.lineTo(boid.loc.x + velocity.x * scale, boid.loc.y - velocity.y * scale);
  // 4) Draw to the front
  ctx.lineTo(boid.loc.x + velocity.x * scale, boid.loc.y + velocity.y * scale);
  // 5) Draw to the right site
  ctx.lineTo(boid.loc.x - velocity.x * scale, boid.loc.y + velocity.y * scale);
  // 6) Draw to the back
  ctx.lineTo(boid.loc.x - velocity.x * 2 * scale, boid.loc.y - velocity.y * 2 * scale);
  // 7) Move back to right site
  ctx.moveTo(boid.loc.x - velocity.x * scale, boid.loc.y + velocity.y * scale);
  // 8) Draw to left site
  ctx.lineTo(boid.loc.x + velocity.x * scale, boid.loc.y - velocity.y * scale);

  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#ff00ff';
  ctx.stroke();
}

var pattern;
var img = new Image();
img.src = 'http://subtlepatterns.com/patterns/subtle_carbon.png'

img.onload = function(){
    pattern = ctx.createPattern(img, 'repeat'); 
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

var wrap = function(boid) {
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
}

var pulse = 0;
ticker(window, fps).on('tick', function() {
  if(pause) return;

  if(predatorsOnCanvas) {
    predators.forEach(function(predator) {
      var apply = [];
      var neighborPredators = rules.neighbors(predator, predators, 50);
      var neighborBoids     = rules.neighbors(predator, boids, 150);

      apply.push(rules.separation(predator, neighborPredators));
      apply.push(rules.cohesion(predator, neighborBoids));

      apply.forEach(function(rule) {
        predator.vel.x = predator.vel.x + rule.x;
        predator.vel.y = predator.vel.y + rule.y;
      })

      predator.vel.normalize().scale(0.5);
      predator.loc.add(predator.vel);
      wrap(predator);
    });
  }

  if(foodOnCanvas) {
    food.forEach(function(f) {
      if(f.resources < maxResource) {
        f.resources += growingRate;
      }
    })
  }

  boids.forEach(function(boid, i) {

    var apply = [];
    var neighbors50  = rules.neighbors(boid, boids, 50);
    var neighbors150 = rules.neighbors(boid, boids, 150);

    if(cohesion)
      apply.push(rules.cohesion(boid, neighbors50));
    if(separation)
      apply.push(rules.separation(boid, neighbors50));
    if(alignment)
      apply.push(rules.alignment(boid, neighbors150));

    if(foodOnCanvas) {
      food.forEach(function(f) {
        var distance = f.loc.distanceTo(boid.loc);
        if(distance < f.resources) 
          apply.push(rules.attraction(boid, f.loc, 300));
        if(distance < 30) {
          f.resources -= eatingRate;
        }
      })
    }

    if(predatorsOnCanvas) {
      predators.forEach(function(predator) {
        if(predator.loc.distanceTo(boid.loc) < repulsionNeighborhood) 
          apply.push(rules.repulsion(boid, predator.loc));
      });
    }

    apply.forEach(function(rule) {
      boid.vel.x = boid.vel.x + rule.x;
      boid.vel.y = boid.vel.y + rule.y;
    })

    if(boid.vel.length()>3) {
      boid.vel.normalize().scale(3);
    }

    boid.loc.add(boid.vel);
    wrap(boid);
  });
  
}).on('draw', function() {
  if(pause) return;
  pulse += 0.1
  pulse = pulse % (Math.PI * 2);

  var halfHeight = canvas.height/2
  var halfWidth  = canvas.width/2

  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(foodOnCanvas) {
    food.forEach(function(f) {
      var r = f.resources > 5 ? f.resources : 5
      drawNeighborCircle(f, r, "rgba(0, 255, 0, 0.2)");
      drawFood(f, pulse);
    })
  }

  if(predatorsOnCanvas) {
    predators.forEach(function(predator, i) {
      if(tracking) {
        drawNeighborCircle(predator, repulsionNeighborhood, "rgba(255, 0, 0, 0.5)");
      }
      drawPredator(predator, pulse);
    })
  }

  if(alignment && tracking) {
    drawNeighborCircle(boids[0], 150, alignmentColor);
  }
  if(cohesion && tracking) {
    if(separation) {
      if(pulse > Math.PI)
        drawNeighborCircle(boids[0], 50, cohesionColor);
    } else {
      drawNeighborCircle(boids[0], 50, cohesionColor);
    }
  }
  if(separation && tracking) {
    if(cohesion) {
      if(pulse < Math.PI)
        drawNeighborCircle(boids[0], 50, separationColor);
    } else {
      drawNeighborCircle(boids[0], 50, separationColor);
    }
  }

  boids.forEach(function(boid, i) {
    drawBoid(boid);
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
$("#predators").change(function () {
  predatorsOnCanvas = $(this).is(":checked");
}).change();
$("#food").change(function () {
  foodOnCanvas = $(this).is(":checked");
}).change();

$("#menu-trigger").on('click', function() {
  $("body").toggleClass("active");
});
$("#pause-trigger").on('click', function() {
  var li = $("#pause-trigger > i");
  li.toggleClass("fa-pause");
  li.toggleClass("fa-play");
  pause = !pause;
});
$("#tracking-trigger").on('click', function() {
  var li = $("#tracking-trigger > i");
  li.toggleClass("fa-circle-thin");
  li.toggleClass("fa-circle");
  tracking = !tracking;
});
