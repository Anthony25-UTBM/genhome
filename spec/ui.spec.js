describe('Room management', () => {
  const createRoom = function(name) {
    gen_home.toolbar.room_list.add_room(room.name);
  };

  beforeEach(() => {
    browser.url('http://localhost:3000');
  });


  it('can create a room', () => {
    browser.click('.js-room-list .toolbar__list-item:last-child');

    let modalContainerClasses = browser.getAttribute('.modal__container', 'class');
    expect(modalContainerClasses).toContain('modal__container--visible');

    let roomDialogClasses = browser.getAttribute('.modal.js-room-modal', 'class');
    expect(roomDialogClasses).toContain('modal--visible');

    // browser.waitUntil(() => {});

    // // Fill the form
    // browser.click('input#room-modal__name');
    // browser.keys('Chambre');
    // browser.click('input#room-modal__length');
    // browser.keys('5');
    // browser.click('input#room-modal__width');
    // browser.keys('4');

    // Submit the form through the keyboard
    browser.keys('\uE007');

    let roomListItems = browser.elementIdElements(browser.element('.js-room-list').value, '.toolbar__list-item');
    console.log(roomListItems);
  });
});