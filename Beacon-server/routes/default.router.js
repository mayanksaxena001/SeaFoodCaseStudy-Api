var StateContractApi = require('../controllers/StateContractApi');
var express = require('express');
// default gateways
var router = express.Router();
router.use('/', StateContractApi.default_req);
router.param('id', StateContractApi.validation_req);

// router.route('/')
//     .get(controller.get_req)
//     .post(controller.post_req);
router.get('/:id', StateContractApi.getSensorInfo);
router.put('/', StateContractApi.updateSensor);
router.get('/all', StateContractApi.getAllSensors);
router.post('/', StateContractApi.addSensor);
module.exports = router;