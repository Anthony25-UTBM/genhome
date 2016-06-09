'use strict';

class UIToolbar {
  constructor() {
    this.elmt = document.querySelector('.js-toolbar');
    this.room_list = new UIRoomList();
    this.constraint_list = new UIConstraintList();
  }

  add_event_listeners() {

  }
}

class UIList {
  constructor(element_selector) {
    if (new.target === UIList)
      throw new TypeError('Cannot construct UIList instances directly');

    this.elmt = document.querySelector(element_selector);
    this.add_button = this.elmt.lastElementChild;

    this.on_add = this.on_add.bind(this);

    this.add_event_listeners();
  }

  add_event_listeners() {
    this.add_button.addEventListener('click', this.on_add);
    this.add_button.addEventListener('keydown', this.on_keydown);
  }
}

class UIRoomList extends UIList {
  constructor() {
    super('.js-room-list');

    this.roomElmts = {};
  }

  add_room(name) {
    const room = UIElements.create_room_list_item(name, gen_home.edit_room.bind(gen_home, name), gen_home.remove_room.bind(gen_home, name));
    this.roomElmts[name] = room;
    this.elmt.insertBefore(room, this.add_button);
  }

  remove_room(name) {
    this.elmt.removeChild(this.roomElmts[name]);
    delete this.roomElmts[name];
  }

  on_add() {
    gen_home.add_room();
  }
}

class UIConstraintList extends UIList {
  constructor() {
    super('.js-constraint-list');

    this.constraintElmts = {};
  }

  add_constraint(type, room1, room2) {
    //TODO
    this.roomElmts[id] = constraint;
  }

  remove_constraint(id) {
    this.elmt.removeChild(this.constraintElmts[id]);
    delete this.constraintElmts[id];
  }

  on_add() {
    gen_home.add_constraint();
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
    if(this.input.value !== '')
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

      this.container.classList.toggle('input__container--error', this.errors.some((error) => error.active));
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
    if(this.input.value !== '')
      this.hide();
    else
      this.deactivate();
  }
}

class UISelect {
  constructor(element_selector) {
    this.input = document.querySelector(element_selector);
    this.container = this.input.parentElement;
    this.errors = [];

    this.select_list = new UISelectList(this);

    this.on_open = this.on_open.bind(this);

    this.add_event_listeners();
  }

  auto() {

  }

  sync() {

  }

  open() {
    this.select_list.show();
  }

  add_event_listeners() {
    this.input.addEventListener('keypress', this.on_open);
    this.input.addEventListener('mousedown', this.on_open);
  }

  on_open(evt) {
    evt.preventDefault();

    this.open();
  }
}

class UISelectList {
  constructor(ui_select) {
    this.ui_select = ui_select;
    this.list = UIElements.create_ui_select_list();
    this.container = UIElements.create_ui_select_list_container(this.list);
    this.observer = new MutationObserver(this.on_observe.bind(this));
    this.items = [];

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.on_cancel = this.on_cancel.bind(this);
    this.on_transition_end = this.on_transition_end.bind(this);
    this.on_observe = this.on_observe.bind(this);

    const clientRect = this.ui_select.input.getBoundingClientRect();
    this.list.style.width = `${clientRect.width}px`;

    this.add_event_listeners();

    this.sync();
  }

  sync() {
    const options = this.ui_select.input.querySelectorAll('option:not([disabled])');

    for(let item of options) {
      console.log(item);

      let li = UIElements.create_ui_select_list_item(item.textContent);

      this.list.appendChild(li);
    }
  }

  show() {
    this.observer.observe(document.body, {childList: true});
    document.body.appendChild(this.container);

    const clientRect = this.ui_select.input.getBoundingClientRect();

    this.list.style.transform = `translate(${clientRect.left}px, ${clientRect.top - 8}px)`;
  }

  hide() {
    this.list.classList.remove('form-select__list--visible');
    this.list.addEventListener('transitionend', this.on_transition_end);
    document.body.removeChild(this.container);
  }

  add_event_listeners() {
    this.container.addEventListener('click', this.on_cancel);
  }

  on_cancel() {
    // this.ui_select.select(undefined);

    this.hide();
  }

  on_select(evt) {

  }

  on_transition_end() {
    document.body.removeChild(this.list);
    this.list.removeEventListener('transitionend', this.on_transition_end);
  }

  on_observe(mutations) {
    if(mutations.some((mutation) => mutation.addedNodes[0] == this.container))
      this.list.classList.add('form-select__list--visible');
  }
}

