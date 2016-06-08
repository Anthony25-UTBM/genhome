"use strict";

drawing = {};

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
    }
];

(function (){ // begin scope

const INNER_WALL_W = 4;
const OPENING_SIZE = 20;
const SVG_ID = 'drawing';
var svg_area = SVG(SVG_ID).size("100%", "100%");

drawing.draw_rooms = function( rooms ) {

    for (var i=0; i<rooms.length; i++) {
        var r = rooms[i];
        var room_rect = svg_area
           .rect(r.width , r.height )
           .x(r.posx)
           .y(r.posy)
           .addClass("drawing__room");
    }
}

drawing.draw_openings = function( openings ) {
    for (var i=0; i<openings.length; i++) {
        var o = openings[i];
        var h = 0;
        var w = 0;

        if( o.orientation == "horizontal" ) {
           h = INNER_WALL_W * 2 ;
           w = OPENING_SIZE ;
        } else if ( o.orientation == "vertical" ){
           w = INNER_WALL_W ;
           h = OPENING_SIZE ;
        }
        svg_area
            .rect(w, h)
            .x(o.posx - INNER_WALL_W /2 )
            .y(o.posy - INNER_WALL_W /2 )
            .addClass("drawing__opening");
    }
}

}()) // end scope

drawing.draw_rooms(temp_rooms);
drawing.draw_openings(temp_openings);

// vim: set ts=2 sw=2:
