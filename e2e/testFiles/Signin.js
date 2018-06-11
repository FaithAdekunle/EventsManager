/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  Signin: (browser) => {
    browser
      .url(`${APP_BASE_PATH}/signin`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/signin`)

      // bad signin
      .click('input[type=submit]')
      .setValue('input[type=email]', 'user@user.com')
      .click('input[type=submit]')
      .setValue('input[type=password]', 'userpasswords')
      .click('input[type=submit]')
      .pause(3000)
      .assert
      .containsText(
        'div.form-error',
        'email and password combination invalid',
      )
      .pause(2000)

      // signin as user
      .clearValue('input[type=password]')
      .setValue('input[type=password]', 'userpassword')
      .click('input[type=submit]')
      .pause(5000)
      .assert.urlEquals(`${APP_BASE_PATH}/events`)
      .pause(2000)

      // signout
      .click('a.dropdown-toggle')
      .click('a.dropdown-item.signout')
      .pause(5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)

      // signin as admin
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
