/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';
import bodies from './bodies';
import testHelper from './testHelper';
import host from '../index';

chai.use(chaiHttp);
chai.should();

module.exports = describe('Tests for User endpoints', () => {
  describe('POST api/v1/users', () => {
    it('shoud return error for missing fullname field', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.NO_FULLNAME)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .equal('fullName must be 1 - 30 characters');
          done();
        });
    });

    it('shoud return error for empty fullname field', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.EMPTY_FULLNAME)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .to.equal('fullName must be 1 - 30 characters');
          done();
        });
    });

    it('shoud return error for missing password field', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.NO_PASSWORD)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have
            .property('error')
            .to.equal('password must be 8 - 100 characters');
          done();
        });
    });

    it('shoud return error for short length password', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.SHORT_PASSWORD)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have
            .property('error')
            .to.equal('password must be 8 - 100 characters');
          done();
        });
    });

    it('shoud return error for missing password confirm field', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.NO_CONFIRM_PASSWORD)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have
            .property('error')
            .to.equal('missing password confirm');
          done();
        });
    });

    it('shoud return error for missing email field', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.NO_EMAIL)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('invalid email');
          done();
        });
    });

    it('shoud return error for invalid email value', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.INVALID_EMAIL)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('invalid email');
          done();
        });
    });

    it('shoud return error for password mismatch', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.PASSWORD_MISMATCH)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have
            .property('error')
            .to.equal('password and confirmPassword fields are not equal');
          done();
        });
    });

    it('shoud sucessfully create a user', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.CREATE_USER)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });

    it('shoud return error for creating existing user', (done) => {
      chai
        .request(host)
        .post('/api/v1/users')
        .send(bodies.userBodies.CONFLICT_USER)
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have
            .property('error')
            .equal('a user already exits with this email');
          done();
        });
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('shoud log admin in', (done) => {
      chai
        .request(host)
        .post('/api/v1/users/login')
        .send(bodies.userBodies.ADMIN_LOGIN)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('token');
          testHelper.setAdminToken(res.body.token);
          done();
        });
    });

    it('shoud log user in', (done) => {
      chai
        .request(host)
        .post('/api/v1/users/login')
        .send(bodies.userBodies.USER_LOGIN)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('token');
          testHelper.setUserToken(res.body.token);
          done();
        });
    });

    it('shoud return error logging in a user with wrong password', (done) => {
      chai
        .request(host)
        .post('/api/v1/users/login')
        .send(bodies.userBodies.WRONG_USER_PASSWORD)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have
            .property('error')
            .equal('email and password combination invalid');
          done();
        });
    });

    it('shoud return error for logging in a user with wrong email', (done) => {
      chai
        .request(host)
        .post('/api/v1/users/login')
        .send(bodies.userBodies.WRONG_USER_EMAIL)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have
            .property('error')
            .equal('email and password combination invalid');
          done();
        });
    });
  });
});
