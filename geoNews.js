const request = require('request');
const cheerio = require('cheerio');
const topStorySave = require('./models/news-model');
let data = [];

let FetchGeoNews = async function (url) {
  return await getData(url).then((res) => {
    const $ = cheerio.load(res);
    const topStory = $('.main-heading-video a').attr('title');
    const topStoryLink = $('.main-heading-video a').attr('href');
    const topStoryImg = $('.slider-area a').text();
    const findImage = cheerio.load(topStoryImg);
    const topStoryImg2 = findImage('body').children().attr('src');
    //push top story to data
    GeoNews = {
      title: topStory,
      link: topStoryLink,
      image: topStoryImg2,
      topstory: true
    }

    data.push(GeoNews);

    $('.featured_bottom_section').find('li').each(function (i, el) {
      const title = $(el).find('h2').text().replace(/\n/g, '');
      const link = $(el).find('a').attr('href');
      const img = $(el).find('a').text();
      const findImages = cheerio.load(img);
      const findImages2 = findImages('body').children().attr('src').replace(/s_/g, '');
      console.log(findImages2);
      let topStories = {
        title: title,
        link: link,
        image: findImages2
      }
      data.push(topStories);
    })

    topStorySave.findById({
      _id: 'geonews'
    }).remove(() => {}).then(() => {
      new topStorySave({
        _id: 'geonews',
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

module.exports = FetchGeoNews;