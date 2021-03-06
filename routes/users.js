var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "users"});
});

/*router.get('/login', function(req, res, next){
  res.render('login');
});*/


function hashPwd(userName, pwd){
  var hash = crypto.createHash('md5');
  hash.update(userName + pwd);
  return hash.digest('hex');
}

var users = [
    {
      "DisplayName": "刘振",
      "Username" : "liuz.nsn@hotmail.com",
      "Password" : "123456",
      "Role"     : "用户",
      "Area"     : ["茂名", "从化"],
      "hash"     : hashPwd("liuz.nsn@hotmail.com", "123456"),
      "last"     : ''
    },
    {
      "DisplayName": "任柏威",
      "Username" : "david.ren@gzoceannet.com",
      "Password" : "123456",
      "Role"     : "用户",
      "Area"     : ["茂名", "从化"],
      "hash"     : hashPwd("david.ren@gzoceannet.com", "123456"),
      "last"     : ''
    },
    {
      "DisplayName": "李轶鹏",
      "Username" : "whataride@gmail.com",
      "Password" : "123456",
      "Role"     : "用户",
      "Area"     : ["茂名", "从化"],
      "hash"     : hashPwd("whataride@gmail.com", "123456"),
      "last"     : ''
    },
    {
      "DisplayName": "惠延昭",
      "Username" : "yanzhao.hui@gzoceannet.com",
      "Password" : "888888",
      "Role"     : "管理员",
      "Area"     : ["茂名", "从化"],
      "hash"     : hashPwd("yanzhao.hui@gzoceannet.com", "888888"),
      "last"     : ''
    }
  ];

function authenticate(userName, hash){

  for(var i = 0; i < users.length; ++i){
    var user = users[i];
    if(userName === user.Username){
      if(hash === user.hash){
        return 0;
      }else{
        return 1;
      }
    }
  }

  return 2;
}
function getLastLoginTime(userName){
  for(var i = 0; i < users.length; ++i){
    var user = users[i];
    if(userName === user.Username){
      return user.last;
    }
  }
  return "";
};

function updateLastLoginTime(userName){
  for(var i = 0; i < users.length; ++i){
    var user = users[i];
    if(userName === user.Username){
      user.last = Date().toString();
      return;
    }
  }
};

function authenticate(userName, hash){

  for(var i = 0; i < users.length; ++i){
    var user = users[i];
    if(userName === user.Username){
      if(hash === user.hash){
        return 0;
      }else{
        return 1;
      }
    }
  }
  return 2;
};

function isLogined(req){
  if(req.cookies["account"] != null){
    var account = req.cookies["account"];
    var user = account.account;
    var hash = account.hash;
    if(authenticate(user, hash)==0){
      console.log(req.cookies.account.account + " had logined.");
      return true;
    }
  }
  return false;
};

router.post('/login', function(req, res, next){
  var userName = req.body.UserName;
  var passWord = req.body.Pincode;

  var hash = hashPwd(userName, req.body.Pincode);

  console.log("Username = " + userName + " Password = " + passWord + " Hash = " + hash);

  switch(authenticate(userName, hash)){
    case 0: //success
      var lastTime = getLastLoginTime(userName);
      updateLastLoginTime(userName);
      console.log("login ok, last - " + lastTime);
      res.cookie("account", {account: userName, hash: hash, last: lastTime}, {maxAge: 300000});
      //res.redirect('http://www.baidu.com');
      res.send({"code": "0", "city": "茂名", "area": "茂南"});
      res.end();

      console.log("after redirect");
      break;
    case 1: //password error
      console.log("password error");
      res.render('login');
      break;
    case 2: //user not found
      console.log("user not found");
      res.render('login');
      break;
  }
});


router.get('/logout', function(req, res, next){
  res.clearCookie("account");
  res.redirect('/login');
});

router.requireAuthentication = function(req, res, next){
  if(req.path == "/login"){
    next();
    return;
  }

  if(req.cookies["account"] != null){
    var account = req.cookies["account"];
    var user = account.account;
    var hash = account.hash;
    if(authenticate(user, hash)==0){
      console.log(req.cookies.account.account + " had logined.");
      next();
      return;
    }
  }
  console.log("not login, redirect to /login");
  res.redirect('/login');
};


router.get('/login', function(req, res, next){
  console.log("cookies:");
  console.log(req.cookies);
  if(isLogined(req)){
    res.redirect('index');
  }else{
    res.render('login');
  }
});

router.get('/index',function(req, res, next){
  res.render('index');
});

router.post("/search", function(req, res, next){
  var searchContent = req.body.searchSite;
  console.log(searchContent);
})

module.exports = router;
