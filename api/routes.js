const express = require('express');
const topStorySave = require('../models/news-model');
const router = express.Router();

// ary news route
router.get('/arynews', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  topStorySave.findOne({_id: 'arynews'}).then((data) => {
    res.json(data.Data);
  })
})

// daily pakistan route
router.get('/dailypakistan', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  topStorySave.findOne({_id: 'dailypakistan'}).then((data) => {
    res.json(data.Data);
  })
})

// dunya news route
router.get('/dunyanews', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  topStorySave.findOne({_id: 'dunyanews'}).then((data) => {
    res.json(data.Data);
  })
})

// dawn news route
router.get('/dawnnews', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  topStorySave.findOne({_id: 'dawnnews'}).then((data) => {
    res.json(data.Data);
  })
})

// geo news route
router.get('/geonews', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  topStorySave.findOne({_id: 'geonews'}).then((data) => {
    res.json(data.Data);
  })
})

module.exports = router;