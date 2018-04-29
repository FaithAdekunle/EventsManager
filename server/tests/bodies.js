import testHelper from './testHelper';

module.exports = {
  userBodies: {
    NO_FULLNAME: {
      password: testHelper.userPassword,
      confirmPassword: testHelper.userPassword,
      email: testHelper.userEmail,
    },
    EMPTY_FULLNAME: {
      fullName: '    ',
      password: testHelper.userPassword,
      confirmPassword: testHelper.userPassword,
      email: testHelper.userEmail,
    },
    NO_PASSWORD: {
      fullName: 'Test Test',
      confirmPassword: testHelper.userPassword,
      email: testHelper.userEmail,
    },
    SHORT_PASSWORD: {
      password: 'pass',
      confirmPassword: 'pass',
      fullName: 'Test Test',
      email: testHelper.userEmail,
    },
    NO_CONFIRM_PASSWORD: {
      fullName: 'Test Test',
      password: testHelper.userPassword,
      email: testHelper.userEmail,
    },
    NO_EMAIL: {
      fullName: 'Test Test',
      password: testHelper.userPassword,
      confirmPassword: testHelper.userPassword,
    },
    INVALID_EMAIL: {
      fullName: 'Faith Adekunle',
      password: testHelper.userPassword,
      confirmPassword: testHelper.userPassword,
      email: 'adegold71gmail.com',
    },
    PASSWORD_MISMATCH: {
      fullName: 'Faith Adekunle',
      password: testHelper.userPassword,
      confirmPassword: 'password',
      email: testHelper.userEmail,
    },
    CREATE_USER: {
      fullName: 'asuahoidudfhla',
      password: testHelper.userPassword,
      confirmPassword: testHelper.userPassword,
      email: testHelper.userEmail,
    },
    CONFLICT_USER: {
      fullName: 'asuahoidudfhla',
      password: testHelper.userPassword,
      confirmPassword: testHelper.userPassword,
      email: testHelper.userEmail,
    },
    ADMIN_LOGIN: {
      password: testHelper.adminPassword,
      email: testHelper.adminEmail,
    },
    USER_LOGIN: {
      password: testHelper.userPassword,
      email: testHelper.userEmail,
    },
    WRONG_USER_PASSWORD: {
      password: 'wrong_password',
      email: testHelper.userEmail,
    },
    WRONG_USER_EMAIL: {
      password: 'wrong_password',
      email: testHelper.fakeEmail,
    },
  },
  centerBodies: {
    NO_NAME: {
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    EMPTY_NAME: {
      name: '   ',
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    NO_DESCRIPTION: {
      name: testHelper.centerName,
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    EMPTY_DESCRIPTION: {
      name: testHelper.centerName,
      description: '      ',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    NO_FACILITIES: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    EMPTY_FACILITIES: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      facilities: '       ',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    INVALID_COST: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 'cost',
    },
    INVALID_CAPACITY: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: -450,
      cost: 300000,
    },
    NO_ADDRESS: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    EMPTY_ADDRESS: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: '       ',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    NO_IMAGES: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      capacity: 450,
      cost: 300000,
    },
    EMPTY_IMAGES: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: '       ',
      capacity: 450,
      cost: 300000,
    },
    CREATE_CENTER: {
      name: testHelper.centerName,
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    CREATE_ANOTHER_CENTER: {
      name: testHelper.anotherCenterName,
      description: 'This is the description for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      address: 'This is the address for this center',
      images: 'image1###:###:###image2###:###:###image3###:###:###image4',
      capacity: 450,
      cost: 300000,
    },
    EDIT_CENTER: {
      name: testHelper.randomCenterName,
      description: 'This is the description for this center',
      address: 'This is another address for this center',
      facilities:
        'This###:###:###is###:###:###the###:###:###address' +
        '###:###:###for###:###:###this###:###:###center',
      images: 'image1, image2, image3, image4',
      capacity: 450,
      cost: 300000,
    },
  },
  eventBodies: {
    NO_NAME: {
      type: 'test type 123',
      start: '20/12/2019',
      guests: 20,
      end: '21/12/2019',
      centerId: 2147483647,
    },
    EMPTY_NAME: {
      name: '         ',
      type: 'test type 123',
      start: '20/12/2019',
      guests: 20,
      end: '21/12/2019',
      centerId: 2147483647,
    },
    NO_TYPE: {
      name: 'test event 123',
      start: '20/12/2018',
      guests: 20,
      end: '21/12/2019',
      centerId: 2147483647,
    },
    EMPTY_TYPE: {
      name: 'test event 123',
      type: '         ',
      start: '20/12/2018',
      guests: 20,
      end: '21/12/2019',
      centerId: 2147483647,
    },
    NO_CENTER_ID: {
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2018',
      guests: 20,
      end: '21/12/2019',
    },
    INVALID_CENTER_ID: {
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2018',
      guests: 20,
      end: '21/12/2019',
      centerId: -2,
    },
    NO_GUESTS: {
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2018',
      end: '21/12/2019',
      centerId: 2147483647,
    },
    INVALID_GUESTS: {
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2018',
      guests: 0,
      end: '21/12/2019',
      centerId: 2147483647,
    },
    NO_END_DATE: {
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2018',
      guests: 20,
      centerId: 2147483647,
    },
    PAST_END_DATE: {
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2018',
      guests: 20,
      end: '21/12/2017',
      centerId: 2147483647,
    },
    PAST_START_DATE: {
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2016',
      guests: 20,
      end: '21/12/2019',
      centerId: 2147483647,
    },
    INVALID_START_DATE: {
      name: 'test event 123',
      type: 'test type 123',
      start: '70/22/2018',
      guests: 20,
      end: '21/12/2019',
      centerId: 2147483647,
    },
    BAD_TIMING: {
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2018',
      guests: 20,
      end: '19/12/2018',
      centerId: 2147483647,
    },
    NO_EVENT: centerId => ({
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2020',
      guests: 20,
      end: '21/12/2020',
      centerId,
    }),
    CREATE_EVENT: centerId => ({
      name: 'test event 123',
      type: 'test type 123',
      start: '20/12/2019',
      guests: 20,
      end: '21/12/2019',
      centerId,
    }),
    CREATE_ANOTHER_EVENT: centerId => ({
      name: 'test event 456',
      type: 'test type 123',
      start: '30/12/2019',
      guests: 20,
      end: '31/12/2019',
      centerId,
    }),
    EDIT_EVENT: centerId => ({
      name: 'test event 123 changed',
      type: 'test type 123',
      start: '20/12/2019',
      guests: 20,
      end: '21/12/2019',
      centerId,
    }),
    BOOKED_DATES: centerId => ({
      name: 'test event 123',
      type: 'test type 123',
      start: '30/12/2019',
      guests: 20,
      end: '01/01/2020',
      centerId,
    }),
    TOO_MANY_GUESTS: centerId => ({
      name: 'test event 123',
      type: 'test type 123',
      start: '30/12/2019',
      guests: 600,
      end: '01/01/2020',
      centerId,
    }),
    NO_CENTER: {
      name: 'test event 123',
      type: 'test type 123',
      start: '19/12/2019',
      guests: 20,
      end: '21/12/2019',
      centerId: 0,
    },
  },
};
