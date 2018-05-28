/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  'Events Page': (browser) => {
    browser

      // sign in as user
      .url(`${APP_BASE_PATH}/signin`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/signin`)
      .setValue('input[type=email]', 'user@user.com')
      .setValue('input[type=password]', 'userpassword')
      .click('input[type=submit]')
      .pause(5000)

      // nav to center page
      .click('a.nav-link.centers-link')
      .pause(5000)
      .click('img.center-image')
      .pause(5000)
      .click('button.btn.btn-primary.btn-block')
      .pause(1000)

      // book center for event
      .setValue('#name', 'Annual Nazgul Debrief')
      .setValue('#guests', 7)
      .setValue('#end-date', '17/12/2020')
      .setValue('#start-date', '12/12/2020')
      .click('button[type=submit]')
      .pause(5000)

      // edit event
      .click('.fa-pencil')
      .pause(1000)
      .clearValue('#name')
      .pause(1000)
      .setValue('#name', 'Nazgul Anniversary')
      .click('button[type=submit]')
      .pause(5000)
      .assert
      .containsText('.event-title>h6', 'Nazgul Anniversary')

      // sign out
      .click('a.dropdown-toggle')
      .pause(1000)
      .click('a.dropdown-item.signout')
      .pause(5000)

      // sign in as admin
      .click('a.nav-link.signin')
      .pause(1000)
      .setValue('input[type=email]', 'admin@admin.com')
      .setValue('input[type=password]', 'adminpassword')
      .click('input[type=submit]')
      .pause(5000)
      .click('img.center-image')
      .pause(5000)

      // decline event
      .assert.elementNotPresent('declined')
      .click('i.fa-times.pull-right')
      .pause(15000)
      .assert.visible('.declined')
      .pause(1000)

      // sign out
      .click('a.nav-link.signout')
      .pause(5000)

      // sign in as user
      .click('a.nav-link.signin')
      .pause(1000)
      .setValue('input[type=email]', 'user@user.com')
      .setValue('input[type=password]', 'userpassword')
      .click('input[type=submit]')
      .pause(5000)

      // delete event
      .click('.fa-trash')
      .pause(1000)
      .click('.btn-danger')
      .pause(4000)
      .assert.elementNotPresent('.event.card')
      .pause(1000)
      .end();
  },
};
