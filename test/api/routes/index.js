var express = require('express');
var router = express.Router();
var promotionModel  =  require("../model/Promotion.js");
var pageModel  =  require("../model/Page.js");
var bannerModel  =  require("../model/Banner.js");
var packageModel  =  require("../model/Package.js");
var bannerModelTiming = require("../model/BannerTiming.js");
var bannerModelTimingImage = require("../model/BannerTimingImage.js");
/*-------------------------------START PROMOTION--------------------------------------------------------*/
router.get('/promotion', function(req, res, next) {
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	promotionModel.find({}).populate('countryId').populate('stateId').exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.post('/promotion',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
    var promotion = new promotionModel(req.body);
    promotion.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

router.put('/promotion/:id',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	promotionModel.findByIdAndUpdate(req.params.id, req.body, function(err, promotion) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
});

router.get('/promotion/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	promotionModel.findById(req.params.id).populate('countryId').populate('stateId').exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.delete('/promotion/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	promotionModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});

/*-------------------------------END PROMOTION--------------------------------------------------------*/

/*-------------------------------START PAGE--------------------------------------------------------*/
router.get('/page', function(req, res, next) {
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	pageModel.find({}).populate('countryId').populate('stateId').exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.post('/page',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
    var page = new pageModel(req.body);
    page.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

router.put('/page/:id',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	pageModel.findByIdAndUpdate(req.params.id, req.body, function(err, page) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
});

router.get('/page/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	pageModel.findById(req.params.id).populate('countryId').populate('stateId').exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.delete('/page/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	pageModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});


router.post('/pagename',function(req,res){
    
    var response={};

    //console.log(req.body.str);

    pageModel.find({ url: req.body.str },function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : data};
        };
        res.json(response);
    });

});

/*-------------------------------END PAGE--------------------------------------------------------*/

/*-------------------------------START BANNER--------------------------------------------------------*/
router.get('/banner', function(req, res, next) {
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	bannerModel.find({}).populate('countryId').populate('stateId').exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.post('/banner',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
    var banner = new bannerModel(req.body);
    banner.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

router.put('/banner/:id',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
 
	var response={};
	bannerModel.findByIdAndUpdate(req.params.id, req.body, function(err, banner) {
		//console.log(banner);
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
});

router.get('/banner/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	bannerModel.findById(req.params.id).populate('countryId').populate('stateId').exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.delete('/banner/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	bannerModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});


router.get('/bannertime', function(req, res, next) {
	var response={};
	bannerModelTiming.find({}).exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});



router.get('/bannertimeimage', function(req, res, next) {
	var response={};
	bannerModelTimingImage.find({}).exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


router.get('/banner-rand/:len', function(req, res, next) {
	var response={};

  var numbers = [], temp = req.params.len;
  while (temp--)
    numbers[temp] = temp+1;
  
  var index = Math.floor(Math.random() * req.params.len--),
      last  = numbers.splice(index, 1)[0];
  
  //console.log( numbers, index , last );
    
  function generate(){
    index = Math.floor(Math.random() * req.params.len);
    temp = last;
    last = numbers[index];
    numbers[index] = temp;
    return last;
  }

    response = {"error" : false,"message" : Math.floor(Math.random() * generate())};
    res.json(response);
	
	/*bannerModel.count().exec(function(err, count){
	bannerModel.find({}).limit( req.params.len ).skip(Math.floor(Math.random() * count)).exec(function (err, data) {
	*/
		/*		
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			
		};*/
		
/*	});
});*/

});




router.post('/bannertime',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
    var banner = new bannerModelTiming(req.body);
     bannerModelTiming.find({}).exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{

			if(data.length >  0){
             bannerModelTiming.findOneAndRemove({},function(err){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
				banner.save(function(err){
			    	if(err) {
			            response = {"error" : true,"message" : err};
			        } else {
			            response = {"error" : false,"message" : "Data added"};
			        }
			        res.json(response);
			        });
				};
				//res.json(response);
			});


			}else{
				banner.save(function(err){
			    	if(err) {
			            response = {"error" : true,"message" : err};
			        } else {
			            response = {"error" : false,"message" : "Data added"};
			        }
			        res.json(response);
			        });
			      }
		};
		//res.json(response);
	});
});



router.post('/bannertimeimage',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
    var banner = new bannerModelTimingImage(req.body);
     bannerModelTimingImage.find({}).exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{

			if(data.length >  0){
             bannerModelTimingImage.findOneAndRemove({},function(err){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
				banner.save(function(err){
			    	if(err) {
			            response = {"error" : true,"message" : err};
			        } else {
			            response = {"error" : false,"message" : "Data added"};
			        }
			        res.json(response);
			        });
				};
				//res.json(response);
			});
			}else{
				banner.save(function(err){
			    	if(err) {
			            response = {"error" : true,"message" : err};
			        } else {
			            response = {"error" : false,"message" : "Data added"};
			        }
			        res.json(response);
			        });
			      }
		};
		//res.json(response);
	});
});


router.delete('/bannertime/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	bannerModelTiming.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});



router.delete('/bannertimeimage/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	bannerModelTimingImage.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});


router.put('/bannertimeupdate/:id',function(req, res){

	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }

	var response={};
	if(req.body.type == 'video'){
		bannerModelTiming.findByIdAndUpdate(req.params.id, req.body, function(err, package) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
	}else{
	bannerModelTimingImage.findByIdAndUpdate(req.params.id, req.body, function(err, package) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
	}	
    });



router.post('/bannertype',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	bannerModel.find({type : req.body.type}).exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

/*-------------------------------END BANNER--------------------------------------------------------*/


/*-------------------------------START Package--------------------------------------------------------*/
router.get('/package', function(req, res, next) {
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	packageModel.find({}).exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.post('/package',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
    var package = new packageModel(req.body);
    package.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

router.put('/package/:id',function(req, res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	packageModel.findByIdAndUpdate(req.params.id, req.body, function(err, package) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
    });

router.get('/package/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	packageModel.findById(req.params.id).exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

router.delete('/package/:id',function(req,res){
	// if (!req.isAuthenticated()) {
 //        return res.status(200).json({
 //            status: false,
 //            message:'Access Denied'
 //        });
 //    }
	var response={};
	//console.log(req.params.id);
	packageModel.remove({ _id: req.params.id },function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});

/*-------------------------------END Package--------------------------------------------------------*/


module.exports = router;
