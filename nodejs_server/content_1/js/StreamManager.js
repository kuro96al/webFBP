define(["BasicStreamFunction"], function (BasicStreamFunction) {
    return {
        allInConnectedElementList: [],
        makeStream: function (graph, compcode) {
            var self = this;
            //queue
            function Queue() {
                this.__a = new Array();
            }

            Queue.prototype.enqueue = function (o) {
                this.__a.push(o);
            }

            Queue.prototype.dequeue = function () {
                if (this.__a.length > 0) {
                    return this.__a.shift();
                }
                return null;
            }

            Queue.prototype.size = function () {
                return this.__a.length;
            }

            Queue.prototype.toString = function () {
                return '[' + this.__a.join(',') + ']';
            }
            var linkInOpt = [];
            var linkOutOpt = [];
            linkInOpt.inbound = true;
            linkOutOpt.outbound = true;
            //inが接続されていないoutのlinkの削除
            var allElement = graph.getElements();
            var delLinkFin;
            do {
                delLinkFin = true;
                allElement.forEach(function (element) {
                    if (typeof element.ports.in !== "undefined" && graph.getConnectedLinks(element, linkInOpt).length == 0 && graph.getConnectedLinks(element, linkOutOpt).length != 0) {
                        graph.removeLinks(element);
                        console.log("removed links!!");
                        delLinkFin = false;
                    }
                });
            } while (!delLinkFin)

            //outが接続されていないinのlinkの削除
            do {
                delLinkFin = true;
                allElement.forEach(function (element) {
                    if (typeof element.ports.out !== "undefined" && graph.getConnectedLinks(element, linkInOpt).length != 0 && graph.getConnectedLinks(element, linkOutOpt).length == 0) {
                        graph.removeLinks(element);
                        console.log("removed links!!");
                        delLinkFin = false;
                    }
                });
            } while (!delLinkFin)


            var unconnectedElementQueue = new Queue();
            var uncheckedElementList = graph.getElements();
            //flowのdispose()
            Object.keys(self.allInConnectedElementList).forEach(function (elementID) {
                if (typeof self.allInConnectedElementList[elementID] === 'function') {
                    self.allInConnectedElementList[elementID]();
                    console.log("delete: " + elementID);
                }
            });
            self.allInConnectedElementList = [];
            var allInConnectedElementPromiseArray = [];
            //ソースをself.allInConnectedElementListに入れる
            uncheckedElementList.forEach(function (element) {
                //源流のとき
                if (typeof element.ports.in === "undefined" && graph.getConnectedLinks(element).length != 0) {
                    console.log(element);
                    if (element.attributes.attrs.asynchronous) {
                        allInConnectedElementPromiseArray.push(compcode[element.id]().then(function (value) {
                            self.allInConnectedElementList[element.id] = value;
                        })
                        );
                    } else {
                        self.allInConnectedElementList[element.id] = compcode[element.id]();
                    }
                    //それ以外
                } else {
                    unconnectedElementQueue.enqueue(element);
                }


            });
            Promise.all(allInConnectedElementPromiseArray).then(function () {
                var element;
                while (element = unconnectedElementQueue.dequeue()) {
                    console.log(element.id);
                    var links = graph.getConnectedLinks(element, linkInOpt);
                    //inで接続されている数がひとつの場合
                    if (links.length == 1) {
                        var connectedElement = false;
                        links.forEach(function (link) {
                            Object.keys(self.allInConnectedElementList).forEach(function (elementID) {
                                if (link.getSourceElement().id == elementID) {
                                    connectedElement = true;
                                    if (typeof element.ports.out === "undefined") {
                                        console.log(elementID);
                                        self.allInConnectedElementList[element.id] = self.allInConnectedElementList[elementID].onValue(compcode[element.id]);
                                        console.log(elementID + "--->" + element.id);
                                    } else {
                                        if (element.attributes.attrs.throttle) {
                                            self.allInConnectedElementList[element.id] = self.allInConnectedElementList[elementID].throttle(compcode[element.id]());
                                            console.log(elementID + "--->" + element.id);
                                        } else if (element.attributes.attrs.bufferWithCount) {
                                            self.allInConnectedElementList[element.id] = self.allInConnectedElementList[elementID].slidingWindow(compcode[element.id](),compcode[element.id]());
                                            console.log(elementID + "--->" + element.id);
                                        } else {
                                            if (!element.attributes.attrs.asynchronous) {
                                                console.log(elementID);
                                                self.allInConnectedElementList[element.id] = self.allInConnectedElementList[elementID].map(compcode[element.id]);
                                                console.log(elementID + "--->" + element.id);
                                            } else {
                                                self.allInConnectedElementList[element.id] = self.allInConnectedElementList[elementID].flatMap(compcode[element.id]);
                                            }
                                        }
                                    }
                                }
                            });
                        });
                        if (!connectedElement) {
                            unconnectedElementQueue.enqueue(element);
                        }

                        //inで接続されている数が複数の場合
                    } else if (links.length > 1) {
                        var connectPermission = false;
                        var connectCounter = 0;
                        links.forEach(function (link) {
                            Object.keys(self.allInConnectedElementList).forEach(function (elementID) {
                                if (link.getSourceElement().id == elementID) {
                                    connectCounter++;
                                }
                            });
                            if (connectCounter == links.length) {
                                connectPermission = true;
                            }
                        });

                        //merge可能
                        if (connectPermission) {
                            var mergeFlow = null;
                            var combineArray = [];
                            links.forEach(function (link) {
                                Object.keys(self.allInConnectedElementList).forEach(function (elementID) {
                                    if (link.getSourceElement().id == elementID) {
                                        if (mergeFlow == null) {
                                            if (!element.attributes.attrs.combine) {
                                                mergeFlow = self.allInConnectedElementList[elementID];
                                                console.log("create mergeFlow: " + elementID);
                                            } else {
                                                combineArray.push(self.allInConnectedElementList[elementID]);
                                                console.log("create combineArray: " + elementID);
                                            }
                                        } else {
                                            if (!element.attributes.attrs.combine) {
                                                mergeFlow = mergeFlow.merge(self.allInConnectedElementList[elementID]);
                                                console.log("merge: " + elementID)
                                            } else {
                                                combineArray.push(self.allInConnectedElementList[elementID]);
                                                //mergeFlow = mergeFlow.zip(self.allInConnectedElementList[elementID], compcode[element.id]);
                                                console.log("combine: " + elementID);
                                            }
                                        }
                                    }
                                });
                            });
                            if (typeof element.ports.out === "undefined") {
                                if (!element.attributes.attrs.combine) {
                                    self.allInConnectedElementList[element.id] = mergeFlow.onValue(compcode[element.id]);
                                    console.log("merged flow" + "--->" + element.id);
                                } else {
                                    console.log("combine" + combineArray.length);
                                    console.log(compcode["combine" + combineArray.length]);
                                    console.log(BasicStreamFunction);
                                    self.allInConnectedElementList[element.id] = Bacon.zipWith(combineArray, BasicStreamFunction["combine" + combineArray.length]).onValue(compcode[element.id]);
                                    console.log("combined flow" + "--->" + element.id);
                                }

                            } else {
                                if (!element.attributes.attrs.combine) {
                                    if (element.attributes.attrs.throttle) {
                                        self.allInConnectedElementList[element.id] = mergeFlow.throttle(compcode[element.id]());
                                        console.log("merge throttle flow" + "--->" + element.id);
                                    } else if (element.attributes.attrs.bufferWithCount) {
                                        self.allInConnectedElementList[element.id] = mergeFlow.slidingWindow(compcode[element.id](),compcode[element.id]());
                                        console.log("merge bufferWithCount flow" + "--->" + element.id);
                                    } else {
                                        self.allInConnectedElementList[element.id] = mergeFlow.map(compcode[element.id]);
                                        console.log("merged flow" + "--->" + element.id);
                                    }
                                } else {
                                    if (element.attributes.attrs.throttle) {
                                        self.allInConnectedElementList[element.id] = Bacon.zipWith(combineArray, BasicStreamFunction["combine" + combineArray.length]).throttle(compcode[element.id]());
                                        console.log("combine throttle flow" + "--->" + element.id);
                                    } else if (element.attributes.attrs.bufferWithCount) {
                                        self.allInConnectedElementList[element.id] = Bacon.zipWith(combineArray, BasicStreamFunction["combine" + combineArray.length]).slidingWindow(compcode[element.id](),compcode[element.id]());
                                        console.log("combine bufferWithCount flow" + "--->" + element.id);
                                    } else {
                                        console.log("combine" + combineArray.length);
                                        self.allInConnectedElementList[element.id] = Bacon.zipWith(combineArray, BasicStreamFunction["combine" + combineArray.length]).map(compcode[element.id]);
                                        console.log("combined flow" + "--->" + element.id);
                                    }
                                }
                            }
                        } else {
                            unconnectedElementQueue.enqueue(element);
                        }
                    }
                }
            });
        }
    }
})