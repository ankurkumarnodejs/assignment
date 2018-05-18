var express = require('express');
var router = express.Router();
var passport = require('passport');
var Page = require('../model/Page.js');




router.get('/', function(req, res, next) {    
    var response={};
    Page.find({}, null, {sort: {created_at: 1}},function(err,data){
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
    var page = new Page(req.body);
    page.save(function(err){
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
    Page.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
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
    Page.findById(req.params.id,function(err,data){
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
    Page.remove({_id:req.params.id},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : "Deleted Successfully"};
        };
        res.json(response);
    }); 
});

module.exports = router;