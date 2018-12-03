const request = require("request");
const cheerio = require("cheerio");
const topStorySave = require("./models/news-model");
let data = [];

let FetchGeoNews = async function(url) {
  return await getData(url).then(res => {
    let key = 0;
    const $ = cheerio.load(res);
    const topStory = $("div.m_c_left")
      .find("li")
      .each(function(i, el) {
        const title = $(el)
          .find(".heading")
          .find("a")
          .text()
          .replace(/'/g, "");

        const link = $(el)
          .find(".heading")
          .children()
          .attr("href");

        const img = $(el)
          .find(".m_pic")
          .find("a")
          .find(".video-icon")
          .next()
          .attr("data-cfsrc");

        if (img !== undefined) {
          var bigImg = img.replace(/s_/g, "");
        }

        if (key == 0) {
          GeoNews = {
            title: title,
            link: link,
            image: bigImg,
            topstory: true
          };
        } else {
          GeoNews = {
            title: title,
            link: link,
            image: bigImg
          };
        }
        key++;
        data.push(GeoNews);
      });

    topStorySave
      .findById({
        _id: "geonews"
      })
      .remove(() => {})
      .then(() => {
        new topStorySave({
          _id: "geonews",
          Data: data
        })
          .save()
          .then(() => {
            data.splice(0, data.length);
          });
      });
  });
};

function getData(url) {
  return new Promise(resolve => {
    request(url, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        resolve($.html());
      } else {
        reject("Problem getting data");
      }
    });
  });
}

module.exports = FetchGeoNews;

