const router=require("express").Router();
const usermodel=require("../models/usermodel")
const usercontroller=require("../controller/user.controller")
// const {verifyuser ,verifyAdmin}=require("../middleware/verifyToen")     // cookies jwt
const {verifyuser ,verifyAdmin}=require("../middleware/user.middleware")   //payload jwt




router.get('/',verifyAdmin,usercontroller.GetuserDetails)
router.get('/:id',verifyuser,usercontroller.getUserById)



 module.exports=router;
