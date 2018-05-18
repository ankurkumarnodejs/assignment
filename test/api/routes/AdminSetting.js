var express = require('express');
var router = express.Router();
var passport = require('passport');

var AdminSetting = require('../model/AdminSetting.js');


router.get('/', function(req, res, next) {
   
    var response={};
    AdminSetting.find({}, null, {sort: {created_at: 1}},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        //console.log(response);
        res.json(response);
    }); 
});

router.post('/',function(req, res){
    
    var response={};
    var adminSetting = new AdminSetting(req.body);
    //console.log(adminSetting);
    adminSetting.save(function(err){
        if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

router.put('/:id',function(req, res){
    
    var response={};
    AdminSetting.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
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
    AdminSetting.findById(req.params.id,function(err,data){
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
    AdminSetting.remove({_id:req.params.id},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : "Deleted Successfully"};
        };
        res.json(response);
    }); 
});

module.exports = router;