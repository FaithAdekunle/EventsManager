/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  createAndEditEvent: (browser) => {
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
      .execute(() => {
        scrollTo(0, document.body.scrollHeight);
      })
      .pause(2000)
      .click('button.btn.btn-primary.btn-block')
      .pause(1000)

      // create event with past date
      .click('button[type=submit]')
      .setValue('#name', 'Annual Nazgul Debrief')
      .click('button[type=submit]')
      .setValue('#guests', 7)
      .click('button[type=submit]')
      .setValue('#end-date', '17/12/2016')
      .click('button[type=submit]')
      .setValue('#start-date', '12/12/2016')
      .click('button[type=submit]')
      .pause(2000)
      .assert
      .containsText(
        'div.form-error',
        'start date is past',
      )

      // create event with start date ahead of end date
      .clearValue('#start-date')
      .setValue('#start-date', '13/12/2020')
      .clearValue('#end-date')
      .setValue('#end-date', '11/12/2020')
      .click('button[type=submit]')
      .pause(2000)
      .assert
      .containsText(
        'div.form-error',
        'start date cannot be ahead of end date',
      )

      // sucessfully create event
      .clearValue('#end-date')
      .setValue('#end-date', '13/12/2020')
      .click('button[type=submit]')
      .pause(2000)

      // edit event with booked dates
      .click('.fa-pencil')
      .pause(1000)
      .clearValue('#name')
      .setValue('#name', 'Nazgul Anniversary')
      .clearValue('#start')
      .setValue('#start', '26/12/2020')
      .clearValue('#end')
      .setValue('#end', '26/12/2020')
      .click('button[type=submit]')
      .pause(3000)
      .assert
      .containsText(
        'div.form-error',
        'dates have been booked',
      )

      // sucessfully edit event
      .clearValue('#start')
      .setValue('#start', '13/12/2020')
      .clearValue('#end')
      .setValue('#end', '13/12/2020')
      .click('button[type=submit]')
      .pause(3000)
      .assert
      .containsText('.event-title>h6', 'Nazgul Anniversary')
      .pause(2000)
      .end();
  },
};
