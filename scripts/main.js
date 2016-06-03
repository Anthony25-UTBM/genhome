"use strict";

class GenHome {
  constructor() {
    this.toolbar = new UIToolbar();
    this.dialogs = new UIDialogs();

    this.rooms = {};
  }

  add_event_listeners() {
    
  }

  add_room() {
    console.log("Adding Room");
    this.dialogs.show_room((room) => {
      this.rooms[room.name] = room;
      this.toolbar.room_list.add_room(room.name);
    });
  }

  edit_room(name) {
    console.log("Editing Room", name);
    this.dialogs.show_room((room) => {
      if(name != room.name) {
        this.remove_room(name);
        this.toolbar.room_list.add_room(room.name);
      }
      this.rooms[room.name] = room;
      gen_home.currentRoom = undefined;
    }, undefined, this.rooms[name]);
    gen_home.currentRoom = name;
  }

  remove_room(name) {
    console.log("Removing Room", name);
    this.toolbar.room_list.remove_room(name);
    delete this.rooms[name];
  }

  add_constraint() {
    console.log("Adding Constraint");
    // this.dialogs.show_room((room) => {
    //   this.rooms[room.name] = room;
    //   this.toolbar.room_list.add_room(room.name);
    // });
  }
}

const gen_home = new GenHome();
