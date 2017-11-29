/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';
import uuidv4 from 'uuid/v4';

chai.use(chaiHttp);
chai.should();
const host = 'localhost:7777';

describe('Tests for User API endpoint', () => {
  const userEmail = `${uuidv4()}@gmail.com`;
  const adminEmail = `${uuidv4()}@gmail.com`;
  const userPassword = uuidv4();
  const adminPassword = uuidv4();
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

    it('shoud return a status 400 error response for a missing phone number field', (done) => {
      chai
        .request(host)
        .post('/users')
        .send({
          fullName: 'Faith Adekunle',
          password: 'password',
          email: 'adegold71@gmail.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('phoneNumber field missing');
          done();
        });
    });

    it('shoud return a status 200 success response for creating a user', (done) => {
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
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('isAdmin').equal(false);
          done();
        });
    });

    it('shoud return a status 200 success response for creating an admin', (done) => {
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
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('isAdmin').equal(true);
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

