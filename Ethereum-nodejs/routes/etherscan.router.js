var EtherScanApi = require('../api/EtherScanApi');
var express = require('express');
const router = express.Router();
// router.use('/', auth.default_req);
router.param('id', EtherScanApi.validation_req);


router.get('/block/:id', EtherScanApi.getBlockDetails);
router.get('/balance/:id', EtherScanApi.getEtherBalance);
router.get('/balance/multi/:id', EtherScanApi.getMultipleEtherBalance);
router.get('/ether/totalsupply', EtherScanApi.getTotalEtherSupply);
router.get('/ether/lastprice', EtherScanApi.getEtherLastPrice);
router.get('/ether/nodesize', EtherScanApi.getEtherNodeSize);
router.get('/transactions/status/:id', EtherScanApi.getEthereumAddressTransactionStatus);
router.get('/transactions/receipt/status/:id', EtherScanApi.getEthereumAddressTransactionReceiptStatus);
module.exports = router;