const request = require('request');
const cheerio = require('cheerio');
const topStorySave = require('./models/news-model');
let data = [];

let FetchDailyPakistan = async function (url) {
  return await getData(url).then((res) => {
    const $ = cheerio.load(res);

    $('.content-area').find('.firstly').find('article').each(function(i, el) {
      const title = $(el).find('h3').text().replace(/\s\s+/g, '');
      const link = $(el).find('a').attr('href');
      const image = $(el).find('a').find('img').attr('src');
      dailyPakistan = {
          title: title,
          link: link,
          image: image
      }
      data.push(dailyPakistan);
    })

    $('.content-area').find('.secondly').find('article').each(function(i, el) {
      const title = $(el).find('h4').text().replace(/\s\s+/g, '');
      const link = $(el).find('a').attr('href');
      const image = $(el).find('a').find('img').attr('src');
      dailyPakistan = {
          title: title,
          link: link,
          image: image
      }
      data.push(dailyPakistan);
    })

    topStorySave.findById({
      _id: 'dailypakistan'
    }).remove(() => {
    }).then(() => {
      new topStorySave({
        _id: 'dailypakistan',
        Data: data
      }).save().then(() => {
        data.splice(0, data.length);
      })
    })
  });
}

function getData(url) {
  return new Promise(resolve => {
    request(url, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        resolve($.html());
      } else {
        reject('Problem getting data');
      }
    })
  })
}

module.exports = FetchDailyPakistan;