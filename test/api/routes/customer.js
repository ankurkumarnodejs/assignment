var express = require('express');
var router = express.Router();
var passport = require('passport');

var Customer = require('../model/Customer.js');
var Friend = require('../model/Friends.js');
var Message = require('../model/Message.js');
var Report = require('../model/Report.js');
var Notification = require('../model/Notification.js');

var OpenTok = require('opentok'), 
opentok = new OpenTok('46076142', '0378bf802db4608729190d5262df2d9d7bd4afac');



router.post('/checkuseroremail', function(req, res) {
  //console.log(req.body);  
  var response={};
  var customer = new Customer(req.body);
  Customer.find({ $or:[ {email:req.body.email}, {username: req.body.username}]}, function(err, emailmatch){
 if(err){
     response = {"error" : true,"message" : "Something went wrong occured Error!"};
     res.json(response);
    }else{
    if(emailmatch.length > 0){
      response = {"error" : true,"message" : "Username Or EmailId already exist"};      
    }else{
      response = {"error" : false,"message" : "No exists"};       
    }
     res.json(response);    
    }
  });
  });


router.post('/', function(req, res) {

  //  //console.log(req.body);  

  var response={};
  var customer = new Customer(req.body);
   customer.save(function(err, data){
        if(err) {
           response = {"error" : true,"message" : err};
        } else {
           response = {"error" : false,"message" : data};
        }
        res.json(response);
      });
});


router.get('/featured', function(req, res, next) { 
    //console.log("dfdsh");  
    var response={};
    Customer.find({"featured" : true, activate: true})
    .limit(6).populate("country").exec(function(err,data){
        //console.log(data);
        if (err) {
            response = {"error" : true, "message" : "Error fetching data"};
           } else{
            response = {"error" : false,"message" : data};
        };
       // //console.log(response);
       res.json(response);
   }); 

});

router.get('/adminreport', function(req, res, next) {    
     var response={};

     Report.find({},function(err, user) {
            if(err) {
              //console.log(err);
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : user};
            }
            res.json(response);
        }); 

});


router.get('/initnotifications/:id', function(req, res, next) {    
     var response = {};
     Notification.find({ToId : req.params.id, isread: false}).populate("ToId").populate("FromId").sort({created_at: -1}).exec(function(err, notificatons){
            if(err) {
              //console.log(err);
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : notificatons};
            }
            res.json(response);
        }); 
});

router.get('/allnotifications/:id', function(req, res, next) {    
     var response = {};
     Notification.find({ToId : req.params.id}).populate("ToId").populate("FromId").sort({created_at: -1}).exec(function(err, notificatons){
            if(err) {
              //console.log(err);
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : notificatons};
            }
            res.json(response);
        }); 
});



router.get('/readnotifications/:id', function(req, res, next) {    
     var response = {};
     Notification.update({ToId : req.params.id, isread: false}, {isread:true}, {multi: true}, function(err, notificatons){
            if(err) {
              //console.log(err);
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : "updated Successfully"};
            }
            res.json(response);
        }); 
});



router.get('/adminblocked', function(req, res, next) {   
    var response={};
    Friend.find({}, null, {sort: {created_at: 1}},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
       // //console.log(response);
       res.json(response);
   }); 
});



router.post('/send-report', function(req, res) {
    //console.log(req.body);
   
 var response={};
    var report = new Report(req.body);
    //console.log(report);
    report.save(function(err){
        if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
    
});

router.post('/abusereport',function(req, res){    
    var response={};
    //console.log(req.body);
    Report.find(req.body).populate("ForId").populate("FromId").exec(function(err, user) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : user};
            }
            res.json(response);
        });
});


