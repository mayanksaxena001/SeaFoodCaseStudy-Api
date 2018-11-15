var {
  _stateContract
} = require('./StateContractController');
var _contract = _stateContract;
module.exports = {

  default_req(req, res, callback) {
    console.log('default gateway | Default : ', req.method, req.url);
    callback();
  },

  validation_req(req, res, callback, id) {
    req.id = id;
    console.log('Doing  validations on ' + id);
    callback();
  },

  async addSensor(req, res) {
    try {
      res.status(200).send({
        "Added": await _contract.addSensor(req._name)
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async updateSensor(req, res) {
    var _sensorId = req.body._sensorId;
    var _latitude = req.body._latitude;
    var _longitude = req.body._longitude;
    var _location = req.body._location;
    var _temp = req.body._temp;
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
    try {
      var _count = await _contract.getSensorTelemetryCount(_sensorId);
      var markers = [];
      for (var i = 0; i < _count; i++) {
        var _value = await _contract.getSensorTelemetry(_sensorId, i);
        markers.push({
          "title": _value[4],
          "lat": parseFloat(_value[2]),
          "lng": parseFloat(_value[3])
        });
        // markers.push(jsonArg);
      }
      res.render('mapview', {
        title: markers[_count - 1].title,
        lat: markers[_count - 1].lat,
        lng: markers[_count - 1].lng,
        data: markers,
      });
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
        _info.push({
          Telemetry: _value
        });
      }
      res.status(200).send({
        Info: _info
      });;
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