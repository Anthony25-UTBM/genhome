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

    this.on_keydown = this.on_keydown.bind(this);
    this.on_keyup = this.on_keyup.bind(this);

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
    this.add_button.addEventListener('keydown', this.on_keydown);
    this.add_button.addEventListener('keyup', this.on_keyup);
  }

  on_add() {
    gen_home.add_room();
  }

  on_keydown(evt) {
    if(evt.key == "Enter")
      this.on_add();
  }

  on_keyup (evt) {
    if(evt.key == " ")
      this.on_add();
  }
}

class UIInput {
  constructor(selector) {
    this.input = document.querySelector(selector);
    this.label = this.input.previousElementSibling;
    this.container = this.input.parentElement;
    this.errors = [];

    this.on_focus = this.on_focus.bind(this);
    this.on_blur = this.on_blur.bind(this);
    this.auto = this.auto.bind(this);
    this.reset = this.reset.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.add_error = this.add_error.bind(this);

    this.add_event_listeners();
  }

  auto() {
    if(this.input.value !== "")
      this.activate();
  }

  reset() {
    this.show().deactivate();
  }

  activate() {
    this.label.classList.add('form__label--active');
    return this;
  }

  deactivate() {
    this.label.classList.remove('form__label--active');
    return this;
  }

  show() {
    this.label.classList.remove('form__label--hidden');
    return this;
  }

  hide() {
    this.label.classList.add('form__label--hidden');
    return this;
  }

  checkValidity() {
    return this.errors.every((error) => !error.active);
  }

  add_error(message, event_name, test) {

    const error = {
      message: message,
      event_name: event_name,
      test: test,
      node: UIElements.create_form_error_message(message),
      active: false
    };

    error.listener = function() {
      if(test(this.input.value)) {
        error.node.classList.add('form__error--active');
        error.active = true;
      } else {
        error.node.classList.remove('form__error--active');
        error.active = false;
      }

      this.container.classList.toggle("input__container--error", this.errors.some((error) => error.active));
    };

    this.input.addEventListener(event_name, error.listener.bind(this));
    this.container.appendChild(error.node);

    return this.errors.push(error);
  }

  remove_error(message) {
    const i = this.errors.findIndex((error) => error.message == message);

    let error = this.errors.splice(i, 1);

    this.input.removeEventListener(error.event_name, error.listener);
    this.container.removeChild(error.node);
  }

  add_event_listeners() {
    this.input.addEventListener('focus', this.on_focus);
    this.input.addEventListener('blur', this.on_blur);
  }

  remove_event_listeners() {
    this.input.removeEventListener('focus', this.on_focus);
    this.input.removeEventListener('blur', this.on_blur);
  }

  on_focus() {
    this.show().activate();
  }

  on_blur() {
    if(this.input.value !== "")
      this.hide();
    else
      this.deactivate();
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
    li.innerHTML = `<label class="list-item__label">${name}</label><button class="list-item__button" type="button" tabindex="0"><span class="material-icons">close</span></button>`;

    li.addEventListener('click', () => on_edit());
    li.addEventListener('keydown', (evt) => evt.key == "Enter"? on_edit(): () => {});
    li.addEventListener('keyup', (evt) => evt.key == " "? on_edit(): () => {});

    const button = li.querySelector('button');

    button.addEventListener('click', (evt) => {
      evt.stopPropagation();
      on_remove();
    });
    button.addEventListener('keydown', (evt) => {
      evt.stopPropagation();
      if(evt.key == "Enter")
        on_remove();
    });
    button.addEventListener('keyup', (evt) => {
      evt.stopPropagation();
      if(evt.key == " ")
        on_remove();
    });

    return li;
  }

  static create_form_error_message(message) {
    const span = document.createElement('span');
    span.className = "form__error";
    span.innerText = message;

    return span;
  }
}

class UIRoomDialog {
  constructor() {
    this.elmt = document.querySelector(".js-room-modal");
    this.confirm_button = this.elmt.querySelector(".form__action--primary");
    this.cancel_button = this.elmt.querySelector(".form__action--secondary");
    this.form = document.forms.item('room-dialog');

    this.inputs = {
      name: new UIInput('#room-modal__name'),
      length: new UIInput('#room-modal__length'),
      width: new UIInput('#room-modal__width'),
      window_count: new UIInput('#room-modal__window-count')
    };

    this.inputs.name.add_error("Ce nom n'est pas disponible", 'input', (name) => {
      let test = false;
      // Get room name
      for(let room in gen_home.rooms)
        test = test || room == name;
      return test;
    });

    this.checkValidity = this.checkValidity.bind(this);
    this.block_clicks = this.block_clicks.bind(this);
    this.on_confirm = this.on_confirm.bind(this);
    this.on_cancel = this.on_cancel.bind(this);
    this.confirm = () => {};
    this.cancel = () => {};
  }

  checkValidity() {
    let validity = true;
    for(let input_name in this.inputs)
      validity = validity && this.inputs[input_name].checkValidity();
    return validity;
  }

  show(confirm, cancel, room) {
    this.elmt.classList.add('modal--visible');


    if(room) {
      console.log('Room:', room);

      this.form.name.value = room.name;
      this.form.width.value = room.width;
      this.form.length.value = room.length;
      this.form.window_count.value = room.window_count;
    }
    
    for(var uiinput in this.inputs)
      this.inputs[uiinput].auto();

    this.confirm = confirm.bind(this);
    this.cancel = cancel.bind(this);

    this.add_event_listeners();
  }

  hide() {
    this.elmt.classList.remove('modal--visible');
    this.form.reset();

    for(var uiinput in this.inputs)
      this.inputs[uiinput].reset();

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

    if(!this.checkValidity())
      return;

    const name = this.form.name.value;
    const width = this.form.width.value;
    const length = this.form.length.value;
    const window_count = this.form.window_count.value;


    this.confirm({name, width, length, window_count});
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

    this.show_room = this.show_room.bind(this);
    this.show = this.show.bind(this);
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