const router=require("express").Router();
const usermodel=require("../models/usermodel")
const usercontroller=require("../controller/user.controller")
const jwtmiddleware=require("../middleware/user.middleware")



router.get('/',usercontroller.GetuserDetails)
router.get('/:id',usercontroller.getUserById) 
router.post('/login',usercontroller.login)
router.post('/register',usercontroller.addUser)
router.post('/register-admin',usercontroller.addadmin)

router.post('/send-email',usercontroller.sendEmail)

router.post('/reset-password',usercontroller.resetpassword)



 
 

  


                                                                    









module.exports=router;
