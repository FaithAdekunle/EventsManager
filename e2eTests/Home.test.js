/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  'Home Page': (browser) => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/home`)
      .pause(2000)
      .assert.elementNotPresent('li.list-group-item.window-exclude')

      // search for center name or location 'Cloud 9ne'
      .setValue('input.form-control.window-exclude.search-centers', 'cloud 9ne')
      .pause(5000)
      .assert.visible('li.list-group-item.window-exclude')

      // home page sign up with existing account
      .setValue('input[name=fullname]', 'Faith Adekunle')
      .setValue('input[name=email]', 'user@user.com')
      .setValue('input[name=password]', 'userpassword')
      .setValue('input[name=confirmPassword]', 'userpassword')
      .click('input[type=submit')
      .pause(5000)
      .assert
      .containsText('div.form-error', 'a user already exits with this email')
      .pause(2000)
      .end();
  },
};
