var axios = require('axios');
var sensorId = '0x453e6570153713e95d693eb315742fa1920504c591443aaf30016c40c34b81b4';
var api = 'http://localhost:8080';

module.exports = class DefaultController {
    constructor() {}

    default_req(req, res, callback) {
        console.log('default gateway | Default : ', req.method, req.url);
        callback();
    }

    validation_req(req, res, callback, id) {
        req.id = id;
        console.log('Doing  validations on ' + id);
        callback();
    }

    get_req(req, res) {
        res.status(401).send("Unauthorized!!!");
    }

    post_req(req, res) {
        res.status(401).send("Unauthorized!!!");
    }

    getById(req, res) {
        var _sensorId = req.id;
        axios.get(api + '/sensor/' + sensorId).then(val => {
            return res.status(200).send(val);
        }).catch(err => {
            return res.status(500).send(err);
        })
        //..TODO
    }

    updateSensor(req, res) {
        var _sensorId = req.body._sensorId;
        var _latitude = req.body._latitude;
        var _longitude = req.body._longitude;
        var _location = req.body._location;
        var _temp = req.body._temp;
        var content = {
            _sensorId: _sensorId,
            _latitude: _latitude,
            _longitude: _longitude,
            _location: _location,
            _temp: _temp
        };
        axios.put(api + '/sensor/', content).then(val => {
            console.log(val);
            res.status(200).send();
        }).catch(err => {
            console.log(err);
        })
        //..TODO

    }
}