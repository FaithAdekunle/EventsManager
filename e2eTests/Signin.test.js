/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  'Signin Page': (browser) => {
    browser
      .url(`${APP_BASE_PATH}/signin`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/signin`)

      // sign in as user
      .setValue('input[type=email]', 'user@user.com')
      .setValue('input[type=password]', 'userpassword')
      .click('input[type=submit]')
      .pause(5000)
      .assert.urlEquals(`${APP_BASE_PATH}/events`)
      .pause(2000)

      // sign in as admin
      .click('a.dropdown-toggle')
      .click('a.dropdown-item.signout')
      .pause(5000)
      .assert.urlEquals(`${APP_BASE_PATH}/home`)
      .click('a.nav-link.signin')
      .pause(1000)
      .assert.urlEquals(`${APP_BASE_PATH}/signin`)
      .setValue('input[type=email]', 'admin@admin.com')
      .setValue('input[type=password]', 'adminpassword')
      .click('input[type=submit]')
      .pause(5000)
      .assert.urlEquals(`${APP_BASE_PATH}/centers`)
      .pause(2000)
      .end();
  },
};