router.post('/chat', function(req, res) { 
 var condition =  {
    $or : [

    { $and: [
        {
            'toCustId': req.body.fromCustId
        },
        {
            'fromCustId': req.body.toCustId
        }
        ]
    },
    {
        $and: [ 
        {
            'toCustId': req.body.toCustId
        },
        {
            'fromCustId': req.body.fromCustId
        }
        ]
    },

    ]
} 


var condition2 =  {
    $or : [

    { $and: [
        {
            'toCustId': req.body.fromCustId
        },
        {
            'fromCustId': req.body.toCustId
        },
        {isread : false}
        ]
    },
    {
        $and: [ 
        {
            'toCustId': req.body.toCustId
        },
        {
            'fromCustId': req.body.fromCustId
        },
        {isread : false}
        ]
    },

    ]
}; 

var response={};

Message.find(condition, null, {sort: {created_at: 1}},function(err,data){
    if (err) {
      response = {"error" : true,"message" : "Error fetching data"};
  } else{
    Message.update(condition2, { $set: { isread: true } },{"multi": true}, function(err, data){
        if(err){
            //console.log(err);
        }else{
            //console.log(data);
        }
    });
    response = {"error" : false,"message" : data};
};
res.status(200).json(response);
});
});


router.post('/messageread', function(req, res) {

var condition2 = {
     $and: [
        {
            'toCustId': req.body.toCustId
        },
        {
            'fromCustId': req.body.fromCustId
        },
        {isread : false}
        ]
    }; 

    var response={};
    Message.find(condition2, null, {sort: {created_at: 1}},function(err,data){
    if (err) {
      response = {"error" : true,"message" : "Error fetching data"};
  } else{
     var len = data.length;
     var op = [];
     if(len > 0){

     for(var i=0; i<len; i++){
          op.push(data[i]._id);
     }  

     Message.update({ _id: { $in: op } }, { $set: { isread: true } }, {"multi": true}, function(err, data){              
        
        if(err){
            //console.log(err);
        }else{
            //console.log(data);
        }

    });
    response = {"error" : false,"message" : data};
     }
};
res.status(200).json(response);   
});
});

/*

router.post('/unreadmessage', function(req, res, next) { 
 var messagelist = [];      
 var d = {
    findin:   function(arraytosearch, key, valuetosearch) {
     
        for (var i = 0; i < arraytosearch.length; i++) {
            var io = arraytosearch[i][key];
            var op = valuetosearch;                            
            //console.log('"'+io+'"', '"'+op+'"');
            //console.log('"'+io+'"' == '"'+op+'"');
            if ('"'+io+'"' == '"'+op+'"') {
                return i;
            }
        }
        return -1;
    },
    msgpush : function(data){              
       var dlength = data.length;
       for(var i=0; i<dlength; i++){                                   
           var single = {};                 
           if(messagelist.length == 0){ 
               var obj = { "id" : data[i].fromCustId, "messages" : [] };               
               obj.messages.push(data[i]); 
               messagelist.push(obj);                     
              }else{                    
              var index = d.findin(messagelist, "id" , data[i].fromCustId);
              if(index != -1)
              {
               messagelist[index].messages.push(data[i]);                     
           }else{                      
               single.id = data[i].fromCustId;
               single.messages = [];
               single.messages.push(data[i]);
               messagelist.push(single); 
           }
       }
   } 
   return messagelist;
}
};

var respnse = {};
var id = req.body.cid;  

Message.find({ $or: [{'fromCustId':req.body.id},{'toCustId':req.body.id}]}, null, {sort: {created_at: 1}}).populate('fromCustId').exec(function(err,data){
    if (err) {
        response = {"error" : true,"message" : "Error fetching data"};
        res.status(200).json(response);  
    } else{       
     //console.log(data); 
     if(data.length > 0)                   {
         response = {"error" : false,"message" : d.msgpush(data)};  
     }else{
        response = {"error" : false,"message" : data}; 
    }    
    res.status(200).json(response);             
};

}); 
});
*/







