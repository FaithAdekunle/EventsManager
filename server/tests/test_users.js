/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';
import uuidv4 from 'uuid/v4';
import { readFileSync } from 'fs';

chai.use(chaiHttp);
chai.should();
const host = 'localhost:7777';

const userEmail = `${uuidv4()}@gmail.com`;
const adminEmail = `${uuidv4()}@gmail.com`;
const userPassword = uuidv4();
const adminPassword = uuidv4();
const centerName = uuidv4();
const anotherCenterName = uuidv4();
let userToken;
let adminToken;
let centerId;
let eventId;

describe('Tests for User API endpoint', () => {
  describe('Test for creating new user and/or admin', () => {
    it('shoud return a status 400 error response for a missing fullName field', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          password: 'password',
          email: userEmail,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('err').equal('fullName field missing');
          done();
        });
    });

    it('shoud return a status 400 error response for a empty fullName field', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: '',
          password: userPassword,
          email: userEmail,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('err').equal('fullName must be between 1 and 100 characters long');
          done();
        });
    });

    it('shoud return a status 400 error response for a fullName field of only spaces', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: '      ',
          password: userPassword,
          email: userEmail,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('fullName must be between 1 and 100 characters long');
          done();
        });
    });

    it('shoud return a status 400 error response for a missing password field', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'Faith Adekunle',
          email: userEmail,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('password field missing');
          done();
        });
    });

    it('shoud return a status 400 error response for a password field less than 8 characters password', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          password: 'pass',
          fullName: 'Faith Adekunle',
          email: `${uuidv4()}@gmail.com`,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('password must be between 8 and 100 characters long');
          done();
        });
    });

    it('shoud return a status 400 error response for a missing email field', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'Faith Adekunle',
          password: userPassword,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('email field missing');
          done();
        });
    });

    it('shoud return a status 400 error response for an invalid email value', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'Faith Adekunle',
          password: 'password',
          email: 'adegold71gmail.com',
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('invalid email');
          done();
        });
    });

    it('shoud return a status 201 success response for creating a user', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'asuahoidudfhla',
          password: userPassword,
          email: userEmail,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('isAdmin').equal(false);
          userToken = res.body.token;
          done();
        });
    });

    it('shoud return a status 201 success response for creating an admin', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'dslbhabsdhsbkajd',
          password: adminPassword,
          email: adminEmail,
          phoneNumber: '08101592531',
          isAdmin: true,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('isAdmin').equal(true);
          adminToken = res.body.token;
          done();
        });
    });

    it('shoud return a status 400 error response for creating a user with an already existing email', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'asuahoidudfhla',
          password: userPassword,
          email: userEmail,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('email must be unique');
          done();
        });
    });
  });

  describe('Test for loggin a user and/or admin', () => {
    it('shoud return a status 200 success response for logging in an admin', (done) => {
      chai
        .request(host)
        .post('/users/login')
        .send({
          password: adminPassword,
          email: adminEmail,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('isAdmin').equal(true);
          done();
        });
    });

    it('shoud return a status 200 success response for logging in a user', (done) => {
      chai
        .request(host)
        .post('/users/login')
        .send({
          password: userPassword,
          email: userEmail,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('isAdmin').equal(false);
          done();
        });
    });

    it('shoud return a status 400 error response for logging in a user with wrong password', (done) => {
      chai
        .request(host)
        .post('/users/login')
        .send({
          password: 'wrong_password',
          email: userEmail,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('password is incorrect');
          done();
        });
    });
  });
});

describe('Tests for Centers API', () => {
  describe('Add new center', () => {
    it('should return a status 400 error response missing name field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing center name field');
          done();
        });
    });

    it('should return a status 400 error response for empty name field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', '')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center name must be between 1 and 100 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing description field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing center description field');
          done();
        });
    });

    it('should return a status 400 error response for empty description field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', '')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('empty center description not allowed');
          done();
        });
    });

    it('should return a status 400 error response for missing facilities field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('address', 'This is the address for this center')
        .field('description', 'The description')
        .field('capacity', 450)
        .field('cost', 300000)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing center facilities field');
          done();
        });
    });

    it('should return a status 400 error response for empty facilities field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('address', 'This is the address for this center')
        .field('description', 'The description')
        .field('facilities', '')
        .field('capacity', 450)
        .field('cost', 300000)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center facilities must be between 1 and 100 characters long');
          done();
        });
    });

    it('should return a status 400 error response for no images', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('no center image found');
          done();
        });
    });

    it('should return a status 400 error response for invalid center cost', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 'cost')
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed for cost and capacity fields');
          done();
        });
    });

    it('should return a status 400 error response for invalid center capacity', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', -450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed for cost and capacity fields');
          done();
        });
    });

    it('should return a status 400 error response for empty address string', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', '')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center address must be between 1 and 100 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing address field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing center address field');
          done();
        });
    });

    it('should return a status 401 error response for valid post request without token', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('no token found');
          done();
        });
    });

    it('should return a status 401 error response for valid post request with user token', (done) => {
      chai
        .request(host)
        .post(`/centers?token=${userToken}`)
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('unauthorized operation');
          done();
        });
    });

    it('should return a status 401 error response for valid post request with random token', (done) => {
      chai
        .request(host)
        .post('/centers?token=bbkvjhgvjhgv')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('authentication failed');
          done();
        });
    });

    it('should return a status 201 success response for valid post request with admin token', (done) => {
      chai
        .request(host)
        .post(`/centers?token=${adminToken}`)
        .field('name', centerName)
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.any.keys(['createdBy', 'updatedBy']);
          centerId = res.body.id;
          done();
        });
    });

    it('should return a status 201 success response for valid post request with admin token', (done) => {
      chai
        .request(host)
        .post(`/centers?token=${adminToken}`)
        .field('name', anotherCenterName)
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.any.keys(['createdBy', 'updatedBy']);
          done();
        });
    });
  });

  describe('Test for fetching centers', () => {
    it('should return a status 200 success response for a get centers request', (done) => {
      chai
        .request(host)
        .get('/centers')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body[0].should.have.any.keys(['events']);
          done();
        });
    });

    it('should return a status 200 success response for a get center request', (done) => {
      chai
        .request(host)
        .get(`/centers/${centerId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.any.keys(['events']);
          done();
        });
    });

    it('should return a status 404 error response for a get center request that does not exist', (done) => {
      chai
        .request(host)
        .get('/centers/0')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center not found');
          done();
        });
    });
  });

  describe('Test for editing centers', () => {
    it('should return a status 409 error response for valid put request with admin token but already existing name', (done) => {
      chai
        .request(host)
        .put(`/centers/${centerId}?token=${adminToken}`)
        .field('name', anotherCenterName)
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center name already exists');
          done();
        });
    });

    it('should return a status 200 success response for valid put request with admin token', (done) => {
      chai
        .request(host)
        .put(`/centers/${centerId}?token=${adminToken}`)
        .field('name', uuidv4())
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.any.keys(['createdBy', 'updatedBy']);
          done();
        });
    });
  });
});

describe('Tests for events api', () => {
  describe('Tests for creating event', () => {
    it('should return a status 400 error response for missing name field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('type', 'conference')
        .field('centerId', centerId)
        .field('guests', 200)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing event name field');
          done();
        });
    });

    it('should return a status 400 error response for empty name field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', '')
        .field('type', 'conference')
        .field('centerId', centerId)
        .field('guests', 200)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('event name must be between 1 and 100 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing type field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', 'Annual conference')
        .field('centerId', centerId)
        .field('guests', 200)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing event type field');
          done();
        });
    });

    it('should return a status 400 error response for empty type field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', 'Annual conference')
        .field('type', '')
        .field('centerId', centerId)
        .field('guests', 200)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('event type must be between 1 and 20 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing center id field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', 'Annual conference')
        .field('type', 'conference')
        .field('guests', 200)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing center id field');
          done();
        });
    });

    it('should return a status 400 error response for invalid center id value', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', 'Annual conference')
        .field('centerId', -2)
        .field('type', 'conference')
        .field('guests', 200)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed for centerId, guests and days fields');
          done();
        });
    });

    it('should return a status 400 error response for missing guests field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', 'Annual conference')
        .field('type', 'conference')
        .field('centerId', centerId)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing guests field');
          done();
        });
    });

    it('should return a status 400 error response for invalid guests value', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', 'Annual conference')
        .field('centerId', -2)
        .field('type', 'conference')
        .field('guests', 'hfkhhl')
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed for centerId, guests and days fields');
          done();
        });
    });

    it('should return a status 400 error response for missing days field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', 'Annual conference')
        .field('type', 'conference')
        .field('centerId', centerId)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing guests field');
          done();
        });
    });

    it('should return a status 400 error response for invalid days value', (done) => {
      chai
        .request(host)
        .post('/events/')
        .field('name', 'Annual conference')
        .field('centerId', -2)
        .field('type', 'conference')
        .field('guests', 'hfkhhl')
        .field('days', 0)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed for centerId, guests and days fields');
          done();
        });
    });

    it('should return a status 200 success response for valid post request', (done) => {
      chai
        .request(host)
        .post(`/events?token=${userToken}`)
        .field('name', 'Annual conference')
        .field('centerId', 1)
        .field('type', 'conference')
        .field('guests', 20)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('end').equal('21/12/2017');
          eventId = res.body.id;
          done();
        });
    });

    it('should return a status 200 success response for valid put request', (done) => {
      chai
        .request(host)
        .put(`/events/${eventId}?token=${userToken}`)
        .field('name', 'Annual')
        .field('centerId', 1)
        .field('type', 'conference')
        .field('guests', 20)
        .field('days', 2)
        .field('start', '20/12/2017')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('name').equal('Annual');
          done();
        });
    });
  });
});

