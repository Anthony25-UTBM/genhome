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
        orientation : "vertical"
    },
    {
        posx : 300,
        posy : 150,
        orientation : "vertical"
    },
    {
        posx : 350,
        posy : 250,
        orientation : "horizontal"
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

var svg_area = SVG(SVG_ID).size("100%", "100%");

//layer containing objects
var wall_layer = svg_area.group();
var floor_layer = svg_area.group();
var opening_layer = svg_area.group();
var opening_holes_layer = svg_area.group();

//the canvas max and min values, used when creating masks
var canvas_limit = {
    min_x : 0,
    min_y : 0,
    max_x : 0,
    max_y : 0,
}

//contains methods to draw different openings on the canvas
var opening_model = {}
opening_model.door = function(svg_area, posx, posy, size, orientation) {
    //posx passed to the function is the middle of the door
    var x, y
    if (orientation == "horizontal") {
        x = posx - (size/2)
        y = posy
    }
    else {
        x = posx
        y = posy - (size/2)
    }
    return svg_area
        .path(" M "+x+" "+y
                + " h "+size
                + " c "+0+" "+(size/2)+" "+(-size/2)+" "+size+" "+(-size)+" "+size
                + " v "+(-size))
        .addClass("drawing__door");
}

//public methods
drawing.draw_rooms = function( rooms ) {

    for (var i=0; i<rooms.length; i++) {
        var r = rooms[i];

        //draw the walls
        var room_rect = svg_area
           .rect(r.width , r.height )
           .x(r.posx)
           .y(r.posy)
           .addClass("drawing__room");
        
        wall_layer.add(room_rect)

        //update the canvas size
        if( (r.posx - INNER_WALL_W) < canvas_limit.min_x )
            canvas_limit.min_x = (r.posx - INNER_WALL_W)
        if( (r.posy - INNER_WALL_W) < canvas_limit.min_y )
            canvas_limit.min_y = (r.posy - INNER_WALL_W)

        if( (r.posx + INNER_WALL_W + r.width) > canvas_limit.max_x )
            canvas_limit.max_x = (r.posx + INNER_WALL_W + r.width)
        if( (r.posy + INNER_WALL_W + r.height) > canvas_limit.max_y )
            canvas_limit.max_y = (r.posy + INNER_WALL_W + r.height)
    }
}

drawing.draw_openings = function( openings ) {

    //put global mask contour in the path
    var holes_path = "M" + canvas_limit.min_x + " " + canvas_limit.min_y
        + " H " + canvas_limit.max_x
        + " V " + canvas_limit.max_y
        + " H " + canvas_limit.min_x
        + " V " + canvas_limit.min_y
        + "z"

    for (var i=0; i<openings.length; i++) {
        var o = openings[i];

        var opening_shape = opening_model.door(
                svg_area,
                o.posx, o.posy,
                OPENING_SIZE,
                o.orientation)

        opening_layer.add(opening_shape)

        if(o.orientation == "horizontal"){
            holes_path += "M " + (o.posx - (OPENING_SIZE/2))+" "+ (o.posy - INNER_WALL_W)
                + " v " + INNER_WALL_W*2
                + " h " + OPENING_SIZE
                + " v " + (-INNER_WALL_W*2)
                + " h " + (-OPENING_SIZE)
                + "z"
        }
        else {
            holes_path += "M " + (o.posx - INNER_WALL_W) +" "+ (o.posy - (OPENING_SIZE/2))
                + " v " + OPENING_SIZE
                + " h " + INNER_WALL_W*2
                + " v " + (-OPENING_SIZE)
                + " h " + (-INNER_WALL_W*2)
                + "z"
        }
    }

    var mask = svg_area
        .path(holes_path)
        .addClass("drawing__opening_holes");

    wall_layer.clipWith(mask);
}

}()) // end scope

drawing.draw_rooms(temp_rooms);
drawing.draw_openings(temp_openings);

// vim: set ts=2 sw=2:
