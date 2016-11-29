define([], function () {
    return {
        noisemap: {
            id: "",
            dps: [],
            instance: {},
            map: function () {
                self = this;
                return new google.maps.Map(document.getElementById(self.id), {
                    zoom: 13,
                    center: { lat: 37.090, lng: -95.712 },
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                });
            },
            initialize: function (id) {
                console.log(this.instance);
                if (!this.instance.data) {
                    console.log("initialize google map")
                    this.id = id;
                    this.instance = this.map();
                }
            },
            push: function (position, noise) {
                var self=this;
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                    $("#noisemap-position-plot").empty();
                    $("#noisemap-position-plot").prepend("<p>plot-lat:" + position.coords.latitude + "</p>");
                    $("#noisemap-position-plot").prepend("<p>plot-lon:" + position.coords.longitude + "</p>");
                //24bit/2
                var colorNum = Math.floor((16777216/2)*noise);
                new google.maps.Circle({
                    strokeColor: "#"+colorNum.toString(16),
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#"+colorNum.toString(16),
                    fillOpacity: 0.35,
                    map: self.instance,
                    center: pos,
                    radius: 1
                });
                this.instance.panTo(pos);

            }

        }
    }
});