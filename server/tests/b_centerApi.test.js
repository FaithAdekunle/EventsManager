/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
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
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('name must be 1 - 50 characters');
          done();
        });
    });

    it('should return a status 400 error response empty name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send({
          name: '   ',
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('name must be 1 - 50 characters');
          done();
        });
    });

    it('should return a status 400 error response missing description field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('description must be 1 - 1200 characters');
          done();
        });
    });

    it('should return a status 400 error response empty description field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
          description: '      ',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('description must be 1 - 1200 characters');
          done();
        });
    });

    it('should return a status 400 error response missing facilities field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('facilities must be 1 - 300 characters');
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
          facilities: '       ',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('facilities must be 1 - 300 characters');
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
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 'cost',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('cost must be a positive integer');
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
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: -450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('capacity must be a positive integer');
          done();
        });
    });

    it('should return a status 400 error response for empty address field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: '       ',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('address must be 1 - 50 characters');
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
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('address must be 1 - 50 characters');
          done();
        });
    });

    it('should return a status 400 error response for missing images field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('image(s) invalid');
          done();
        });
    });

    it('should return a status 400 error response for empty images field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: '       ',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('image(s) invalid');
          done();
        });
    });

    it('should return a status 400 error response for post request without token', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('missing token');
          done();
        });
    });

    it('should return a status 401 error response for post request with user token', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.userToken}`)
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('unauthorized token');
          done();
        });
    });

    it('should return a status 401 error response for post request with random token', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers?token=randomtoken')
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('authentication failed');
          done();
        });
    });

    it('should return a status 201 success response for post request with admin token', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.centerName,
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('status').to.equal('success');
          res.body.center.images.length.should.equal(4);
          testHelper.setCenterId(res.body.center.id);
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
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('center name already exists in center address');
          done();
        });
    });

    it('should return a status 201 success response for post request with admin token', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.anotherCenterName,
          description: 'This is the description for this center',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          address: 'This is the address for this center',
          images: 'image1###:###:###image2###:###:###image3###:###:###image4',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('status').to.equal('success');
          res.body.center.images.length.should.equal(4);
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
          res.body.should.have.property('centers');
          done();
        });
    });
    
    it('should return a status 200 success response for a get centers request', (done) => {
      chai
        .request(host)
        .get('/api/v1/centers?limit=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('centers');
          res.body.centers.length.should.equal(1);
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
          res.body.center.should.have.any.keys(['events']);
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
          res.body.should.have.property('error').equal('center not found');
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
          res.body.should.have.property('error').equal('invalid id parameter');
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
          res.body.should.have.property('error').equal('center not found');
          done();
        });
    });

    it('should return a status 409 error response for valid put request with admin token but already existing name and address', (done) => {
      chai
        .request(host)
        .put(`/api/v1/centers/${testHelper.centerId}?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.anotherCenterName,
          description: 'This is the description for this center',
          address: 'this is the aDDress foR thIs cenTEr',
          facilities: 'This###:###:###is###:###:###the###:###:###address###:###:###for###:###:###this###:###:###center',
          images: 'image1',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('center name already exists in center address');
          done();
        });
    });

    it('should return a status 200 success response for valid put request with admin token', (done) => {
      chai
        .request(host)
        .put(`/api/v1/centers/${testHelper.centerId}?token=${testHelper.adminToken}`)
        .send({
          name: testHelper.anotherCenterName,
          description: 'This is the description for this center',
          address: 'This is another address for this center',
          facilities: 'This, is, the, address, for, this, center',
          images: 'image1',
          capacity: 450,
          cost: 300000,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('status').to.equal('success');
          res.body.center.images.length.should.equal(1);
          done();
        });
    });
  });
});
