const mongoose = require('mongoose');

mongoose.connect('mongodb://db:27017/kursdb', {useNewUrlParser: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    console.info('Mongoose connected!');
});
mongoose.connection.on('disconnected', () => {
    console.info('Mongoose disconnected!');
});
mongoose.connection.on('error', (err) => {
  console.log(err.message);
  process.exit(1);
});

const Schema = mongoose.Schema;
const KursModelSchema = new Schema({
    'symbol': String,
    'e_rate': {
        'jual': {type: String},
        'beli': {type: String},
    },
    'tt_counter': {
        'jual': {type: String},
        'beli': {type: String},
    },
    'bank_notes': {
        'jual': {type: String},
        'beli': {type: String},
    },
    'date': Date,
});


let KursModel = mongoose.model('KursModel', KursModelSchema);  
module.exports.Kurs = KursModel;

module.exports.create = (meta) => {
    let instance = KursModel(meta);
    instance.save((err) => {
        if (err) {
            console.log('Failed to save to database: ' + meta['symbol']);
        } else {
            console.log('success save to db');
        }
    });
}