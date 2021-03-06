const express = require("express");
const Twig = require("twig"),
  twig = Twig.twig;
var path = require("path");
const FetchDunyaNews = require("./dunyaNews");
const FetchAryNews = require("./aryNews");
const FetchGeoNews = require("./geoNews");
const FetchDawnNews = require("./dawnNews");
const FetchDailyPakistan = require("./dailyPakistan");
const FetchExpressTribune = require("./expressTribune");
const dunyaNews = "http://dunyanews.tv/";
const aryNews = "https://arynews.tv/en/";
const geoNews = "https://www.geo.tv/";
const dawnNews = "https://www.dawn.com/";
const dailyPakistan = "https://en.dailypakistan.com.pk/category/pakistan/";
const expressTribune = "https://tribune.com.pk/";
const apiRoutes = require("./api/routes");
const timeSave = require("./models/time-model");
const mongoose = require("mongoose");
const moment = require("moment");
let lastUpdated = 0;
let start = moment(lastUpdated, "HH:mm");
const app = express();

mongoose.connect(
  "mongodb://comunit:imran123@ds115493.mlab.com:15493/pakistan-news-api",
  { useNewUrlParser: true },
  () => {
    console.log("connected to mongoose db");
  }
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// home route
app.get("/", (req, res) => {
  let time = moment().diff(start, "minutes");
  res.render("index.twig", { time });
});

// api routes
app.use("/api", apiRoutes);

function getData() {
  FetchDunyaNews(dunyaNews).then(() => {
    console.log("dunya news refreshed");
    FetchAryNews(aryNews)
      .then(() => {
        console.log("ary news refreshed");
      })
      .then(() => {
        FetchGeoNews(geoNews)
          .then(() => {
            console.log("geo news refreshed");
          })
          .then(() => {
            FetchDawnNews(dawnNews)
              .then(() => {
                console.log("dawn news refreshed");
              })
              .then(() => {
                FetchDailyPakistan(dailyPakistan)
                  .then(() => {
                    console.log("daily pakistan refreshed");
                  })
                  .then(() => {
                    FetchExpressTribune(expressTribune).then(() => {
                      console.log("express tribune refreshed");
                    });
                  });
              });
          });
      });
  });
}

setInterval(() => {
  // save data to database
  getData();
  // update time in database
  saveTime();
}, 1200000);

setInterval(() => {
  console.log("Keeping it alive");
}, 60000);

const getTime = () => {
  let Hours = new Date().getHours();
  let minutes = new Date().getMinutes();
  lastUpdated = Hours + ":" + minutes;
  return lastUpdated;
};

const saveTime = () => {
  lastUpdated = getTime();
  start = moment(lastUpdated, "HH:mm");
  timeSave
    .findById({
      _id: "time"
    })
    .remove(() => {})
    .then(() => {
      new timeSave({
        _id: "time",
        time: start
      })
        .save()
        .then(() => {
          console.log("time saved");
        });
    });
};

// call whenever restarted
getData();
saveTime();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

