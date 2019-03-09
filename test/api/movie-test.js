const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token, movieId;
describe('/api/movies test', () => {
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

    it('It should get all movies', (done) => {
        chai.request(server)
            .get('/api/movies')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('It should post a movie', (done) => {
        const movie = {
            title: 'Test',
            director_id: "000000000000000000000000",
            category: "Test",
            country: "Test",
            year: 0,
            imdb_score: 0
        };
        chai.request(server)
            .post('/api/movies')
            .send(movie)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.a('object');
                res.body.should.have.property('added').property('_id');
                res.body.should.have.property('added').property('title');
                res.body.should.have.property('added').property('director_id');
                res.body.should.have.property('added').property('category');
                res.body.should.have.property('added').property('country');
                res.body.should.have.property('added').property('year');
                res.body.should.have.property('added').property('imdb_score');
                res.body.should.have.property('added').property('createdAt');
                movieId = res.body.added._id;
                done();
            });
    });

    it('It should get a movie', (done) => {
        chai.request(server)
            .get('/api/movies/' + movieId)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.a('object');
                res.body.should.have.property('movie').property('_id').eql(movieId);
                res.body.should.have.property('movie').property('title');
                res.body.should.have.property('movie').property('director_id');
                res.body.should.have.property('movie').property('category');
                res.body.should.have.property('movie').property('country');
                res.body.should.have.property('movie').property('year');
                res.body.should.have.property('movie').property('imdb_score');
                res.body.should.have.property('movie').property('createdAt');
                done();
            });
    });

    it('It should update a movie', (done) => {
        const movie = {
            title: 'Test',
            director_id: "000000000000000000000000",
            category: "Test",
            country: "Test",
            year: 0,
            imdb_score: 0
        };
        chai.request(server)
            .put('/api/movies/' + movieId)
            .send(movie)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.a('object');
                res.body.should.have.property('updated').property('_id');
                res.body.should.have.property('updated').property('title').eql(movie.title);
                res.body.should.have.property('updated').property('director_id').eql(movie.director_id);
                res.body.should.have.property('updated').property('category').eql(movie.category);
                res.body.should.have.property('updated').property('country').eql(movie.country);
                res.body.should.have.property('updated').property('year').eql(movie.year);
                res.body.should.have.property('updated').property('imdb_score').eql(movie.imdb_score);
                res.body.should.have.property('updated').property('createdAt');
                done();
            });
    });

    it('It should delete a movie', (done) => {
        chai.request(server)
            .delete('/api/movies/' + movieId)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.a('object');
                res.body.should.have.property('deleted').eql(true);
                done();
            });
    });
});