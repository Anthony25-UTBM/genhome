"using strict";

var ORIENTATION = {
    horizontal: 0,
    vertical: 1
};

class Opening {
  constructor(orientation, posx=0, posy=0) {
    orientation = orientation;
    this.posx = posx;
    this.posy = posy;
  }
}

class Room {
  constructor(posx=0, posy=0, height=0, width=0) {
    this.posx = posx;
    this.posy = posy;
    this.height = height;
    this.width = width;
  }
}

// vim: set ts=2 sw=2:
