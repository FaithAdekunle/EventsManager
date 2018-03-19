/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';
import uuidv4 from 'uuid/v4';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

chai.use(chaiHttp);
chai.should();
const host = process.env.LOCAL_HOST;
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
          confirmPassword: userPassword,
          email: userEmail,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('err').to.include('fullName field missing');
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
          confirmPassword: userPassword,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('err').to.include('fullName must be between 1 and 100 characters long');
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
          confirmPassword: userPassword,
          email: userEmail,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('fullName must be between 1 and 100 characters long');
          done();
        });
    });

    it('shoud return a status 400 error response for a missing password field', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'Faith Adekunle',
          confirmPassword: userPassword,
          email: userEmail,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('password field missing');
          done();
        });
    });

    it('shoud return a status 400 error response for a password field less than 8 characters password', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          password: 'pass',
          confirmPassword: 'pass',
          fullName: 'Faith Adekunle',
          email: `${uuidv4()}@gmail.com`,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('password must be between 8 and 100 characters long');
          done();
        });
    });

    it('shoud return a status 400 error response for a missing password confirm field', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'Faith Adekunle',
          email: userEmail,
          password: userPassword,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('confirmPassword field missing');
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
          confirmPassword: userPassword,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('email field missing');
          done();
        });
    });

    it('shoud return a status 400 error response for an invalid email value', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'Faith Adekunle',
          password: userPassword,
          confirmPassword: userPassword,
          email: 'adegold71gmail.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('invalid email');
          done();
        });
    });

    it('shoud return a status 400 error response for an invalid email value', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'Faith Adekunle',
          password: userPassword,
          confirmPassword: 'password',
          email: 'adegold71gmail.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('password and confirmPassowrd fields are not equal');
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
          confirmPassword: userPassword,
          email: userEmail,
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
          confirmPassword: adminPassword,
          email: adminEmail,
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
          confirmPassword: userPassword,
          email: userEmail,
          phoneNumber: '08101592531',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('a user already exits with this email');
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
          res.body.should.have.property('err').equal('email and password combination invalid');
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
        .send({
          description: 'This is the description for this center',
          facilities: 'This, is, the, address, for, this, center',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing center name field');
          done();
        });
    });

    it('should return a status 400 error response for empty name field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: '',
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('center name must be between 1 and 100 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing description field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing center description field');
          done();
        });
    });

    it('should return a status 400 error response for empty description field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          description: '',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('empty center description not allowed');
          done();
        });
    });

    it('should return a status 400 error response for missing facilities field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing center facilities field');
          done();
        });
    });

    it('should return a status 400 error response for empty facilities field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: '',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('center facilities must be between 1 and 300 characters long');
          done();
        });
    });

    it('should return a status 400 error response for invalid center cost', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 'cost',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('Invalid details. Only positive integers allowed for cost and capacity fields');
          done();
        });
    });

    it('should return a status 400 error response for invalid center capacity', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: -450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('Invalid details. Only positive integers allowed for cost and capacity fields');
          done();
        });
    });

    it('should return a status 400 error response for empty address string', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: '',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('center address must be between 1 and 100 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing address field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing center address field');
          done();
        });
    });

    it('should return a status 401 error response for valid post request without token', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
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
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('unauthorized token');
          done();
        });
    });

    it('should return a status 401 error response for valid post request with random token', (done) => {
      chai
        .request(host)
        .post('/centers?token=randomtoken')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('authentication failed');
          done();
        });
    });

    it('should return a status 400 error response for valid post request with random token', (done) => {
      chai
        .request(host)
        .post('/centers?token=randomtoken')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing images field');
          done();
        });
    });

    it('should return a status 400 error response for valid post request with random token', (done) => {
      chai
        .request(host)
        .post('/centers?token=randomtoken')
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('empty images field');
          done();
        });
    });

    it('should return a status 201 success response for valid post request with admin token', (done) => {
      chai
        .request(host)
        .post(`/centers?token=${adminToken}`)
        .send({
          name: centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
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
        .send({
          name: anotherCenterName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
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
        .send({
          name: anotherCenterName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
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
        .send({
          name: uuidv4(),
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
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
        .send({
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing event name field');
          done();
        });
    });

    it('should return a status 400 error response for empty name field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .send({
          name: '',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('event name must be between 1 and 100 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing type field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .send({
          name: 'test event 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing event type field');
          done();
        });
    });

    it('should return a status 400 error response for empty type field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .send({
          name: 'test event 123',
          type: '',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('event type must be between 1 and 20 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing center id field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing center id field');
          done();
        });
    });

    it('should return a status 400 error response for invalid center id value', (done) => {
      chai
        .request(host)
        .post('/events/')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: -2,
        })
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
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          days: 2,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing guests field');
          done();
        });
    });

    it('should return a status 400 error response for invalid guests value', (done) => {
      chai
        .request(host)
        .post('/events/')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 'invalid',
          days: 2,
          centerId,
        })
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
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing days field');
          done();
        });
    });

    it('should return a status 400 error response for invalid days value', (done) => {
      chai
        .request(host)
        .post('/events/')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 0,
          centerId,
        })
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
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('end').equal('21/12/2018');
          eventId = res.body.id;
          done();
        });
    });
  });

  describe('Test for editing event', () => {
    it('should return a status 200 success response for valid put request', (done) => {
      chai
        .request(host)
        .put(`/events/${eventId}?token=${userToken}`)
        .send({
          name: 'test event 123 changed',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('name').equal('test event 123 changed');
          done();
        });
    });

    it('should return a status 409 error response for booked dates', (done) => {
      chai
        .request(host)
        .post(`/events?token=${userToken}`)
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '19/12/2018',
          guests: 20,
          days: 8,
          centerId,
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('dates have been booked');
          done();
        });
    });
  });

  describe('Test for declining event', () => {
    it('should return a status 200 success response for declining user event', (done) => {
      chai
        .request(host)
        .put(`/events/${eventId}/decline?token=${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('status').equal('success');
          done();
        });
    });
  });
});
