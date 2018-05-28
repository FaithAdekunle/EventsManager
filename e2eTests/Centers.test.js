/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  'Centers Page': (browser) => {
    browser
      .url(`${APP_BASE_PATH}/centers`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/centers`)

      // search for centers
      .click('input[type=submit]')
      .pause(5000)
      .assert.visible('div.single-center>span>strong')

      // sign in as admin
      .click('a.nav-link.signin')
      .pause(1000)
      .assert.urlEquals(`${APP_BASE_PATH}/signin`)
      .setValue('input[type=email]', 'admin@admin.com')
      .setValue('input[type=password]', 'adminpassword')
      .click('input[type=submit]')
      .pause(5000)

      // can add center
      .assert.containsText('button.btn.btn-primary.btn-block', 'Add Center')
      .assert.hidden('.modal-content')
      .click('button.btn.btn-primary.btn-block')
      .pause(1000)
      .assert.visible('.modal-content')
      .pause(2000)
      .click('span[aria-hidden=true]')
      .pause(1000)
      .end();
  },
};
