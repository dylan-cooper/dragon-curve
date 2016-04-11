//Takes an array, reverses it and flips rs and ls.
function reverseAndFlip(arr){
  arr2 = arr.map(function(val) {
     return (val === 'r') ? 'l' : 'r';
  });
  arr2.reverse();
  return arr2;
}

/**
 * Dragon Curve Object
 */

var DragonCurve = function(){
  this.curves = [['r'],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
}

DragonCurve.prototype.getDragonCurve = function(degree) {
  if (this.curves[degree].length === 0){
    arr = this.getDragonCurve(degree - 1);
    this.curves[degree] = arr.concat(['r'], reverseAndFlip(arr));
  }
  return this.curves[degree];
}

/*
 * Dragon Canvas Object
 */

var DragonCanvas = function (canvasID) {
  this.canvasID = canvasID;
  this.canvas = document.getElementById(this.canvasID);
  this.ctx = this.canvas.getContext('2d');
  this.color = '#0f0';
  this.curve = new DragonCurve();
  this.numberAnimations = 15;
  this.isAnimating = false;
}

DragonCanvas.prototype.move = function(direction, position, length) {
  switch(direction){
    case 'north':
      return [position[0], position[1] - length];
    case 'south':
      return [position[0], position[1] + length];
    case 'west':
      return [position[0] - length, position[1]];
    case 'east':
      return [position[0] + length, position[1]];
    case 'northwest':
      return [position[0] - (length/Math.sqrt(2)), position[1] - (length/Math.sqrt(2))];
    case 'northeast':
      return [position[0] + (length/Math.sqrt(2)), position[1] - (length/Math.sqrt(2))];
    case 'southwest':
      return [position[0] - (length/Math.sqrt(2)), position[1] + (length/Math.sqrt(2))];
    case 'southeast':
      return [position[0] + (length/Math.sqrt(2)), position[1] + (length/Math.sqrt(2))];
  }
}

DragonCanvas.prototype.draw = function(degree) {
  var self = this;
  var directions = ['south','southeast','east','northeast','north','northwest','west','southwest'];
  var pos = [self.canvas.width*13/20, self.canvas.height*7/20],
      len = Math.pow(0.5,degree/2)*self.canvas.width*0.42,
      currentDirection = directions[(degree) % 8];
  
  self.ctx.moveTo(pos[0], pos[1]);
  self.ctx.strokeStyle = self.color;
  
  dic = {
    'north':{'r':'east','l':'west'},
    'south':{'r':'west','l':'east'},
    'east':{'r':'south','l':'north'},
    'west':{'r':'north','l':'south'},
    'northeast':{'r':'southeast','l':'northwest'},
    'northwest':{'r':'northeast','l':'southwest'},
    'southeast':{'r':'southwest','l':'northeast'},
    'southwest':{'r':'northwest','l':'southeast'}
  }
  
  directions = self.curve.getDragonCurve(degree);
  pos = self.move(currentDirection, pos, len);
  self.ctx.lineTo(pos[0], pos[1]);
  
  directions.forEach(function(turn){
    currentDirection = dic[currentDirection][turn];
    pos = self.move(currentDirection, pos, len);
    self.ctx.lineTo(pos[0], pos[1]);
  });
  
  self.ctx.stroke();
}

DragonCanvas.prototype.animateDragon = function() {
  var self = this;
  if (self.isAnimating) {
    throw "Already animating."
  }
  self.isAnimating = true;
  
  for (i = 0; i < self.numberAnimations+1; i+=1){
    setTimeout(function(degree){
			self.clear();
      self.draw(degree);
      
      if (degree === self.numberAnimations) {
        self.isAnimating = false;
      }
    }, 500*i, i);
  }
}

DragonCanvas.prototype.clear = function() {
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  this.ctx.beginPath();
}
