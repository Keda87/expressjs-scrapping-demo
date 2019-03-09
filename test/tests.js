let expect   = require('chai').expect;
let chaiHttp = require('chai-http');
let chai     = require('chai');
chai.use(chaiHttp);

describe('Indexing API Testing', () => {
    it('It should success to request indexing.', (done) => {
        chai.request('localhost:7000')
        .get('/api/indexing')
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
          });
       done();
    });
});


describe('List available kurs API Testing', () => {
    it('It should display all indexed data from BCA.', (done) => {
        chai.request('localhost:7000')
        .get('/api/kurs')
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
          });
       done();
    });
});