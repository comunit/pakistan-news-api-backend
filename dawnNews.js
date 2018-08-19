const request = require('request');
const cheerio = require('cheerio');
const topStorySave = require('./models/news-model');
let data = [];

let FetchDawnNews = async function (url) {
  return await getData(url).then((res) => {
    const $ = cheerio.load(res);
    $('div.mb-4.pr-0.pr-sm-2.lap-and-up-border--right').find('article').each(function (i, el) {
      const title = $(el).find('.story__title').text().replace(/\n/g, '');
      const link = $(el).find('a').attr('href');
      const desc = $(el).find('.story__excerpt').text().replace(/  /g, '').replace(/\n/g, '');
      const image = $(el).find('.media__item').find('img').attr('src');

      dawnNews = {
        title: title,
        description: desc,
        link: link,
        image: image
      }
      data.push(dawnNews);
    })

    topStorySave.findById({
      _id: 'dawnnews'
    }).remove(() => {}).then(() => {
      new topStorySave({
        _id: 'dawnnews',
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

module.exports = FetchDawnNews;