var AssetTransferApi = require('../api/AssetTransferApi');
var auth = require('../controllers/AuthController');
var express = require('express');
const router = express.Router();
router.use('/', auth.checkToken, auth.isWeb3NodeConnected);
router.param('id', AssetTransferApi.validation_req);

// router.get('/user/:id', SeaFoodContractApi.get_user);
// router.post('/user',ContractApi.add_user)

router.get('/accounts', AssetTransferApi.getAccounts);

router.post('/asset',  AssetTransferApi.createAsset);
router.put('/asset', AssetTransferApi.editAsset);
router.get('/asset/:id', AssetTransferApi.getAssetById);
router.get('/assets', AssetTransferApi.getUserAssets);
router.get('/assets/transfer', AssetTransferApi.getTransferableAssets);
router.post('/asset/transfer', AssetTransferApi.transferAsset);

router.get('/suppliers', AssetTransferApi.getSuppliers);
router.get('/supplier/alert', AssetTransferApi.getSupplierAlerts);

router.get('/transactions', AssetTransferApi.getUserTransactions);
router.get('/transaction/:id', AssetTransferApi.getTransactionById);
router.put('/transaction/accept', AssetTransferApi.UpdateTransactionAccepted);
router.put('/transaction/picked', AssetTransferApi.UpdateTransactionPickUp);
router.put('/transaction/complete', AssetTransferApi.UpdateTransactionCompleted);
router.put('/transaction/cancel', AssetTransferApi.cancelTransaction);

router.post('/token/request', AssetTransferApi.requestTokens);
router.post('/token/transfer', AssetTransferApi.transferTokens);

module.exports = router;