var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../model/User.js');
var Customer = require('../model/Customer.js');


router.post('/changepassword',function(req, res){    
    var response={};
    //console.log(req.body);
   User.findByUsername(req.body.username).then(function(sanitizedUser){
    if (sanitizedUser){
        sanitizedUser.setPassword(req.body.password, function(err, user){
            sanitizedUser.save();
            User.findByIdAndUpdate({_id : req.body.id}, {password: req.body.password}, function(err, user) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : user};
            }
            res.json(response);
            });
          });
        } else {
        response = {"error" : true,"message" : "err"};
        res.status(500).json(response);
      }
     },function(err){
    //console.error(err);
    });   
  });

router.post('/registerAdmin', function(req, res) {
    //console.log("regiter");
    //console.log(req.body);
    //console.log(User);
    User.register(new User(req.body), req.body.password, function(err, account) {
         if(err) {
                   response = {"error" : true,"message" : err};
                    } else {
                    response = {"error" : false,"message" : "Registration successful!"};
                }
                res.json(response);
                });
});

router.post('/register', function(req, res) {
    //console.log(req.body);
    // Customer.register(new Customer(req.body), req.body.password, function(err, account) {
    //     if (err) {
    //         return res.status(500).json({
    //             err: err
    //         });
    //     }
    //     else
    //     {

    //         res.json();
            var customer = new Customer(req.body);
            customer.save(function(err){
                if(err) {
                   response = {"error" : true,"message" : err};
                    } else {
                    response = {"error" : false,"message" : "Registration successful!"};
                }
                res.json(response);
                });

        //}
       
    //});
});

router.post('/login', function(req, res, next) {

    //console.log("customer");
    //console.log(req.body);
    
    var customers;

    passport.authenticate('local', function(err, User, info) {
        if (err) {
            return next(err);
        }
        if (!User) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(User, function(err) {
            if (err) {
                return res.status(500).json({
                err: 'Could not log in User'
                });
                }
                res.status(200).json({ 
                data:req.user,
                status: 'Login successful!'
                });
           //}
        });
        

    })(req, res, next);
});




router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function(req, res) {
    //console.log(req.user);
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
    
    var response={};
    User.find({}, null, {sort: {created_at: 1}},function(err,data){
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
    var user = new User(req.body);
    user.save(function(err){
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
    //console.log(req.body);
    User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
            if(err) {
                response = {"error" : true,"message" : err};
            } else {
                response = {"error" : false,"message" : user};
            }
            res.json(response);
        });
});





router.get('/:id',function(req,res){
    
    var response={};
    //console.log(req.params.id);
    User.findById(req.params.id,function(err,data){
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
    User.remove({_id:req.params.id},function(err,data){
        if (err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else{
            response = {"error" : false,"message" : "Deleted Successfully"};
        };
        res.json(response);
    }); 
});


router.post('/forget-password', function(req,res,next){
    var response={};
    User.find({email:req.body.email},function(err,data){
        if (err) {
            req.flash('error', 'something went wrong!');            
        } else{
            if (data.length>0) {
                var name = 'Admin'+" <"+data[0].email+" >";
                var content = "Password reset Link <a href='http://18.221.47.77:3005/admin/reset-password/"+data[0]._id+"'>Click Here</a>"
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


module.exports = router;