router.post('/unreadmessage', function(req, res, next) { 


 var messagelist = [];      
 var d = {
    findin:   function(arraytosearch, key, valuetosearch) {
        for (var i = 0; i < arraytosearch.length; i++) {
            var io = arraytosearch[i][key];
            var op = valuetosearch;                            
            //console.log('"'+io+'"', '"'+op+'"');
            //console.log('"'+io+'"' == '"'+op+'"');
            if ('"'+io+'"' == '"'+op+'"') {
                return i;
            }
        }
        return -1;
    },
    msgpush : function(data){ 

       var dlength = data.length;
       for(var i=0; i<dlength; i++){    
        var single = {};  
       if(data[i].fromCustId._id == req.body.id){

         if(messagelist.length == 0){                
           var obj = { "id" : data[i].toCustId, "messages" : [] };               
           obj.messages.push(data[i]); 
           messagelist.push(obj);                     
          }else{                    
              var index = d.findin(messagelist, "id" , data[i].toCustId);
              if(index != -1)
              {
               messagelist[index].messages.push(data[i]);                     
               }else{                      
               single.id = data[i].toCustId;
               single.messages = [];
               single.messages.push(data[i]);
               messagelist.push(single); 
           }
          }

         }  

       if(data[i].toCustId._id == req.body.id){

       if(messagelist.length == 0){                
           var obj = { "id" : data[i].fromCustId, "messages" : [] };               
           obj.messages.push(data[i]); 
           messagelist.push(obj);                     
          }else{                    
              var index = d.findin(messagelist, "id" , data[i].fromCustId);
              if(index != -1)
              {
               messagelist[index].messages.push(data[i]);                     
               }else{                      
               single.id = data[i].fromCustId;
               single.messages = [];
               single.messages.push(data[i]);
               messagelist.push(single); 
           }
          }

         }


   } 
   return messagelist;

}
};

var respnse = {};
var id = req.body.cid;  

Message.find({ $or: [{'fromCustId': req.body.id},{'toCustId': req.body.id}] }, null, {sort: {created_at: 1}}).populate('fromCustId').populate('toCustId').exec(function(err,data){
    if (err) {
        response = {"error" : true,"message" : "Error fetching data"};
        res.status(200).json(response);  
    } else{       
     //console.log(data); 
     if(data.length > 0) {
         
         response = {"error" : false,"message" : d.msgpush(data)};  
     }else{
        response = {"error" : false,"message" : []}; 
     }    
    res.status(200).json(response);             
};

}); 
});


router.post('/login', function(req, res, next) {
    Customer.find({username:req.body.email,password:req.body.password, activate: true}, null, {sort: {created_at: 1}},function(err,data){
    if (err) {
       res.status(200).json({
       data: {"error" : true,"message" : "Error fetching data"},
       error: true       
       });
    } else{

    var sessionId = "";
    var token = "";

    opentok.createSession(function(err, session) {
      console.log('errrrrrrrr',err);
    if (err) return //console.log(err);
    sessionId = session.sessionId;  
    token = opentok.generateToken(sessionId);
console.log('torek',token)
    if(token != "" && data.length > 0)
    {
    var obj = {tokboxsessionid : sessionId, tokboxtoken : token}; 

    Customer.findByIdAndUpdate({_id : data[0]._id}, obj , function(err, data){
    if (err) {
           //console.log(err);
    }else{
     res.status(200).json({
       data: data,
       error: false,
       status: "Login Successfully"
       });
    }
    });
    }else{
       res.status(200).json({
       data: [],
       error: true
       }); 
    }
    }); 
    }; 
    });
});




router.get('/change-tokbox-token/:id', function(req, res, next) {

    var sessionId = "";
    var token = "";

    opentok.createSession(function(err, session) {

    if (err) return //console.log(err);
    sessionId = session.sessionId;  
    token = opentok.generateToken(sessionId);

    if(token != "")
    {
    var obj = {tokboxsessionid : sessionId, tokboxtoken : token}; 

    Customer.findByIdAndUpdate({_id : req.params.id}, obj , function(err, data){
    if (err) {
           //console.log(err);

       res.status(200).json({
       data: "",
       error: true
       });

    }else{
     res.status(200).json({
       data: data,
       error: false,
       status: "Token Change Successfully"
       });
    }
    });
    }else{
       res.status(200).json({
       data: "",
       error: true
       }); 
    }
    }); 
    }); 
    
