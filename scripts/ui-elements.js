"use strict";

class UIToolbar {
  constructor() {
    this.elmt = document.querySelector('.js-toolbar');
    this.room_list = new UIRoomList();
  }

  add_event_listeners() {

  }
}

class UIRoomList {
  constructor() {
    this.elmt = document.querySelector('.js-room-list');
    this.add_button = this.elmt.lastElementChild;

    this.rooms = {};

    this.add_event_listeners();
  }

  add_room(name) {
    const room = UIElements.create_room_list_item(name, gen_home.edit_room.bind(gen_home, name), gen_home.remove_room.bind(gen_home, name));
    this.rooms[name] = room;
    this.elmt.insertBefore(room, this.add_button);
  }

  remove_room(name) {
    this.elmt.removeChild(this.rooms[name]);
  }

  add_event_listeners() {
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

class UIRoomDialog {
  constructor() {
    this.elmt = document.querySelector(".js-room-modal");
    this.confirm_button = this.elmt.querySelector(".modal__actions--primary");
    this.cancel_button = this.elmt.querySelector(".modal__actions--secondary");

    this.block_clicks = this.block_clicks.bind(this);
    this.on_confirm = this.on_confirm.bind(this);
    this.on_cancel = this.on_cancel.bind(this);
    this.confirm = () => {};
    this.cancel = () => {};
  }

  show(confirm, cancel) {
    this.elmt.classList.add('modal--visible');

    this.confirm = confirm.bind(this);
    this.cancel = cancel.bind(this);

    this.add_event_listeners();
  }

  hide() {
    this.elmt.classList.remove('modal--visible');
    this.remove_event_listeners();
  }

  add_event_listeners() {
    this.elmt.addEventListener('click', this.block_clicks);
    this.confirm_button.addEventListener('click', this.on_confirm);
    this.cancel_button.addEventListener('click', this.on_cancel);
  }

  remove_event_listeners() {
    this.confirm = () => {};
    this.cancel = () => {};
    this.confirm_button.removeEventListener('click', this.on_confirm);
    this.cancel_button.removeEventListener('click', this.on_cancel);
  }

  on_confirm() {
    this.confirm();
  }

  on_cancel() {
    this.cancel();
  }

  block_clicks (evt) {
    evt.stopPropagation();
  }
}

class UIDialogs {
  constructor() {
    this.elmt = document.querySelector(".js-modal-container");

    this.hide = this.hide.bind(this);

    this.room_dialog = new UIRoomDialog();

    this.add_event_listeners();
  }

  show(confirm = () => {}, cancel = () => {}) {
    this.elmt.classList.add('modal__container--visible');
    this.room_dialog.show(() => {
      confirm();
      this.hide();
    }, () => {
      cancel();
      this.hide();
    });
  }

  hide() {
    this.elmt.classList.remove('modal__container--visible');
    this.room_dialog.hide();
  }

  add_event_listeners() {
    this.elmt.addEventListener('click', this.hide);
  }
}