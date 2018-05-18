var express = require('express');
var router = express.Router();
var passport = require('passport');

var Friend = require('../model/Friends.js');
var costomerModel = require('../model/Customer.js');



router.post('/checkblockedMe',function(req,res){   
    var response={};
    console.log(req.body);
    Friend.find({"FromId": req.body.FromId, "ToId": req.body.ToId, "status":4 },function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
            res.json(response);
        } else{
            if(data.length > 0){
                response = {"error" : true,"message" : "remove"};
                res.json(response);
            }else{
                response = {"error" : false,"message" : "open"};
                res.json(response);
            }
        };
    });
});


router.get('/getSentRequest/:id',function(req,res){
    var response={};
    Friend.find({FromId:req.params.id,status:0}).populate("ToId").exec( function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    });
});



router.post('/', function(req, res) {
    //console.log(req.body);
   
 var response={};
    var friend = new Friend(req.body);
    //console.log(friend);
    friend.save(function(err){
        if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
    
});

router.post('/accept-block', function(req, res) {
    var response={};
    Friend.update({
            FromId: req.body.FromId,
            ToId: req.body.ToId,
         }, {
             status: req.body.status
         })
         .exec(function(err, update) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : "Data update"};
            }
            res.json(response);

         });
    
});


router.post('/requiest-block', function(req, res) {
    var response={};
    
     Friend.find({FromId:req.body.id, status:req.body.status}).populate('FromId').populate('ToId').populate('stateId').exec(function (err, data){
  
    if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);

    });    
    
});


router.post('/block-new', function(req, res) {
    var response={};
    var friend = new Friend(req.body);    
    friend.save(function(err,data){
        //console.log(data);
        if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });    
});



router.post('/requiest-accept', function(req, res) {
    var response={};
    Friend.find( { $or:[ {'FromId':req.body.id},{'ToId':req.body.id}],$and:[{'status':req.body.status}]}).populate('FromId').populate('ToId').populate('stateId').exec(function (err, data){
    //Friend.find( { $or:[ {'FromId':req.body.id}, {'ToId':req.body.id} ],$and:[{'status':req.body.status}]}, function(err,docs){
    if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);

    });    
    
});

router.get('/customer-list-allow/:id', function(req, res) {
    var response={};
    Friend.find( { $or:[ {'FromId':req.params.id}, {'ToId':req.params.id} ] }).populate('FromId').populate('ToId').populate('stateId').exec(function (err, data){
       
    //Friend.find( { $or:[ {'FromId':req.body.id}, {'ToId':req.body.id} ],$and:[{'status':req.body.status}]}, function(err,docs){
    if(err) {
                response = {"error" : true,"message" : err};
            } else {
                 //console.log(data);
                response = {"error" : false,"message" : data};
            }
            res.json(response);
    }); 
});

router.delete('/unblock-friend/:id', function(req, res) {
    var response={};
    Friend.remove({_id:req.params.id}, function(err, user) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : "remove unblock"};
            }
            res.json(response);
        });
});


router.get('/', function(req, res, next) {
    
    var response={};
    Friend.find({}, null, {sort: {created_at: 1}},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        //console.log(response);
        res.json(response);
    }); 
});



router.put('/:id',function(req, res){
    
    var response={};
    Friend.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : "Data Update"};
            }
            res.json(response);
        });
});


router.get('/:id',function(req,res){
    
    var response={};
    //console.log(req.params.id);
    Friend.findById(req.params.id,function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    }); 
});


router.post('/myfriends',function(req,res){
    var response={};
    Friend.find({ $or: [{'FromId':req.body.id},{'ToId':req.body.id}], status:1}).populate("FromId").populate("ToId").exec(function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            if(data.length > 0){
             var list = [];
             for(var i = 0; i<data.length; i++){
              if(data[i].FromId._id == req.body.id){
               list.push(data[i].ToId);
              }
              if(data[i].ToId._id == req.body.id){
               list.push(data[i].FromId);
              }
             }
             response = {"error" : false,"message" : list};
            }else{
            response = {"error" : false,"message" : data};    
            }            
        };
        res.json(response);
    }); 
});


router.post('/mypendingrequest',function(req,res){
    var response={};
    Friend.find({'ToId': req.body.id, status:0}).populate("FromId").exec(function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
             if(data.length > 0){
                var list = [];
                for(var i=0; i<data.length; i++){
                 list.push(data[i].FromId);   
                }
                response = {"error" : false,"message" : list};
            }else{
                response = {"error" : false,"message" : data};   
            }
        };
        res.json(response);
    }); 
});


router.post('/myblocked',function(req,res){
    var response={};
    Friend.find({'FromId':req.body.id, status:4}).populate("ToId").exec( function(err,data){
        //console.log(err);
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
             if(data.length > 0){
                var list = [];
                for(var i=0; i<data.length; i++){
                 list.push(data[i].ToId);   
                }
                response = {"error" : false,"message" : list};
            }else{
                response = {"error" : false,"message" : data};   
            }
        };
        res.json(response);
    }); 
});


router.post('/myunblocked',function(req,res){
    var response={};
    Friend.remove({FromId: req.body.FromId, ToId: req.body.ToId, status: 4},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
             response = {"error" : true,"message" : "Removed?"};
        };
        res.json(response);
    }); 
});



router.post('/getAllSendRequistMe',function(req,res){
    
    var response={};
    //console.log(req.body.uData);
    Friend.find({FromId:req.body.uData,status:0},function(err,data){
        //console.log(err);
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    }); 
});

router.post('/getAllRequiestNotInSelf',function(req,res){
    
    var response={};
    //console.log(req.body);
    
    costomerModel.find({_id:{"$nin":req.body.uData}},function(err,data){
        //console.log(err);
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    }); 
});

router.post('/getAllRequiestAcceptSelf',function(req,res){
    
    var response={};
    //console.log(req.body);
    costomerModel.find({_id:{"$in":req.body.uData}},function(err,data){
        //console.log(err);
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    }); 
});


router.post('/getAllAcceptRequistMe',function(req,res){    
    var response={};
    //console.log(req.body.uData);
    Friend.find({ToId:req.body.uData, status:0},function(err,data){
        //console.log(err);
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    }); 
  });


router.delete('/:id',function(req,res){   
    var response={};
    //console.log(req.params.id);
    Friend.remove({_id:req.params.id},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : "Deleted Successfully"};
        };
        res.json(response);
    }); 
});


router.post('/for-delete',function(req,res){    
    var response={};
    //console.log(req.body);
    var f = req.body;
    Friend.findOne(f,function(err,data){
        //console.log(err);
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    }); 
  });


module.exports = router;