/*
router.post('/all-speed-avail', function(req, res, next) {
  //console.log(req.body);
Customer.find({_id : { "$nin": req.body.ids }, speedstatus:true, isbusyspeed : false}).count().exec(function (err, count) { 
  if (err) {
    //console.log(err);    
    res.status(200).json({
       data: "",
       error: true,
       status: "Error in Query"
       });
    }else{
  if(count > 0){
  var random = Math.floor(Math.random() * count);  
  
  //console.log("random");
  //console.log(random);

  Customer.findOne({_id : { "$nin": req.body.ids }, speedstatus:true, isbusyspeed : false}).skip(random).exec(
    function (err, result) {      
      //console.log(result) 
       res.status(200).json({
       data: result,
       error: false,
       status: "Token Change Successfully"
       });
    });
  }else{
    res.status(200).json({
       data: "",
       error: false,
       status: "No Available"
       });
 }
  }
})
});*/


router.post('/all-speed-avail', function(req, res, next) {
  //console.log(req.body);
Customer.find({_id : { "$nin": req.body.ids }, speedstatus:true, isbusyspeed : false}).count().exec(function (err, count) { 
  if (err) {
    res.status(200).json({
       data: "",
       error: true,
       status: "Error in Query"
       });
  }else{
  if ( count > 0) {
  var random = Math.floor(Math.random() * count);
  Customer.findOne({_id : { "$nin": req.body.ids }, speedstatus:true, isbusyspeed : false}).skip(random).exec(
    function (err, result) {      
      //console.log(result) 
       res.status(200).json({
       data: result,
       error: false,
       status: "Token Change Successfully"
       });
    });
  
  }else{
    res.status(200).json({
       data: "",
       error: true,
       status: "0 avail"
       });
  }
}
});
});




/*
router.post('/login', function(req, res, next) {

    Customer.find({email:req.body.email, password:req.body.password, activate: true}, null, {sort: {created_at: 1}},function(err,data){
    if (err) {
       res.status(200).json({
       data: {"error" : true,"message" : "Error fetching data"},
       error: true       
       });
    } else{
     res.status(200).json({
       data: data,
       error: false,
       status: "Login Successfully"
       });

   */



   /*

    var sessionId = "";
    var token = "";

    opentok.createSession(function(err, session) {

    if (err) return //console.log(err);
    sessionId = session.sessionId;  
    token = opentok.generateToken(sessionId);

    if(token != "" && data.length > 0)
    {
    var obj = {tokboxsessionid : sessionId, tokboxtoken : token}; 

    Customer.findByIdAndUpdate({_id : data[0]._id}, obj , function(err, data){
    if (err) {
           //console.log(err);
    }else{
     res.status(200).json({
       data: data,
       error: false,
       status: "Login Successfully"
       });
    }
    });

    }else{
       res.status(200).json({
       data: [],
       error: true
       }); 
    }

    }); 
*/


/*
    };
 
    });
});

*/


router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function(req, res) {
   // //console.log(req.user);
   if (!req.isAuthenticated()) {
    return res.status(200).json({
        status: false
    });
}
res.status(200).json({
    data:req.user,
    status: true
});
});


router.get('/', function(req, res, next) {
  
    // if (!req.isAuthenticated()) {
    //     return res.status(200).json({
    //         status: false,
    //         message:'Access Denied'
    //     });
    // }

    var response={};
    Customer.find({}, null, {sort: {created_at: 1}},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
       // //console.log(response);
       res.json(response);
   }); 

});


router.get('/activeuser', function(req, res, next) {
    var response={};
    Customer.find({activate:true, isprivate : false}).populate("country").exec(function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
       // //console.log(response);
       res.json(response);
   }); 

});


router.get('/live-now-list/:id', function(req, res, next) {

    //console.log("live-now-list");    
    var response={};
    Customer.find({islive : true, isbusy : false, _id :{ $ne : req.params.id}}, function(err,  data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            //console.log(data);
            response = {"error" : false,"message" : data};
        };
       // //console.log(response);
       res.json(response);
   }); 

});


