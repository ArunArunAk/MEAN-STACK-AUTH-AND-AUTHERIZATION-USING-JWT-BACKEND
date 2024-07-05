const router = require("express").Router();
const Role = require("../models/role.model");
const rolecontroller=require("../controller/role.controller")

router.post('/create',rolecontroller.createRole );

router.get('/getAll',rolecontroller.getAllRoles );


router.delete('/deleteRole/:id',rolecontroller.deleteRole );


router.put('/update/:id',rolecontroller.updateRole );

module.exports = router;
