"use strict";

class GenHome {
  constructor(args) {
    this.toolbar = new UIToolbar();
    this.dialogs = new UIDialogs();
  }

  add_event_listeners() {
    
  }

  add_room() {
    console.log("Adding Room");
    this.dialogs.show_room((room) => {
      rooms[room.name] = room;
      this.toolbar.room_list.add_room(room.name);
    });
  }

  edit_room(name) {
    console.log("Editing Room", name);
    this.dialogs.show_room((room) => {
      if(name != room.name) {
        this.toolbar.room_list.remove_room(name);
        this.toolbar.room_list.add_room(room.name);
        delete rooms[name];
      }
      rooms[room.name] = room;
    }, undefined, rooms[name]);
  }

  remove_room(name) {
    console.log("Removing Room", name);
    this.toolbar.room_list.remove_room(name);
  }
}

const gen_home = new GenHome();
var room_counter = 1;
const rooms = {};
