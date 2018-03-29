/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';
import testHelper from './testHelper';
import host from '../index.js';

chai.use(chaiHttp);
chai.should();


describe('Tests for User API endpoint', () => {
  describe('Test for creating new user and/or admin', () => {
    it('shoud return a status 400 error response for a missing fullName field', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send({
          password: testHelper.userPassword,
          confirmPassword: testHelper.userPassword,
          email: testHelper.userEmail,
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
        .post('/api/v1/users')
        .send({
          fullName: '',
          password: testHelper.userPassword,
          confirmPassword: testHelper.userPassword,
          email: testHelper.userEmail,
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
        .post('/api/v1/users')
        .send({
          fullName: '      ',
          password: testHelper.userPassword,
          confirmPassword: testHelper.userPassword,
          email: testHelper.userEmail,
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
        .post('/api/v1/users')
        .send({
          fullName: 'Test Test',
          confirmPassword: testHelper.userPassword,
          email: testHelper.userEmail,
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
        .post('/api/v1/users')
        .send({
          password: 'pass',
          confirmPassword: 'pass',
          fullName: 'Test Test',
          email: testHelper.userEmail,
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
        .post('/api/v1/users')
        .send({
          fullName: 'Test Test',
          password: testHelper.userPassword,
          email: testHelper.userEmail,
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
        .post('/api/v1/users')
        .send({
          fullName: 'Test Test',
          password: testHelper.userPassword,
          confirmPassword: testHelper.userPassword,
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
        .post('/api/v1/users')
        .send({
          fullName: 'Faith Adekunle',
          password: testHelper.userPassword,
          confirmPassword: testHelper.userPassword,
          email: 'adegold71gmail.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('invalid email');
          done();
        });
    });

    it('shoud return a status 400 error response for password mismatch', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send({
          fullName: 'Faith Adekunle',
          password: testHelper.userPassword,
          confirmPassword: 'password',
          email: testHelper.userEmail,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('password and confirmPassword fields are not equal');
          done();
        });
    });

    it('shoud return a status 201 success response for creating a user', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send({
          fullName: 'asuahoidudfhla',
          password: testHelper.userPassword,
          confirmPassword: testHelper.userPassword,
          email: testHelper.userEmail,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('isAdmin').equal(false);
          testHelper.setUserToken(res.body.token);
          done();
        });
    });

    it('shoud return a status 201 success response for creating an admin', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send({
          fullName: 'dslbhabsdhsbkajd',
          password: testHelper.adminPassword,
          confirmPassword: testHelper.adminPassword,
          email: testHelper.adminEmail,
          isAdmin: true,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('isAdmin').equal(true);
          testHelper.setAdminToken(res.body.token);
          done();
        });
    });

    it('shoud return a status 400 error response for creating a user with an already existing email', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send({
          fullName: 'asuahoidudfhla',
          password: testHelper.userPassword,
          confirmPassword: testHelper.userPassword,
          email: testHelper.userEmail,
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
        .post('/api/v1/users/login')
        .send({
          password: testHelper.adminPassword,
          email: testHelper.adminEmail,
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
        .post('/api/v1/users/login')
        .send({
          password: testHelper.userPassword,
          email: testHelper.userEmail,
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
        .post('/api/v1/users/login')
        .send({
          password: 'wrong_password',
          email: testHelper.userEmail,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('email and password combination invalid');
          done();
        });
    });

    it('shoud return a status 400 error response for logging in a user with wrong email', (done) => {
      chai
        .request(host)
        .post('/api/v1/users/login')
        .send({
          password: 'wrong_password',
          email: testHelper.fakeEmail,
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
