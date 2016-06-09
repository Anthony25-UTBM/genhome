describe('Room management', () => {

  it('can create a room', () => {

    // Open browser in local fileserver
    browser.url('http://localhost:3000');

    // Click on the 'Nouvelle pièce' button
    browser.click('label=Nouvelle pièce ...');

    // Assert UI room list length to be 1 (the 'Nouvelle pièce' button)
    let roomListItems = browser.elements('.js-room-list .toolbar__list-item');
    expect(roomListItems.value.length).toBe(1);

    // Assert modal container visible
    let modalContainerClasses = browser.getAttribute('.modal__container', 'class');
    expect(modalContainerClasses).toContain('modal__container--visible');

    // Assert modal visible
    let roomDialogClasses = browser.getAttribute('.modal.js-room-modal', 'class');
    expect(roomDialogClasses).toContain('modal--visible');

    // Fill the form
    browser.click('input#room-modal__name');
    browser.keys('Chambre');
    browser.keys('\uE004'); // Press TAB key
    browser.keys('5');
    browser.keys('\uE004'); // Press TAB key
    browser.keys('4');

    // Click 'Create' button
    browser.click('.js-room-modal .form__action--primary');

    // Assert modal container not visible
    modalContainerClasses = browser.getAttribute('.modal__container', 'class');
    expect(modalContainerClasses).not.toContain('modal__container--visible');

    // Assert modal not visible
    roomDialogClasses = browser.getAttribute('.modal.js-room-modal', 'class');
    expect(roomDialogClasses).not.toContain('modal--visible');

    // Assert UI room list length to be 2 (the room and the 'Nouvelle pièce' button)
    roomListItems = browser.elements('.js-room-list .toolbar__list-item');
    expect(roomListItems.value.length).toBe(2);
  });
});