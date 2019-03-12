const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

describe('/api/directors test', () => {
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send({
                username: 'test',
                password: 'test'
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    it('It should get all directors', (done) => {
        chai.request(server)
            .get('/api/directors')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('It should post a director', (done) => {
        const director = {
            name: 'Test',
            surname: "Test",
            bio: "Test"
        };
        chai.request(server)
            .post('/api/directors')
            .send(director)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('surname');
                res.body.should.have.property('bio');
                directorId = res.body._id;
                done();
            });
    });

    it('It should get a director', (done) => {
        chai.request(server)
            .get('/api/directors/' + directorId)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('surname');
                res.body.should.have.property('bio');
                res.body.should.have.property('movies');
                done();
            });
    });

    it('It should update a director', (done) => {
        const director = {
            name: 'Test',
            surname: "Test",
            bio: "Test"
        };
        chai.request(server)
            .put('/api/directors/' + directorId)
            .send(director)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.a('object');
                res.body.should.have.property('updated').property('_id');
                res.body.should.have.property('updated').property('name').eql(director.name);
                res.body.should.have.property('updated').property('surname').eql(director.surname);
                res.body.should.have.property('updated').property('bio').eql(director.bio);
                res.body.should.have.property('updated').property('createdAt');
                done();
            });
    });

    it('It should delete a director', (done) => {
        chai.request(server)
            .delete('/api/directors/' + directorId)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.a('object');
                res.body.should.have.property('deleted').eql(true);
                done();
            });
    });
});