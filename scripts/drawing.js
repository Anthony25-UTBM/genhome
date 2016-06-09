"use strict";

//public interface
var drawing = {};

/*
 * exemple of room & openings description
 */

var temp_openings = [
  {
    posx : 450,
    posy : 100,
    orientation : "horizontal",
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
    name : "cuisine",
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
  const TEXT_OFFSET = 40;
  const ZOOM_STEP = 0.1;

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

  function update_canvas_limits(posx, posy, width, height) {
      if( (posx - INNER_WALL_W) < canvas_limit.min_x ){
        canvas_limit.min_x = (posx - INNER_WALL_W);
      }
      if( (posy - INNER_WALL_W) < canvas_limit.min_y ){
        canvas_limit.min_y = (posy - INNER_WALL_W);
      }

      if( (posx + INNER_WALL_W + width) > canvas_limit.max_x ){
        canvas_limit.max_x = (posx + INNER_WALL_W + width);
      }
      if( (posy + INNER_WALL_W + height) > canvas_limit.max_y ){
        canvas_limit.max_y = (posy + INNER_WALL_W + height);
      }
  }

  //methods to draw openings on the canvas
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

      update_canvas_limits(r.posx, r.posy, r.width, r.height);

      //draw the text
      var room_name = svg_area
        .text(r.name)
        .x(r.posx + TEXT_OFFSET )
        .y(r.posy + TEXT_OFFSET );

      text_layer.add(room_name);
      
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

  //drag events on the drawing
  var svg_element = document.getElementById(SVG_ID);
  var ref_viewbox = svg_area.viewbox();
  var scaling_factor = 1;

  svg_element.onmousedown = function(e) {
    if(e.buttons == 1){

      var start_box = svg_area.viewbox();
      var start_e = {
        clientX : e.clientX,
        clientY : e.clientY
      };

      svg_element.onmousemove = function(e) {
        var new_box = {
          x : (start_box.x - (e.clientX - start_e.clientX ) * scaling_factor) ,
          y : (start_box.y - (e.clientY - start_e.clientY ) * scaling_factor) ,
          width : start_box.width,
          height : start_box.height
        }
        svg_area.viewbox(new_box);
      }

    }
  }

  svg_element.onmouseleave = function(e) {
    svg_element.onmousemove = null;
  }

  svg_element.onmouseup = function(e) {
    if(e.buttons != 1){
        svg_element.onmousemove = null;
    }
  }

  svg_element.onwheel = function(e) {
    var start_viewbox = svg_area.viewbox();
    var new_viewbox = {};
    var delta;
    
    if( e.deltaY < 0 ) {
      delta = -1;
    }
    else if ( e.deltaY > 0) {
      delta = 1;
    }

    scaling_factor += ZOOM_STEP * delta ;

    new_viewbox.height = ref_viewbox.height * scaling_factor;
    new_viewbox.width  = ref_viewbox.width  * scaling_factor;
    new_viewbox.x
      = start_viewbox.x + (( start_viewbox.width - new_viewbox.width ) /2)
    new_viewbox.y
      = start_viewbox.y + (( start_viewbox.height - new_viewbox.height ) /2)

    console.log(ref_viewbox);
    console.log(new_viewbox);

    if (new_viewbox.height <= 0 || new_viewbox.width <= 0) {
        return;
    }

    svg_area.viewbox(new_viewbox);
  }


}()) // end scope

drawing.draw_rooms(temp_rooms);
drawing.draw_openings(temp_openings);

// vim: set ts=2 sw=2:
