/* global module */
import uuidv4 from 'uuid/v4';

const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  Signup: (browser) => {
    browser
      .url(`${APP_BASE_PATH}/signup`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/signup`)

      // input existing email
      .setValue('input[id=fullname]', 'Faith Adekunle')
      .click('input[type=submit')
      .pause(1000)
      .setValue('input[id=email]', 'user@user.com')
      .click('input[type=submit')
      .pause(1000)

      .setValue('input[id=password]', 'userpassword')
      .click('input[type=submit')
      .pause(1000)

      // password and confirm password mismatchmatch
      .setValue('input[id=passwordconfirm]', 'userconfirmpassword')
      .click('input[type=submit')
      .pause(1000)
      .assert
      .containsText(
        'div.form-error',
        'Password and Confirm password must match',
      )
      .pause(2000)

      // submit existing email
      .clearValue('input[id=passwordconfirm]')
      .setValue('input[id=passwordconfirm]', 'userpassword')
      .click('input[type=submit')
      .pause(1000)
      .assert
      .containsText(
        'div.form-error',
        'a user already exits with this email',
      )
      .pause(2000)

      // input new email
      .clearValue('input[id=email]')
      .setValue('input[id=email]', `${uuidv4()}@gmail.com`)
      .pause(1000)
      .click('input[type=submit')
      .pause(2000)
      .assert.urlEquals(`${APP_BASE_PATH}/events`)
      .pause(1000)
      .end();
  },
};