router.post('/filters', function(req, res, next) {


    // if (!req.isAuthenticated()) {
    //     return res.status(200).json({
    //         status: false,
    //         message:'Access Denied'
    //     });
    // }
    
        var reqcondition = {};
        reqcondition.activate = true;
        reqcondition.isprivate = false;

    //console.log(req.body);

        if(req.body.gender.length > 0){
        reqcondition.gender = {$in : req.body.gender};    
        }   

   //console.log(req.body.country.length);

        if(req.body.country.length > 0){
        reqcondition["countryName"] = {$in : req.body.country};    
        }
        
        if(req.body.haircolor.length > 0){
        reqcondition["haircolor"] = {$in : req.body.haircolor};    
        }

        if(req.body.bodyshape.length > 0){
        reqcondition["bodyshape"] = {$in : req.body.bodyshape};    
        }
        if(req.body.maritalstatus.length > 0){
        reqcondition["maritalStatus"] = {$in : req.body.maritalstatus};    
        }
        if(req.body.smoke.length > 0){
        reqcondition["smoke"] = {$in : req.body.smoke};    
        }

        if(req.body.drink.length > 0){
        reqcondition["drink"] = {$in : req.body.drink};    
        }

        if(req.body.profession.length > 0){
        reqcondition["profession"] = {$in : req.body.profession};    
        }

        if(req.body.sexualorient.length > 0){
        reqcondition["sexualorient"] = {$in : req.body.sexualorient};    
        }

        if(req.body.minage != '' && req.body.maxage != '')
        {
        reqcondition.age = {
        $gte: req.body.minage,
        $lte: req.body.maxage
        };   
        }
   
  /* age */
        if(req.body.minage != '' && req.body.maxage == ''){
        reqcondition.age = {
        $gte: req.body.minage
        };
        }

        if(req.body.minage == '' && req.body.maxage != ''){
        reqcondition.age = {
        $lte: req.body.maxage
        };
        }

        if(req.body.minage != '' && req.body.maxage != '')
        {
        reqcondition.age = {
        $gte: req.body.minage,
        $lte: req.body.maxage
        };   
        }


/* Height */

        if(req.body.minheight != '' && req.body.maxheight == ''){
          reqcondition.height = {
          $gte: req.body.minheight
          };
        }

        if(req.body.minheight == '' && req.body.maxheight != ''){
          reqcondition.height = {
          $lte: req.body.maxheight
          };
        }

        if(((req.body.minheight != '') && (req.body.maxheight != '')) && ((typeof req.body.minheight != 'undefined') && (typeof req.body.maxheight != 'undefined')))
        {
          reqcondition.height = {
          $gte: req.body.minheight,
          $lte: req.body.maxheight
          };   
        }


        if(req.body.online == 'Y')
        {
        reqcondition.online = 'Y';   
        }

        var response={};

console.log("query");
console.log(reqcondition);

        Customer.find(reqcondition, null, {sort: {created_at: 1}}).populate('country').exec(function(err,data){
        if (err) {
        // //console.log(err)
        response = {"error" : true,"message" : "Error fetching data"};
        } else{
        // //console.log(data)
        response = {"error" : false, "message" : data};
        };
        // //console.log(response);
        res.json(response);
        }); 
        });


router.put('/:id',function(req, res){
    // if (!req.isAuthenticated()) {
    //     return res.status(200).json({
    //         status: false,
    //         message:'Access Denied'
    //     });
    // }
    var response={};
    Customer.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
        if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : user};
        }
        res.json(response);
    });
});


router.get('/userscountry',function(req, res){
    var response={};
    Customer.find({}).distinct('countryName', function(err, countrys) {
        if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : countrys};
        }
        res.json(response);
    });
});


router.get('/:id',function(req,res){
    
    var response={};
  //  //console.log(req.params.id);
  Customer.findById(req.params.id)
  .populate('visitors')
  .exec(function(err,data){
    if (err) {
        response = {"error" : true,"message" : "Error fetching data"};
    } else{
        response = {"error" : false,"message" : data};
    };
    res.json(response);
}); 
});


router.delete('/:id',function(req,res){
    // if (!req.isAuthenticated()) {
    //     return res.status(200).json({
    //         status: false,
    //         message:'Access Denied'
    //     });
    // }
    var response={};
   // //console.log(req.params.id);
   Customer.remove({_id:req.params.id},function(err,data){
    if (err) {
        response = {"error" : true,"message" : "Error fetching data"};
    } else{
        response = {"error" : false,"message" : "Deleted Successfully"};
    };
    res.json(response);
}); 
});


