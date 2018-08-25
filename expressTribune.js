const request = require('request');
const cheerio = require('cheerio');
const topStorySave = require('./models/news-model');
let data = [];

let FetchExpressTribune = async function (url) {
  return await getData(url).then((res) => {
    const $ = cheerio.load(res);
    const topStory = $('.position-1').find('h1').text().replace(/\n/g, '');
    const topStoryLink = $('.position-1').find('a').attr('href');
    const topStoryImg = $('.story.manageable.cat-0.group-0.position-1.first').find('.image').children().attr('data-cfsrc')
    const expressTribune = {
      title: topStory,
      link: topStoryLink,
      image: topStoryImg,
      topstory: true
    }

    data.push(expressTribune);
    $('.story.manageable.cat-0.group-0').each(function (i, el) {
      let mainNews = $(el).find('h2').text().replace(/\n/g, '');
      let link = $(el).find('a').attr('href');
      let image = $(el).find('.image').children().attr('data-cfsrc').replace(/160x120/g, '640x480');
      if (mainNews === '') {
        
      } else {
        let TopStories = {
          title: mainNews,
          link: link,
          image: image
        }
        data.push(TopStories);
      }
    });

    topStorySave.findById({
      _id: 'expresstribune'
    }).remove(() => {}).then(() => {
      new topStorySave({
        _id: 'expresstribune',
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

module.exports = FetchExpressTribune;