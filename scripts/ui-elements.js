"use strict";

class UIToolbar {
  constructor() {
    this.elmt = document.querySelector('.js-toolbar');
    this.room_list = new UIRoomList();
  }

  add_events_listeners() {

  }
}

class UIRoomList {
  constructor() {
    this.elmt = document.querySelector('.js-room-list');
    this.add_button = this.elmt.lastElementChild;

    this.rooms = {};

    this.add_events_listeners();
  }

  add_room(name) {
    const room = UIElements.create_room_list_item(name, gen_home.edit_room.bind(gen_home, name), gen_home.remove_room.bind(gen_home, name));
    this.rooms[name] = room;
    this.elmt.insertBefore(room, this.add_button);
  }

  remove_room(name) {
    this.elmt.removeChild(this.rooms[name]);
  }

  add_events_listeners() {
    this.add_button.addEventListener('click', this.on_add);
  }

  on_add() {
    gen_home.add_room();
  }
}

class UIElements {
  constructor() {
    // code
  }

  static create_room_list_item(name, on_edit, on_remove) {

    const li = document.createElement("li");
    li.classList.add('toolbar__list-item');
    li.innerHTML = `<label class="list-item__label">${name}</label><button class="list-item__button" type="button"><span class="material-icons">close</span></button>`;

    li.addEventListener('click', () => on_edit());
    li.querySelector('button').addEventListener('click', (evt) => {
      evt.stopPropagation();
      on_remove();
    });

    return li;
  }
}