var {
  _stateContract
} = require('../controllers/StateContractController');
var _contract = _stateContract;
module.exports = {

  async updateSensor(req, res) {
    var _sensorId = req.body.sensorId;
    var _latitude = req.body.latitude;
    var _longitude = req.body.longitude;
    var _location = req.body.location;
    var _temp = req.body.temp;
    try {
      res.status(200).send({
        "telemetry": await _contract.updateSensor(_sensorId, _latitude, _longitude, _location, _temp)
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async getAllSensors(req, res) {
    try {
      res.status(200).send({
        "Sensors": await _contract.getAllSensors()
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async getSensorInfo(req, res) {
    var _sensorId = req.id;
    var _count = await _contract.getSensorTelemetryCount(_sensorId);
    var markers = [];
    try {
      for (var i = 0; i < _count; i++) {
        var _value = await _contract.getSensorTelemetry(_sensorId, i);
        var jsonArg = {
          "title": _value[4],
          "lat": parseFloat(_value[2]),
          "lng": parseFloat(_value[3])
        };
        markers.push(jsonArg);
      }
      res.render('mapview', {
        title: markers[_count - 1].title,
        lat: markers[_count - 1].lat,
        lng: markers[_count - 1].lng,
        data: markers
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  // address _address
  async getStateInfo(req, res) {
    try {
      var _transactInfo = await _contract.getTransactionInfo(req.id);

      return res.status(200).send(_transactInfo);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async getSensorTelemetryDetails(req, res) {
    var _sensorId = req.id;
    var _count = await _contract.getSensorTelemetryCount(_sensorId);
    var _info = [];
    try {
      for (var i = 0; i < _count; i++) {
        var _value = await _contract.getSensorTelemetry(_sensorId, i);
        _info.push(_value);
      }
      res.status(200).send(_info);;
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async getTelemetry(req, res) {
    var _telId = req.id;
    var markers = [];
    try {
      var _value = await _contract.getTelemetryInfo(_telId);
      markers.push({
        "title": _value[4],
        "lat": parseFloat(_value[2]),
        "lng": parseFloat(_value[3])
      });
      res.render('mapview', {
        title: _value[4],
        lat: parseFloat(_value[2]),
        lng: parseFloat(_value[3]),
        data: markers,
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  }

}