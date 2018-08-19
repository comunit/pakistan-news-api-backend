const request = require('request');
const cheerio = require('cheerio');
const topStorySave = require('./models/news-model');
let data = [];

let FetchDunyaNews = async function (url) {
  return await getData(url).then((res) => {
    const $ = cheerio.load(res);
    const topStory = $('.top_story').text().replace(/\s\s+/g, '');
    const topStoryLink = $('.top_story a').attr('href');
    const topStoryImg = $('.top_story img').attr('src');
    const DunyaNews = {
      title: topStory,
      link: 'http://dunyanews.tv' + topStoryLink,
      image: topStoryImg,
      topstory: true
    }
    data.push(DunyaNews);
    $('.edwn_inner').each(function (i, el) {
      let mainNews = $(el).find('h2').text();
      let desc = $(el).find('p').text();
      let img = $(el).find('img').attr('src');
      let link = $(el).find('a').attr('href');
      let TopStories = {
        title: mainNews,
        description: desc,
        link: 'http://dunyanews.tv' + link,
        image: img
      }
      data.push(TopStories);
    });

    topStorySave.findById({
      _id: 'dunyanews'
    }).remove(() => {}).then(() => {
      new topStorySave({
        _id: 'dunyanews',
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

module.exports = FetchDunyaNews;