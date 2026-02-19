
const router=require('express').Router();
const Section=require('../models/Section');
const auth=require('../middleware/auth');

router.get('/',async(req,res)=>{
 const data=await Section.find();
 res.json(data);
});

router.post('/',auth,async(req,res)=>{
 const s=new Section(req.body);
 await s.save();
 res.json(s);
});

router.delete('/:id',auth,async(req,res)=>{
 await Section.findByIdAndDelete(req.params.id);
 res.json({msg:"deleted"});
});

module.exports=router;
