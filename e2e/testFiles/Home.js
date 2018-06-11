/* global module */
import uuidv4 from 'uuid/v4';

const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  HomePageSearchForCenters: (browser) => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.elementNotPresent('li.list-group-item.window-exclude')

      // search for non existing center name or location
      .setValue('input.form-control.window-exclude.search-centers', 'ab12cd34e')
      .pause(5000)
      .assert.containsText(
        'li.list-group-item.window-exclude',
        'Sorry! We could not find a match.',
      )

      // search for center name or location 'Cloud 9ne'
      .clearValue('input.form-control.window-exclude.search-centers')
      .setValue('input.form-control.window-exclude.search-centers', 'cloud 9ne')
      .pause(5000)
      .assert.containsText(
        'li.list-group-item.window-exclude',
        'Party Hive - Cloud 9ne',
      )

      // navigate to searched center
      .click('li.list-group-item.window-exclude')
      .pause(3000)
      .assert.urlEquals(`${APP_BASE_PATH}/centers/1`)
      .pause(1000)
      .end();
  },

  HomePageSignup: (browser) => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .click('input[type=submit')
      .pause(1000)

      // input existing email
      .setValue('input[name=fullname]', 'Faith Adekunle')
      .click('input[type=submit')
      .pause(1000)
      .setValue('input[name=email]', 'user@user.com')
      .click('input[type=submit')
      .pause(1000)

      .setValue('input[name=password]', 'userpassword')
      .click('input[type=submit')
      .pause(1000)

      // password and confirm password mismatchmatch
      .setValue('input[name=confirmPassword]', 'userconfirmpassword')
      .click('input[type=submit')
      .pause(1000)
      .assert
      .containsText(
        'div.form-error',
        'Password and Confirm password must match',
      )
      .pause(2000)

      // submit existing email
      .clearValue('input[name=confirmPassword]')
      .setValue('input[name=confirmPassword]', 'userpassword')
      .click('input[type=submit')
      .pause(1000)
      .assert
      .containsText(
        'div.form-error',
        'a user already exits with this email',
      )
      .pause(2000)

      // input new email
      .clearValue('input[name=email]')
      .setValue('input[name=email]', `${uuidv4()}@gmail.com`)
      .pause(1000)
      .click('input[type=submit')
      .pause(2000)
      .assert.urlEquals(`${APP_BASE_PATH}/events`)
      .pause(1000)
      .end();
  },
};
