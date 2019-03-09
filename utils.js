const rp    = require('request-promise');
const $     = require('cheerio');
const model = require('./models');


module.exports.isValidDate = (stringDate) => {
    let date = Date.parse(new Date(stringDate));
    return !isNaN(date);
};

module.exports.indexingKurs = async () => {
    const url  = 'https://www.bca.co.id/id/Individu/Sarana/Kurs-dan-Suku-Bunga/Kurs-dan-Kalkulator';

    await rp(url)
    .then((html) => {
        let currentDate = new Date();
        currentDate.setHours(0,0,0,0);

        let record = {
            "symbol": null,
            "e_rate": {},
            "tt_counter": {},
            "bank_notes": {},
            "date": currentDate,
        };

        let content = $("div.kurs-e-rate > table > tbody tr", html);

        content.toArray().forEach((element) => {
            element.children
                .filter((value) => value.tagName !== null)
                .forEach((child, index) => {
                    let colValue = child.children[0].data;
                        switch(index) {
                            case 0:
                                record['symbol'] = colValue;
                                break;
                            case 1:
                                record['e_rate']['jual'] = colValue
                                break;
                            case 2:
                                record['e_rate']['beli'] = colValue
                                break;
                            case 3:
                                record['tt_counter']['jual'] = colValue
                                break;
                            case 4:
                                record['tt_counter']['beli'] = colValue
                                break;
                            case 5:
                                record['bank_notes']['jual'] = colValue
                                break;
                            case 6:
                                record['bank_notes']['beli'] = colValue
                                break;
                        }
                    });
                    model.create(record);
        });
    })
    .catch((err) => {
        console.log(err);
    });
};

module.exports.normalizePayload = (meta) => {
    Object.keys(meta).map(function(key, index) {
        let data = meta[key];
        if (key === 'date') {
            if (module.exports.isValidDate(data)) {
                meta[key] = new Date(data);
            } else {
                throw 'invalid date format.';
            }
        }
    });
    return meta;
};