router.post('/visitor', function(req, res, next) {    
    var response = {};
    Customer.findById(req.body.id, null, {sort: {created_at: 1}},function(err,favourite){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        }else{
         const index = favourite.visitors.findIndex(item => item == req.body.vid); 
             //const index = data.visitors.indexOf(req.body.vid);
             if(index == -1){
                favourite.visitors.push(req.body.vid); 
                favourite.save(function(err, data){
                 if (err) {
                  response = {"error" : true,"message" : "Error fetching data"};
              } else{
                  response = {"error" : false,"message" : "ok"};
              };
              res.json(response);
          });
            }else{
             response = {"error" : false,"message" : "ok"};
             res.json(response);     
         }
     } 
 });
});


router.post('/account-confirms',function(req, res){
    //console.log(req.body);
    Customer.findOne({email:req.body.email}, function(err, dataq) {
        //console.log(dataq);
        if(err) {
            response = {"error" : true,"message" : err};
        } else {            
            var loggedUser = dataq;
            var name = loggedUser.firstname+" <"+loggedUser.email+" >";            
            var content = "Hi,<br><br>Please activate your account with below link:<br><br> <a href='http://18.221.47.77:3005/frontend/activate-account/"+loggedUser._id+"'>Email Activation Link</a><br><br>Speed Dating Team";
            req.mail.sendMail({  //email options
               from: "Speed Dating Team <navaidkitchen@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
               to: name, // receiver
               subject: "Email Activation", // subject
               html: content
            }, function(error, response){  //callback
               if(error){
                   //console.log(error);
               }else{
                   //console.log("Message sent: " + response.message);
               }
               req.mail.close();
               res.json({status:true});               
            });
        }
    });
});

router.post('/forget-password', function(req,res,next){
    var response={};
    Customer.find({email:req.body.email},function(err,data){
        if (err) {
            req.flash('error', 'something went wrong!');            
        } else{
            if (data.length>0) {
                var name = data[0].firstname+" <"+data[0].email+" >";
                var content = "Password reset Link <a href='http://18.221.47.77:3005/customer/reset-password/"+data[0]._id+"'>Click Here</a>"
                req.mail.sendMail({  //email options
                   from: "Speed Dating Team <navaidkitchen@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
                   to: name, // receiver
                   subject: "Reset Password", // subject
                   //text: "Email Example with nodemailer" // body
                   html: content
                }, function(error, response){  //callback
                   if(error){
                       //console.log(error);
                   }
                   else{
                       //console.log("Message sent: " + response.message);
                   }
                   req.mail.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                   res.json({error:false});
                });
                //console.log(data);
            }else{
                res.json({error:true, message:'Email does not exist'});
            }
        };
    }); 
});

router.post('/blockeduser',function(req, res){    
    var response={};
    //console.log(req.body);
    Friend.find(req.body).populate("FromId").populate("ToId").exec(function(err, user) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : user};
            }
            res.json(response);
        });
});


router.post('/contactus',function(req,res,next){

                var response={};
                var content = "<html><head></head><body><table> <tr> <td>Name :</td><td>"+req.body.name+"</td></tr><tr><td>Email : </td><td>"+req.body.email+"</td></tr><tr><td>Phone : </td><td>"+req.body.phone+"</td></tr><tr><td>Message : </td><td>"+req.body.message+"</td></tr></table></body></html>";
                ////console.log(content);
                req.mail.sendMail({  //email options
                   from: req.body.name+"<"+req.body.email+">", // sender address.  Must be the same as authenticated user if using GMail.
                   to: "Admin <info@v3xperts.com>", // receiver
                   subject: "Customer Query (" + req.body.name + ' )', // subject
                   //text: "Email Example with nodemailer" // body
                   html: content
                }, function(error, response){  //callback
                    if(error){
                       //console.log(error);
                   }else{
                       //console.log("Message sent: " + response.message);
                   }
                   req.mail.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                   res.json({error:false});
                });
                });





module.exports = router;