define(['IDManager', 'compcode'], function (IDManager, compcode) {
    return {
        makeStream(graph) {
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
            var allInConnectedElementList = [];
            //flowのdispose()
            Object.keys(allInConnectedElementList).forEach(function (elementID) {
                if (typeof allInConnectedElementList[elementID] === 'function') {
                    allInConnectedElementList[elementID]();
                    console.log("delete: " + elementID);
                }
            });
            allInConnectedElementList = [];
            var allInConnectedElementPromiseArray = [];
            //ソースをallInConnectedElementListに入れる
            uncheckedElementList.forEach(function (element) {
                //源流のとき
                if (typeof element.ports.in === "undefined" && graph.getConnectedLinks(element).length != 0) {
                    console.log(element);
                    if (element.attributes.attrs.asynchronous) {
                        allInConnectedElementPromiseArray.push(compcode[IDManager.getGroupID(element.id)]().then(function (value) {
                            allInConnectedElementList[element.id] = value;
                        })
                        );
                    } else {
                        allInConnectedElementList[element.id] = compcode[IDManager.getGroupID(element.id)]();
                    }
                    //それ以外
                } else {
                    unconnectedElementQueue.enqueue(element);
                }


            });
            Promise.all(allInConnectedElementPromiseArray).then(function () {
                var element;
                while (element = unconnectedElementQueue.dequeue()) {
                    var links = graph.getConnectedLinks(element, linkInOpt);
                    //inで接続されている数がひとつの場合
                    if (links.length == 1) {
                        var connectedElement = false;
                        links.forEach(function (link) {
                            Object.keys(allInConnectedElementList).forEach(function (elementID) {
                                if (link.getSourceElement().id == elementID) {
                                    if (typeof element.ports.out === "undefined") {
                                        console.log(allInConnectedElementList[elementID]);
                                        allInConnectedElementList[element.id] = allInConnectedElementList[elementID].onValue(compcode[IDManager.getGroupID(element.id)]);
                                        connectedElement = true;
                                        console.log(elementID + "--->" + element.id);
                                    } else {
                                        console.log(allInConnectedElementList[elementID]);
                                        allInConnectedElementList[element.id] = allInConnectedElementList[elementID].map(compcode[IDManager.getGroupID(element.id)]);
                                        connectedElement = true;
                                        console.log(elementID + "--->" + element.id);
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
                            Object.keys(allInConnectedElementList).forEach(function (elementID) {
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
                            links.forEach(function (link) {
                                Object.keys(allInConnectedElementList).forEach(function (elementID) {
                                    if (link.getSourceElement().id == elementID) {
                                        if (mergeFlow == null) {
                                            mergeFlow = allInConnectedElementList[elementID];
                                            console.log("merge: " + elementID)
                                        } else {
                                            if (!element.attributes.attrs.combine) {
                                                mergeFlow = mergeFlow.merge(allInConnectedElementList[elementID]);
                                                console.log("merge: " + elementID)
                                            } else {
                                                mergeFlow = mergeFlow.combine(allInConnectedElementList[elementID], compcode[IDManager.getGroupID(element.id)]);
                                                console.log("combine: " + elementID)
                                            }
                                        }
                                    }
                                });
                            });
                            if (typeof element.ports.out === "undefined") {
                                allInConnectedElementList[element.id] = mergeFlow.onValue(compcode[IDManager.getGroupID(element.id)]);
                                console.log("merged flow" + "--->" + element.id);
                            } else {
                                allInConnectedElementList[element.id] = mergeFlow.map(compcode[IDManager.getGroupID(element.id)]);
                                console.log("merged flow" + "--->" + element.id);
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