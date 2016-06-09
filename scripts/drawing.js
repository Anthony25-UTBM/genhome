"use strict";

//public interface
var drawing = {};

/*
 * exemple of room & openings description
 */

var temp_openings = [
  {
    posx : 100,
    posy : 150,
    orientation : "vertical",
    type : "door"
  },
  {
    posx : 300,
    posy : 150,
    orientation : "vertical",
    type : "door"
  },
  {
    posx : 350,
    posy : 250,
    orientation : "horizontal",
    type : "door"
  },
  {
    posx : 350,
    posy : 400,
    orientation : "horizontal",
    type : "window"
  },
  {
    posx : 500,
    posy : 400,
    orientation : "horizontal",
    type : "window"
  },
  {
    posx : 300,
    posy : 320,
    orientation : "vertical",
    type : "window"
  }
];

var temp_rooms = [
  {
    name : "chambre 1" ,
    height : 150,
    width : 200,
    posx : 100,
    posy : 100
  },
  {
    name : "salon",
    height : 150,
    width : 250,
    posx : 300,
    posy : 100
  },
  {
    name : "salon",
    height : 150,
    width : 250,
    posx : 300,
    posy : 250
  }
];

(function (){ // begin scope

  const INNER_WALL_W = 4;
  const OPENING_SIZE = 30;
  const SVG_ID = 'drawing';

  var room_colors = [
    "blue",
    "green",
    "yellow",
    "red",
  ];

  var svg_area = SVG(SVG_ID).size("100%", "100%");

  //layer containing objects
  //the order matters when drawing
  var floor_layer = svg_area
    .group()
    .addClass("drawing__room_floor");
  var wall_layer = svg_area
    .group()
    .addClass("drawing__room");
  var opening_layer = svg_area
    .group()
    .addClass("drawing__opening");
  var hole_mask_layer = svg_area
    .group()
    .addClass("drawing__opening_holes");
  var text_layer = svg_area
    .group()
    .addClass("drawing__text");

  //the canvas max and min values, used when creating masks
  var canvas_limit = {
    min_x : 0,
    min_y : 0,
    max_x : 0,
    max_y : 0,
  };

  //contains methods to draw different openings on the canvas
  var opening_model = {};
  opening_model.door = function(svg_area, posx, posy, size, orientation) {
    //posx passed to the function is the middle of the door
    var x, y;
    if (orientation == "horizontal") {
      x = posx - (size/2);
      y = posy;
    }
    else {
      x = posx;
      y = posy - (size/2);
    }
    return svg_area
      .path(" M "+x+" "+y
          + " h "+size
          + " c "+0+" "+(size/2)+" "+(-size/2)+" "+size+" "+(-size)+" "+size
          + " v "+(-size));
  }

  opening_model.window = function(svg_area, posx, posy, size, orientation) {
    //posx passed to the function is the middle of the door
    var x, y;
    var window_shape;

    if (orientation == "horizontal") {
      window_shape = svg_area
        .rect(size, INNER_WALL_W)
        .x(posx - (size/2) )
        .y(posy - INNER_WALL_W / 2 );
    }
    else {
      window_shape = svg_area
        .rect(INNER_WALL_W, size)
        .x( posx - INNER_WALL_W / 2 )
        .y( posy - (size/2) );
    }

    return window_shape
  }

  //public methods
  drawing.draw_rooms = function( rooms ) {

    for (var i=0; i<rooms.length; i++) {
      var r = rooms[i];

      var floor_rect = svg_area
        .rect(r.width , r.height )
        .x(r.posx)
        .y(r.posy)
        .fill(room_colors[ i % room_colors.length ]);

      floor_layer.add(floor_rect);

      //draw the walls
      var room_rect = svg_area
        .rect(r.width , r.height )
        .x(r.posx)
        .y(r.posy);

      wall_layer.add(room_rect);

      //update the canvas size
      if( (r.posx - INNER_WALL_W) < canvas_limit.min_x ){
        canvas_limit.min_x = (r.posx - INNER_WALL_W);
      }
      if( (r.posy - INNER_WALL_W) < canvas_limit.min_y ){
        canvas_limit.min_y = (r.posy - INNER_WALL_W);
      }

      if( (r.posx + INNER_WALL_W + r.width) > canvas_limit.max_x ){
        canvas_limit.max_x = (r.posx + INNER_WALL_W + r.width);
      }
      if( (r.posy + INNER_WALL_W + r.height) > canvas_limit.max_y ){
        canvas_limit.max_y = (r.posy + INNER_WALL_W + r.height);
      }
    }
  }

  drawing.draw_openings = function( openings ) {

    //put global mask contour in the path
    var holes_path = "M" + canvas_limit.min_x + " " + canvas_limit.min_y
      + " H " + canvas_limit.max_x
      + " V " + canvas_limit.max_y
      + " H " + canvas_limit.min_x
      + " V " + canvas_limit.min_y
      + "z";

    for (var i=0; i<openings.length; i++) {
      var o = openings[i];

      var opening_shape = opening_model[o.type](
          svg_area,
          o.posx, o.posy,
          OPENING_SIZE,
          o.orientation);

      opening_layer.add(opening_shape);

      if(o.orientation == "horizontal"){
        holes_path += "M " + (o.posx - (OPENING_SIZE/2))
          + " "   + (o.posy - INNER_WALL_W)
          + " v " + INNER_WALL_W*2
          + " h " + OPENING_SIZE
          + " v " + (-INNER_WALL_W*2)
          + " h " + (-OPENING_SIZE)
          + "z"
      }
      else {
        holes_path += "M " + (o.posx - INNER_WALL_W) 
          + "   " + (o.posy - (OPENING_SIZE/2))
          + " v " + OPENING_SIZE
          + " h " + INNER_WALL_W*2
          + " v " + (-OPENING_SIZE)
          + " h " + (-INNER_WALL_W*2)
          + "z"
      }
    }

    var mask = svg_area
      .path(holes_path);

    hole_mask_layer.add(mask);

    wall_layer.clipWith(mask);
  }

}()) // end scope

drawing.draw_rooms(temp_rooms);
drawing.draw_openings(temp_openings);

// vim: set ts=2 sw=2:
