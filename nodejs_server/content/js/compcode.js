define(function (ChartManager) {
    return {
        delay: function () {
            return 10000;
        },
        slidingWindow: function () {
            return 10;
        },
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
        random: function () {
            var randomfunction = function () {
                console.log("through random");
                var e = {};
                e.x = undefined;
                e.y = Math.random() * 100;
                return e;
            }
            return Bacon.interval(500, 1).map(randomfunction());
        },
        date: function () {
            var newDate = function () {
                var e = {};
                e.x = new Date();
                e.y = undefined;
                return e;
            }
            return Bacon.interval(500, 1).map(newDate).toProperty().changes();
        },
        multi: function (msg) {
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
            }).toProperty(0).sample(500);
        },
        gps: function () {
            var msg = {};
            msg.payload = {};
            console.log("through gps");
            var bus = new Bacon.Bus();
            navigator.geolocation.watchPosition(position => {
                console.log("get geolocation data");
                console.log(position);
                $("#noisemap-position").empty();
                $("#noisemap-position").prepend("<p>lat:" + position.coords.latitude + "</p>");
                $("#noisemap-position").prepend("<p>lon:" + position.coords.longitude + "</p>");
                msg.payload.position = position;
                bus.push(msg);
            });
            return bus.toProperty(0).sample(2000);
        },
        soundmeter: function () {
            var audioContext = new AudioContext();
            var bufferSize = 4096;
            var cnt = 0;
            var onAudioProcess = function (e) {
                //. 取得した音声データ
                var input = e.inputBuffer.getChannelData(0);
               var mx = Math.max.apply(null,input);

                var msg = {};
                msg.payload = {};
                msg.payload.db = 20 * Math.log(mx / 0.00002);
                return msg;
            }
            console.log("through soundmeter");
            return navigator.mediaDevices.getUserMedia(
                { audio: true }).then(stream => {
                    //. 音声処理
                    var javascriptnode = audioContext.createScriptProcessor(bufferSize, 1, 1);
                    var mediastreamsource = audioContext.createMediaStreamSource(stream);
                    window.dotnsf_hack_for_mozzila = mediastreamsource;  //. https://support.mozilla.org/en-US/questions/984179
                    mediastreamsource.connect(javascriptnode);
                    javascriptnode.connect(audioContext.destination);
                    return Bacon.fromEventTarget(javascriptnode, 'audioprocess').map(onAudioProcess).toProperty(0).sample(2000);
                })
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
        chartContainer: function (msg) {
            require(['ChartManager'], function (ChartManager) {

                var id = "chartContainer-graph-1";
                ChartManager.chartContainer.initialize(id);
                ChartManager.chartContainer.push(msg.payload.graph.x, msg.payload.graph.y);
            });
        },
        noisetuberegist: function (msg) {

            var apikey = "99cc75a0920d4420898905b6e9a14bb86ffe9a09";
            var newSessionURL = "http://www.noisetube.net/api/newsession?key=" + apikey;
            var updateURL = "http://www.noisetube.net/api/update?key=" + apikey + "&l=geo:" + msg.payload.position.coords.latitude + "," + msg.payload.position.coords.longitude + "&db=" + msg.payload.db;
            var endSessionURL = "http://www.noisetube.net/api/endsesssion?key=" + apikey;
            $.get(newSessionURL, function (data) { console.log(data) }).then(data => {
                console.log("newSession");
                console.log(data);
                $.get(updateURL).then(response => {
                    console.log("updateSession");
                    console.log(response);
                    $.get(endSessionURL).then(response => {
                        console.log("endSession");
                        console.log(response);
                    })
                })
            })

        },
        noisetubeget: function (msg) {
            var onLoaded = function (e) {
                console.log(e);
            }
            var apikey = "99cc75a0920d4420898905b6e9a14bb86ffe9a09";
            //var searchURL = "http://www.noisetube.net/api/search.json?key=" + apikey + "&box=" + msg.payload.position.box.lat1 + "," + msg.payload.position.box.lng1 + "," + msg.payload.position.box.lat2 + "," + msg.payload.position.box.lng2;
            var searchURL = "noisetube/noiseinfo.json";
            console.log(searchURL);
            return Bacon.fromPromise($.get(searchURL).then(data => { msg.payload.position.boxnoise = data; return msg }));

            /*
            fetch(searchURL, { mode: 'no-cors' }).then(response => {
                msg.payload.boxnoise = response;
                console.log("get noise infomation");
                console.log(msg);
                return msg;
            })
            */
        },
        noisemaprealtime: function (msg) {
            require(['GoogleMapManager'], function (GoogleMapManager) {
                console.log(msg);
                var id = "noisemap-google-realtime";

                GoogleMapManager.noisemap.initialize(id);
                GoogleMapManager.noisemap.push(id, msg.payload.position, msg.payload.db);
            });
        },
        noisemappast: function (msg) {
            require(['GoogleMapManager'], function (GoogleMapManager) {
                console.log(msg);
                var id = "noisemap-google-past";
                console.log(GoogleMapManager);
                GoogleMapManager.noisemap.initialize(id);
                msg.payload.position.boxnoise.forEach(function (boxnoise) {
                    var position = {};
                    position.coords = {};
                    position.coords.latitude = boxnoise.lat;
                    position.coords.longitude = boxnoise.lng;
                    GoogleMapManager.noisemap.push(id, position, msg.payload.db);
                }, this);
            });
        },
        zipwith: function (msg) {
            console.log(msg);
            return msg;
        },
        boxRangePosition: function (msg) {
            var lat1 = msg.payload.position.coords.latitude;
            var lng1 = msg.payload.position.coords.longitude;
            msg.payload.position.box = {};
            msg.payload.position.box.lat1 = lat1;
            msg.payload.position.box.lat2 = lat1 + 0.0000001;
            msg.payload.position.box.lng1 = lng1;
            msg.payload.position.box.lng2 = lng1 + 0.0000001;

            return msg
        },
        noisePastInformationDisplay: function (msg) {
            console.log("oisePastInformationDisplay");
            console.log(msg);
            //$("#noisemap-past-information").empty();
            $("#noisemap-past-information").append(
                "<tr>" +
                "<td>lat:" + msg.payload.position.coords.latitude + "---</td>" +
                "<td>lng:" + msg.payload.position.coords.longitude + "---</td>" +
                "<td>db:" + msg.payload.db + "</td>" +
                "<tr>");
            if ($("#noisemap-past-information").children().length > 20) {
                $("#noisemap-past-information").children()[0].remove();
                $("#noisemap-past-information").children()[0].remove();
            }
            console.log($("#noisemap-past-information").children());
        },
        averageNoise: function (msgs) {
            var average = function (array) {
                var sum = 0;
                $.each(array, function(){
                    console.log(this);
                    sum += this.payload.db;
                });
                return sum/array.length;
            }
            $("#noise-average").empty();
            $("#noise-average").append("<p>" + average(msgs) + "</p>");
        },
    }
});
