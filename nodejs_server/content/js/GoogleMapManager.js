define([], function () {
    return {
        noisemap:{
            id: "",
            dps: [],
            instance: {},
            map: function (id) {
                self = this;
                return new google.maps.Map(document.getElementById(id), {
                    zoom: 13,
                    center: { lat: 37.090, lng: -95.712 },
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                });
            },
            initialize: function (id) {
                console.log(this.instance);
                if (!this.instance[id]) {
                    console.log("initialize google map");
                    this.instance[id] = {};
                    this.instance[id] = this.map(id);
                }
            },
            push: function (id,position, noise) {
                console.log("noise:"+noise);
                var self=this;
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                    $("#noisemap-position-plot").empty();
                    $("#noisemap-position-plot").prepend("<p>plot-lat:" + position.coords.latitude + "</p>");
                    $("#noisemap-position-plot").prepend("<p>plot-lon:" + position.coords.longitude + "</p>");
                //8bit*noise
                var colorNum = Math.floor((255)*noise);
                if(colorNum>255)colorNum=255;
                new google.maps.Circle({
                    strokeColor: "#"+(-colorNum+255).toString(16)+"ffff",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#"+(-colorNum+255).toString(16)+"ffff",
                    fillOpacity: 0.35,
                    map: self.instance[id],
                    center: pos,
                    radius: 1
                });
                this.instance[id].panTo(pos);

            }

    }
    }
});