class UIElements {
  constructor() {
    // code
  }

  static create_room_list_item(name, on_edit, on_remove) {

    const li = document.createElement('li');
    li.classList.add('toolbar__list-item');
    li.setAttribute('tabindex', 0);
    li.innerHTML = `<label class="list-item__label">${name}</label><button class="list-item__button" type="button" tabindex="0"><span class="material-icons">close</span></button>`;

    li.addEventListener('click', () => on_edit());

    const button = li.querySelector('button');

    button.addEventListener('click', (evt) => {
      evt.stopPropagation();
      on_remove();
    });

    return li;
  }

  static create_form_error_message(message) {
    const span = document.createElement('span');
    span.className = 'form__error';
    span.innerText = message;

    return span;
  }

  static create_ui_select_list(ui_select) {
    const ul = document.createElement('ul');
    ul.className = 'form-select__list';

    return ul;
  }

  static create_ui_select_list_container(list) {
    const container = document.createElement('div');
    container.className = 'form-select__list-container';
    container.appendChild(list);

    return container;
  }

  static create_ui_select_list_item(name) {
    const item = document.createElement('li');
    item.className = 'form-select__list-item';
    item.textContent = name;

    return item;
  }
}

class UIDialog {
  constructor(element_selector, form_name) {
    this.elmt = document.querySelector(element_selector);
    this.confirm_button = this.elmt.querySelector('.form__action--primary');
    this.cancel_button = this.elmt.querySelector('.form__action--secondary');
    this.form = document.forms.item(form_name);

    this.inputs = {};

    this.confirm = () => {};
    this.cancel = () => {};

    this.checkValidity = this.checkValidity.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.on_confirm = this.on_confirm.bind(this);
    this.on_cancel = this.on_cancel.bind(this);
    this.block_clicks = this.block_clicks.bind(this);
  }

  checkValidity() {
    let validity = true;
    for(let input_name in this.inputs)
      validity = validity && this.inputs[input_name].checkValidity();
    return validity;
  }

  show(confirm, cancel) {
    for(var uiinput in this.inputs)
      this.inputs[uiinput].auto();

    this.confirm = confirm.bind(this);
    this.cancel = cancel.bind(this);

    this.add_event_listeners();

    this.elmt.classList.add('modal--visible');
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

    return this.checkValidity();
  }

  on_cancel() {
    this.cancel();
  }

  block_clicks (evt) {
    evt.stopPropagation();
  }
}

class UIRoomDialog extends UIDialog {
  constructor() {
    super('.js-room-modal', 'room-dialog');

    this.inputs = {
      name: new UIInput('#room-modal__name'),
      length: new UIInput('#room-modal__length'),
      width: new UIInput('#room-modal__width'),
      window_count: new UIInput('#room-modal__window-count')
    };

    this.inputs.name.add_error('Ce nom n\'est pas disponible', 'input', (name) => {
      let test = false;
      if(name == gen_home.currentRoom)
        return test;
      // Get room name
      for(let room in gen_home.rooms)
        test = test || room == name;
      return test;
    });
  }

  show(confirm, cancel, room) {

    if(room) {
      console.log('Room:', room);

      for(var prop in room) {
        if(this.form[prop])
          this.form[prop].value = room[prop];
      }

      this.form.name.value =   room.name;
      this.form.width.value = room.width;
      this.form.length.value = room.length;
      this.form.window_count.value = room.window_count;
    }

    super.show(confirm, cancel);
  }

  on_confirm(evt) {
    if(!super.on_confirm(evt)) return false;

    const name = this.form.name.value;
    const width = this.form.width.value;
    const length = this.form.length.value;
    const window_count = this.form.window_count.value;


    this.confirm({name, width, length, window_count});
  }
}

class UIConstraintDialog extends UIDialog {
  constructor() {
    super('.js-constraint-modal', 'constraint-dialog');

    this.inputs = {
      first_room: new UISelect('#constraint-modal__first-room')
    }
  }
}

class UIDialogs {
  constructor() {
    this.elmt = document.querySelector('.js-modal-container');

    this.show_room = this.show_room.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this.dialogs = {
      room: new UIRoomDialog(),
      constraint: new UIConstraintDialog()
    };

    this.add_event_listeners();
  }

  show_room(confirm, cancel, room) {
    this.show(this.dialogs.room, confirm, cancel, room);
  }

  show_constraint(confirm, cancel, constraint) {
    this.show(this.dialogs.constraint, confirm, cancel, constraint);
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

// vim: set ts=2 sw=2:
