
const router=require('express').Router();
const Item=require('../models/Item');
const auth=require('../middleware/auth');

router.get('/',async(req,res)=>{
 const items=await Item.find().populate('section');
 res.json(items);
});

router.post('/',auth,async(req,res)=>{
 const item=new Item(req.body);
 await item.save();
 res.json(item);
});

router.put('/:id',auth,async(req,res)=>{
 const updated=await Item.findByIdAndUpdate(req.params.id,req.body,{new:true});
 res.json(updated);
});

router.delete('/:id',auth,async(req,res)=>{
 await Item.findByIdAndDelete(req.params.id);
 res.json({msg:"deleted"});
});

module.exports=router;
