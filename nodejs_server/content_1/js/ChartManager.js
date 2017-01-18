define([], function () {
    return {
        chartContainer: {
            id:"",
            dps: [],
            instance:{},
            chartModel: function () {
                self = this;
                return new CanvasJS.Chart(self.id, {
                    title: {
                        text: "Live Random Data"
                    },
                    data: [{
                        type: "line",
                        dataPoints: self.dps
                    }]
                })
            },
            initialize: function (id) {
                if(this.instance != null){
                this.instance = this.chartModel();
                this.id = id;
                }
            },
            push: function (e1,e2) {
                var dataLength = 500; // number of dataPoints visible at any point

                this.dps.push({
                    x: e1,
                    y: e2
                });
                if (this.dps.length > dataLength) {
                    this.dps.shift();
                }
                console.log(this.dps);
                console.log(this.instance);
                this.instance.render();
                
            }

        }
    }
});