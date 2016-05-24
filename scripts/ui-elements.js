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
    li.setAttribute('tabindex', 0);
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
    this.confirm_button = this.elmt.querySelector(".form__action--primary");
    this.cancel_button = this.elmt.querySelector(".form__action--secondary");
    this.form = document.forms.item('room-dialog');

    this.block_clicks = this.block_clicks.bind(this);
    this.on_confirm = this.on_confirm.bind(this);
    this.on_cancel = this.on_cancel.bind(this);
    this.confirm = () => {};
    this.cancel = () => {};
  }

  show(confirm, cancel, room) {
    this.elmt.classList.add('modal--visible');


    if(room) {
      console.log('Room:', room);

      this.form.name.value = room.name;
      this.form.width.value = room.width;
      this.form.height.value = room.height;
      this.form.window_count.value = room.window_count;
    }

    this.confirm = confirm.bind(this);
    this.cancel = cancel.bind(this);

    this.add_event_listeners();
  }

  hide() {
    this.elmt.classList.remove('modal--visible');
    this.form.reset();
    this.remove_event_listeners();
  }

  add_event_listeners() {
    this.elmt.addEventListener('click', this.block_clicks);
    this.cancel_button.addEventListener('click', this.on_cancel);
    this.form.addEventListener('submit', this.on_confirm);
  }

  remove_event_listeners() {
    this.confirm = () => {};
    this.cancel = () => {};
    this.cancel_button.removeEventListener('click', this.on_cancel);
    this.form.removeEventListener('submit', this.on_confirm);
  }

  on_confirm(evt) {
    evt.preventDefault();

    const name = this.form.name.value;
    const width = this.form.width.value;
    const height = this.form.height.value;
    const window_count = this.form.window_count.value;


    this.confirm({name, width, height, window_count});
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

    this.dialogs = {
      room: new UIRoomDialog()
    };

    this.add_event_listeners();
  }

  show_room(confirm, cancel, room) {
    this.show(this.dialogs.room, confirm, cancel, room);
  }

  show(dialog, confirm = () => {}, cancel = () => {}, data) {
    this.elmt.classList.add('modal__container--visible');
    dialog.show((details) => {
      confirm(details);
      this.hide();
    }, () => {
      cancel();
      this.hide();
    }, data);
  }

  hide() {
    this.elmt.classList.remove('modal__container--visible');
    for(let dialog in this.dialogs) {
      this.dialogs[dialog].hide();
    }
  }

  add_event_listeners() {
    this.elmt.addEventListener('click', this.hide);
  }
}