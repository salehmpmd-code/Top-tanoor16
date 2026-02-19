
const router=require('express').Router();
const Setting=require('../models/Setting');
const auth=require('../middleware/auth');

router.get('/',async(req,res)=>{
 let s=await Setting.findOne();
 if(!s){ s=await Setting.create({heroImages:[],siteTitle:"",aboutText:""}); }
 res.json(s);
});

router.put('/',auth,async(req,res)=>{
 const s=await Setting.findOneAndUpdate({},req.body,{new:true,upsert:true});
 res.json(s);
});

module.exports=router;
