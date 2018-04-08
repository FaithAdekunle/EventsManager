/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import uuidv4 from 'uuid/v4';
import testHelper from './testHelper';
import host from '../index.js';

chai.use(chaiHttp);
chai.should();

describe('Tests for Centers API', () => {
  describe('Add new center', () => {
    it('should return a status 400 error response missing name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
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
        .post('/api/v1/centers')
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
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
        .post(`/api/v1/centers?token=${testHelper.userToken}`)
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers?token=randomtoken')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers?token=randomtoken')
        .send({
          name: testHelper.centerName,
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
        .post('/api/v1/centers?token=randomtoken')
        .send({
          name: testHelper.centerName,
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
        .post(`/api/v1/centers?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.centerName,
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
          testHelper.setCenterId(res.body.id);
          done();
        });
    });

    it('should return a status 400 error response for adding a center that already exists', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('center name already exists');
          done();
        });
    });

    it('should return a status 201 success response for valid post request with admin token', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.anotherCenterName,
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
        .get('/api/v1/centers')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          done();
        });
    });

    it('should return a status 200 success response for a get center request', (done) => {
      chai
        .request(host)
        .get(`/api/v1/centers/${testHelper.centerId}`)
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
        .get('/api/v1/centers/0')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center not found');
          done();
        });
    });

    it('should return a status 400 error response for invalid center id', (done) => {
      chai
        .request(host)
        .get('/api/v1/centers/id')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('invalid id parameter');
          done();
        });
    });
  });

  describe('Test for editing centers', () => {
    it('should return a status 404 error response for trying to edit a non existing center', (done) => {
      chai
        .request(host)
        .put(`/api/v1/centers/0?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.randomCenterName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1, image2, image3, image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center not found');
          done();
        });
    });

    it('should return a status 409 error response for valid put request with admin token but already existing name', (done) => {
      chai
        .request(host)
        .put(`/api/v1/centers/${testHelper.centerId}?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.anotherCenterName,
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
        .put(`/api/v1/centers/${testHelper.centerId}?token=${testHelper.adminToken}`)
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
