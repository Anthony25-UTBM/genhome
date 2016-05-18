"use strict";

class GenHome {
  constructor(args) {
    this.toolbar = new UIToolbar();
  }

  add_event_listeners() {
    
  }

  add_room() {
    console.log("Adding Room");
    this.toolbar.room_list.add_room(`Chambre ${room_counter++}`);
  }

  edit_room(name) {
    console.log("Editing Room", name);
  }

  remove_room(name) {
    console.log("Removing Room", name);
    this.toolbar.room_list.remove_room(name);
  }
}

const gen_home = new GenHome();
var room_counter = 1;