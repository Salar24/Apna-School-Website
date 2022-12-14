const express = require('express');
const router = express.Router();

const certificateController = require('../controllers/certificate-controller');



//get a admin by username
router.get('/generate/:name', certificateController.genCert)

router.patch('/getResult/:rollNumber', certificateController.genResult)
router.patch('/getIDCard/:rollNumber', certificateController.genIDCard)

router.patch('/genFeeForClass/:classYear', certificateController.genFeeForClass)

router.patch('/getDatesheet/:rollNumber', certificateController.genDatesheet)


router.patch('/getFeeChallan/:rollNumber', certificateController.genFeeChallan)

router.patch('/genFeeForClass/:classYear', certificateController.genFeeForClass)

module.exports = router;
