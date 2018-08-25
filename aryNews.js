const request = require('request');
const cheerio = require('cheerio');
const topStorySave = require('./models/news-model');
let data = [];

let FetchAryNews = async function (url) {
  return await getData(url).then((res) => {
    const $ = cheerio.load(res);
    const topStory = $('.bs-vc-wrapper a').attr('title');
    const topStoryLink = $('.bs-vc-wrapper a').attr('href');
    const topStoryImg = $('.bs-vc-wrapper a').attr('data-src');
    AryNews = {
      title: topStory,
      link: topStoryLink,
      image: topStoryImg,
      topstory: true
    }
    data.push(AryNews);
    FetchAryNewsPakistan('https://arynews.tv/en/category/pakistan/');
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

// pakistan section data
let FetchAryNewsPakistan = async function (url) {
  return await getPakistanData(url).then((res) => {
    const pakistanData = cheerio.load(res);
    pakistanData('.bsw-7').each(function (i, el) {
      let title = pakistanData(el).find('h2').text().replace(/\n/g, '');
      let description = pakistanData(el).find('.post-summary').text().replace(/\n/g, '');
      let link = pakistanData(el).find('a').attr('href');
      let image = pakistanData(el).find('a').attr('data-src').replace(/210x136/g, '750x369');
      let topStories = {
        title: title,
        description: description,
        link: link,
        image: image
      }
      data.push(topStories);
    })

    topStorySave.findById({
      _id: 'arynews'
    }).remove(() => {}).then(() => {
      new topStorySave({
        _id: 'arynews',
        Data: data
      }).save().then(() => {
        data.splice(0, data.length);
      })
    })
  });
}

function getPakistanData(url) {
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

module.exports = FetchAryNews;