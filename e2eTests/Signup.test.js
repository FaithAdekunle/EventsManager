/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  'Signup Page': (browser) => {
    browser
      .url(`${APP_BASE_PATH}/signup`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/signup`)

      // sign up with existing account
      .setValue('input[id=fullname]', 'Faith Adekunle')
      .setValue('input[id=email]', 'user@user.com')
      .setValue('input[id=password]', 'userpassword')
      .setValue('input[id=passwordconfirm]', 'userpassword')
      .click('input[type=submit')
      .pause(5000)
      .assert
      .containsText('div.form-error', 'a user already exits with this email')
      .pause(2000)
      .end();
  },
};
