var express = require('express');
var fs = require('fs');

var router = express.Router();

/* GET home page. */



router.get('/index', function(req, res){
  res.redirect('error', {title: "Validated"});
});



module.exports = router;
