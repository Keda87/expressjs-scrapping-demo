const express   = require('express');
const utils     = require('./utils');
const model     = require('./models');

const app  = express();
app.use(express.json());

app.get('/api/indexing', (req, res) => {
    utils.indexingKurs();
    return res.json({'message': 'indexing kurs done.'});
});

app.delete('/api/kurs/:date', (req, res) => {
    let dateParam = req.params.date;
    if (utils.isValidDate(dateParam)) {
        let date = new Date(dateParam);

        model.Kurs.deleteMany({'date': date}, (err) => {
            if (err) {
                console.log('Failed to delete data.');
            } else {
                return res.status(204).json({'message': 'Delete succeed.'});
            }
        });
    } else {
        return res.status(400).json({'message': 'invalid date in parameter.'})
    }
});

app.get('/api/kurs', (req, res) => {
    let params     = {'date': {}},
        queryStart = req.query.startdate,
        queryEnd   = req.query.enddate,
        hasDate    = false;
    
    if (queryStart !== undefined) {
        hasDate =  true;
        if (utils.isValidDate(queryStart)) {
            params['date']['$gte'] = new Date(queryStart);
        } else {
            return res.status(400).json({'message': 'invalid date in start date.'})
        }
    }

    if (queryEnd !== undefined) {
        hasDate =  true;
        if (utils.isValidDate(queryEnd)) {
            params['date']['$lte'] = new Date(queryEnd);
        } else {
            return res.status(400).json({'message': 'invalid date in end date.'})
        }
    }

    model.Kurs
    .find(!hasDate ? {} : params, {'_id': 0, '__v': 0})
    .lean()
    .exec((err, kurs) => {
        return res.status(200).json({'results': kurs});
    });
});

app.get('/api/kurs/:symbol', (req, res) => {
    let symbol     = req.params.symbol,
        params     = {'symbol': symbol, 'date': {}},
        queryStart = req.query.startdate,
        queryEnd   = req.query.enddate,
        hasDate    = false;
    
    if (queryStart !== undefined) {
        hasDate =  true;
        if (utils.isValidDate(queryStart)) {
            params['date']['$gte'] = new Date(queryStart);
        } else {
            return res.status(400).json({'message': 'invalid date in start date.'})
        }
    }

    if (queryEnd !== undefined) {
        hasDate =  true;
        if (utils.isValidDate(queryEnd)) {
            params['date']['$lte'] = new Date(queryEnd);
        } else {
            return res.status(400).json({'message': 'invalid date in end date.'})
        }
    }

    model.Kurs
    .find(hasDate ? params : {'symbol': symbol}, {'_id': 0, '__v': 0})
    .lean()
    .exec((err, kurs) => {
        return res.status(200).json({'result': kurs});
    });
});

app.post('/api/kurs', (req, res) => {
    try {
        payload = utils.normalizePayload(req.body);
        let kurs  = new model.Kurs(payload);
        let error = kurs.validateSync();
        if (error !== undefined) {
            return res.status(400).json({'message': 'Invalid kurs schema'});
        }
        kurs.save();
        return res.status(201).json(req.body);
    } catch(err) {
        return res.status(400).json({'message': err});
    }
});

app.put('/api/kurs', (req, res) => {
    try {
        payload = utils.normalizePayload(req.body);

        model.Kurs.findOne({
            symbol: payload.symbol,
            date: new Date(payload.date)
        }, (err, kurs) => {
            if(!err) {
                if(!kurs) {
                    kurs = new Kurs(payload);
                } else {
                    kurs.symbol     = payload.symbol;
                    kurs.e_rate     = payload.e_rate;
                    kurs.tt_counter = payload.tt_counter;
                    kurs.bank_notes = payload.bank_notes;
                }
                kurs.save(function(err) {
                    if(!err) {
                        return res.status(200).json(payload);
                        console.log('data updated.');
                    }
                    else {
                        console.log('failed to update data');
                    }
                });
            }
        });
    } catch(err) {
        return res.status(400).json({'message': err});
    }
});

const port = 7000;
app.listen(port, () => {
    console.log(`BCA kurs app listening on port ${port}`);
});