
const router=require('express').Router();
const jwt=require('jsonwebtoken');

// simple static admin login
router.post('/login',(req,res)=>{
 const {username,password}=req.body;
 if(username==='admin' && password==='1234'){
   const token=jwt.sign({role:'admin'},process.env.JWT_SECRET);
   return res.json({token});
 }
 res.status(401).json({msg:'Invalid'});
});

module.exports=router;
