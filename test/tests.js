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

describe('Submit new kurs API testing', () => {
    it('it should be save new kurs data to database.', (done) => {
        chai.request('localhost:7000')
        .post('/api/kurs')
        .type('json')
        .send({
            "symbol": "CAK",
            "e_rate": {
                "jual": "666",
                "beli": "999"
            },
            "tt_counter": {
                "jual": "999",
                "beli": "999"
            },
            "bank_notes": {
                "jual": "999",
                "beli": "666"
            },
            "date": "2019-03-10"
        })
        .end((err, res) => {
            expect(res.statusCode).to.equal(201);
        });
        done()
    });
});

describe('Submit new kurs API testing with invalid schema', () => {
    it('it should be show error message.', (done) => {
        chai.request('localhost:7000')
        .post('/api/kurs')
        .type('json')
        .send({
            "symbol": "CAK",
            "date": "2019-03-10"
        })
        .end((err, res) => {
            expect(res.statusCode).to.equal(400);
        });
        done()
    });
});

describe('Submit new kurs API testing with invalid date format', () => {
    it('it should be show error message.', (done) => {
        chai.request('localhost:7000')
        .post('/api/kurs')
        .type('json')
        .send({
            "symbol": "CAK",
            "e_rate": {
                "jual": "666",
                "beli": "999"
            },
            "tt_counter": {
                "jual": "999",
                "beli": "999"
            },
            "bank_notes": {
                "jual": "999",
                "beli": "666"
            },
            "date": "201YUU90310"
        })
        .end((err, res) => {
            expect(res.statusCode).to.equal(400);
        });
        done()
    });
});

describe('Delete kurs API testing', () => {
    it('it should remove all data in selected data.', (done) => {
        chai.request('localhost:7000')
        .delete('/api/kurs/2019-03-09')
        .end((err, res) => {
            expect(res.statusCode).to.equal(204);
        });
        done()
    });
});

