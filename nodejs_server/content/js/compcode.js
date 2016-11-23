define(['ChartManager'], function (ChartManager) {
    return {
        up: function () {
            var upfunction = function () {
                var sum = Number($("#counter").text()) + 1;
                $('#counter').text(sum);
                // 出力テスト
                console.log("through up");
                var e = {};
                e.x = undefined;
                e.y = sum;
                return e;
            }
            return Bacon.interval(3000, 1).map(upfunction).toProperty().changes();
        },
        down: function () {
            var downfunction = function () {
                var sum = Number($("#counter").text()) - 1;
                $('#counter').text(sum);
                console.log("through down");
                var e = {};
                e.x = undefined;
                e.y = sum;
                return e;
            }
            return Bacon.interval(1000, 1).map(downfunction).toProperty().changes();
        },
        date: function () {
            var newDate = function () {
                var e = {};
                e.x = new Date();
                e.y = undefined;
                return e;
            }
            return Bacon.interval(1000, 1).map(newDate).toProperty().changes();
        },
        multi: function (num) {
            console.log("through multi");
            return 2;
        },
        display: function (msg) {
            console.log("through display");
            console.log($("#counter").text());
            var sum = Number($("#counter").text()) + num;
            $('#counter').text(sum);
            return 0;
        },
        phoneAccel: function () {
            console.log("through phoneAccel");
            return Bacon.fromEventTarget(window, "devicemotion").map(function (e) {
                var accel = {};
                accel.y = e.acceleration.x;
                accel.x = undefined;
                 return accel; 
                });
        },
        accel: function () {
            console.log("through accel");
            console.log("through accel fromCallback");
            var stream;
            var myCharacteristic;
            // UUIDs
            var accelerometerServiceUUID = 'f000aa80-0451-4000-b000-000000000000';
            var accelerometerDataUUID = 'f000aa81-0451-4000-b000-000000000000';
            var accelerometerConfigUUID = 'f000aa82-0451-4000-b000-000000000000';
            var accelerometerPeriodUUID = 'f000aa83-0451-4000-b000-000000000000';

            // turn accelerometer on
            var configData = new Uint16Array(1);
            //Turn on accel, 2G range, Disable wake on motion
            configData[0] = 0x007F;


            var periodData = new Uint8Array(1);
            periodData[0] = 0x64;
            // Variables.
            var gattServer;
            var accelerometerService;
            var accelerometer;

            function showInfo(info) {
                console.log(info);
            }

            function getAccelerometerValues(data) {
                console.log(data);
                var a = new Int16Array(data.buffer);
                console.log(a);
                // Calculate accelerometer values.
                var ax = sensorMpu9250AccConvert(a[3]);
                var ay = sensorMpu9250AccConvert(a[4]);
                var az = sensorMpu9250AccConvert(a[5]);

                return { x: ax, y: ay, z: az };
            }

            function sensorMpu9250AccConvert(data) {
                // Change  /2 to match accel range...i.e. 16 g would be /16
                return data / (32768 / 2);
            }
            var onAccelerometerChanged = function (event) {
                var characteristic = event.target;
                var values = getAccelerometerValues(characteristic.value);
                console.log(characteristic);
                showInfo('x: ' + values.x + ' y: ' + values.y + ' z: ' + values.z);
                return values.x;
            }

            console.log("pushed scan");
            return navigator.bluetooth.requestDevice({
                filters: [{
                    namePrefix: "CC2650 SensorTag"
                }],
                optionalServices: [accelerometerServiceUUID]
            })
                .then(device => {
                    console.log('Found device: ' + device.name);
                    console.log("detail device:" + device);
                    return device.gatt.connect();
                })
                .then(server => {
                    gattServer = server;
                    console.log('SensorTag connected: ' + gattServer.connected);
                    return gattServer.getPrimaryService(accelerometerServiceUUID);
                })
                .then(service => {
                    // Get accelerometer config characteristic.
                    accelerometerService = service
                    return accelerometerService.getCharacteristic(accelerometerConfigUUID);
                })
                .then(characteristic => {
                    // Turn accelerometer config to ON.
                    return characteristic.writeValue(configData.buffer);
                })
                .then(() => {
                    // Get period characteristic.
                    return accelerometerService.getCharacteristic(accelerometerPeriodUUID);
                })
                .then(characteristic => {
                    // Set update interval.
                    return characteristic.writeValue(periodData.buffer);
                })
                .then(() => {
                    // Get data characteristic.
                    return accelerometerService.getCharacteristic(accelerometerDataUUID);
                })
                .then(characteristic => {
                    // Start sensor notification.
                    console.log('Start notficatons')
                    myCharacteristic = characteristic;
                    characteristic.startNotifications();
                    return Bacon.fromEventTarget(myCharacteristic, 'characteristicvaluechanged').map(onAccelerometerChanged);
                })
                .catch(error => {
                    console.log('Argh! ' + error);
                });
        },
        temp: function () {
            console.log("through temp");
            var stream;
            var myCharacteristic;
            // UUIDs
            var ServiceUUID = 'f000aa40-0451-4000-b000-000000000000';
            var DataUUID = 'f000aa41-0451-4000-b000-000000000000';
            var ConfigUUID = 'f000aa42-0451-4000-b000-000000000000';
            var PeriodUUID = 'f000aa44-0451-4000-b000-000000000000';
            // turn accelerometer on
            var configData = new Uint8Array(1);
            //Turn on accel, 2G range, Disable wake on motion
            configData[0] = 0x01;


            var periodData = new Uint8Array(1);
            periodData[0] = 0x64;
            // Variables.
            var gattServer;
            var Service;

            function showInfo(info) {
                console.log(info);
            }
            function sensorBarometerConvert(data) {
                return (data / 100);

            }

            var onBarometerData = function (event) {
                var characteristic = event.target;
                var a = new Uint8Array(characteristic.value.buffer);

                //0-2 Temp
                //3-5 Pressure
                var e = {};
                e.x = undefined;
                e.y = sensorBarometerConvert(a[0] | (a[1] << 8) | (a[2] << 16));
                return e;

                //sensorBarometerConvert( a[3] | (a[4] << 8) | (a[5] << 16)) + "hPa <br/>" ;

            }


            console.log("pushed scan");
            return navigator.bluetooth.requestDevice({
                filters: [{
                    namePrefix: "CC2650 SensorTag"
                }],
                optionalServices: [ServiceUUID]
            })
                .then(device => {
                    console.log('Found device: ' + device.name);
                    console.log("detail device:" + device);
                    return device.gatt.connect();
                })
                .then(server => {
                    gattServer = server;
                    console.log('SensorTag connected: ' + gattServer.connected);
                    return gattServer.getPrimaryService(ServiceUUID);
                })
                .then(service => {
                    // Get accelerometer config characteristic.
                    Service = service
                    return Service.getCharacteristic(ConfigUUID);
                })
                .then(characteristic => {
                    // Turn accelerometer config to ON.
                    return characteristic.writeValue(configData.buffer);
                })
                .then(() => {
                    // Get data characteristic.
                    return Service.getCharacteristic(DataUUID);
                })
                .then(characteristic => {
                    // Start sensor notification.
                    console.log('Start notficatons')
                    myCharacteristic = characteristic;
                    characteristic.startNotifications();
                    return Bacon.fromEventTarget(myCharacteristic, 'characteristicvaluechanged').map(onBarometerData);
                })
                .catch(error => {
                    console.log('Argh! ' + error);
                });
        },
        chartContainer: function (e1, e2) {
            var x;
            var y;
            //if (typeof e !== "undefined") {
            if (typeof e1.x !== "undefined") {
                x = e1.x;
            } else if (typeof e1.y !== "undefined") {
                y = e1.y;
            }
            if (typeof e2.x !== "undefined") {
                x = e2.x;
            } else if (typeof e2.y !== "undefined") {
                y = e2.y;
            }
            ChartManager.chartContainer.initialize();
            ChartManager.chartContainer.push(x, y);
            //}
        },
        combine: function (e1, e2) {
            if (typeof e1 !== "undefined" && typeof e2 !== "undefined") {
                console.log(e1);
                console.log(e2);
                var msg = {};
                msg.e1 = e1;
                msg.e2 = e2;
                return msg;
            }
        },

    }

});
