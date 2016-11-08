
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

//joinjs

//モデルの定義
joint.shapes.devs.ComponentModel = joint.shapes.devs.Model.extend({

  markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',

  defaults: joint.util.deepSupplement({

    type: 'devs.ComponentModel',
    size: {
      width: 80,
      height: 80
    },
    attrs: {
      '.body': {
        'rx': 6,
        'ry': 6
      },
      '.label': {
        'ref-y': -20
      },
      asynchronous: false,
      rect: {
        stroke: '#d1d1d1',
        fill: {
          type: 'linearGradient',
          stops: [{
            offset: '0%',
            color: 'white'
          }, {
            offset: '50%',
            color: '#d1d1d1'
          }],
          attrs: {
            x1: '0%',
            y1: '0%',
            x2: '0%',
            y2: '100%'
          }
        }
      }
    }

  }, joint.shapes.devs.Model.prototype.defaults)
});

//htmlの拡張
joint.shapes.devs.ComponentModelView = joint.shapes.devs.ModelView.extend({

  template: [
    '<div class="html-element">',
    '<button class="delete">x</button>',
    '</div>'
  ].join(''),

  initialize: function () {
    _.bindAll(this, 'updateBox');
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);

    this.$box = $(_.template(this.template)());
    // Prevent paper from handling pointerdown.
    this.$box.find('input,select').on('mousedown click', function (evt) {
      evt.stopPropagation();
    });
    // This is an example of reacting on the input change and storing the input data in the cell model.
    this.$box.find('input').on('change', _.bind(function (evt) {
      this.model.set('input', $(evt.target).val());
    }, this));
    this.$box.find('select').on('change', _.bind(function (evt) {
      this.model.set('select', $(evt.target).val());
    }, this));
    this.$box.find('select').val(this.model.get('select'));
    this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this);
    // Remove the box when the model gets removed from the graph.
    this.model.on('remove', this.removeBox, this);

    this.updateBox();
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments);
    this.paper.$el.prepend(this.$box);
    this.updateBox();
    return this;
  },
  updateBox: function () {
    // Set the position and dimension of the box so that it covers the JointJS element.
    var bbox = this.model.getBBox();
    // Example of updating the HTML with a data stored in the cell model.
    this.$box.find('label').text(this.model.get('label'));
    this.$box.find('span').text(this.model.get('select'));
    this.$box.css({
      //width: bbox.width,
      //height: bbox.height,
      left: bbox.x + 100,
      top: bbox.y,
      transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
    });
  },
  removeBox: function (evt) {
    this.$box.remove();
  }
});


//use

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
  el: $('#myholder'),
  height: $('#myholder').height(),
  width: $('#myholder').width(),
  model: graph,
  gridSize: 1,
  defaultLink: new joint.dia.Link({
    attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
  }),
  validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    // Prevent linking from input ports.
    if (magnetS && magnetS.getAttribute('type') === 'input') return false;
    // Prevent linking from output ports to input ports within one element.
    if (cellViewS === cellViewT) return false;
    // Prevent linking to input ports.
    return magnetT && magnetT.getAttribute('type') === 'input';
  },
  validateMagnet: function (cellView, magnet) {
    // Note that this is the default behaviour. Just showing it here for reference.
    // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
    return magnet.getAttribute('magnet') !== 'passive';
  }
});
var previewGraph = new joint.dia.Graph;
var previewPaper = new joint.dia.Paper({
  el: $('#previewPaper'),
  height: "300",
  width: "300",
  model: previewGraph,
  gridSize: 1,
  defaultLink: new joint.dia.Link({
    attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
  }),
  validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    // Prevent linking from input ports.
    if (magnetS && magnetS.getAttribute('type') === 'input') return false;
    // Prevent linking from output ports to input ports within one element.
    if (cellViewS === cellViewT) return false;
    // Prevent linking to input ports.
    return magnetT && magnetT.getAttribute('type') === 'input';
  },
  validateMagnet: function (cellView, magnet) {
    // Note that this is the default behaviour. Just showing it here for reference.
    // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
    return magnet.getAttribute('magnet') !== 'passive';
  }
});

//コンポーネントがinを持っているか判定


//UUID生成
function generateUUID(length) {
  var s = "";
  length = length || 32;
  for (i = 0; i < length; i++) {
    random = Math.random() * 16 | 0;
    s += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return s;
}
//groupID+UUIDからgroupIDを抽出
function getGroupID(id) {
  var ID = id.split("/");
  return ID[0];
}

function createSourceFlow() {
  return $('#start').asEventStream('click')
}


//コンポーネントの定義

//コンポーネント周りのカラー設定
var componentColor = [];
componentColor.label = "#111111";
componentColor.rect = "#111111";
var previewComponent = new joint.shapes.devs.Model({
  position: { x: 100, y: 100 },
  size: { width: 90, height: 90 },
  inPorts: [],
  outPorts: [],
  attrs: {
    '.label': { text: 'stationery', 'ref-y': -20 },
    rect: { fill: '#2ECC71' },
    '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
    '.outPorts circle': { fill: '#E74C3C', type: 'output' }
  }
});
var stationeryComponent = new joint.shapes.devs.ComponentModel({
  position: { x: 100, y: 100 },
  size: { width: 90, height: 90 },
  inPorts: [],
  outPorts: [],
  attrs: {
    '.label': { text: 'stationery' },
    rect: { fill: '#2ECC71' },
    '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
    '.outPorts circle': { fill: '#E74C3C', type: 'output' }
  }
});
var component = {};

component.up = new joint.shapes.devs.ComponentModel({
  id: 'up/' + generateUUID(),//groupID+UUID
  position: { x: 50, y: 50 },
  size: { width: 90, height: 90 },
  inPorts: [],
  outPorts: ['out'],
  attrs: {
    '.label': { text: 'up' },
    rect: { fill: '#2ECC71' },
    '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
    '.outPorts circle': { fill: '#E74C3C', type: 'output' }
  }
});

component.down = new joint.shapes.devs.ComponentModel({
  id: 'down/' + generateUUID(),//groupID+UUID
  position: { x: 50, y: 200 },
  size: { width: 90, height: 90 },
  inPorts: [],
  outPorts: ['out'],
  attrs: {
    '.label': { text: 'down' },
    rect: { fill: '#2ECC71' },
    '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
    '.outPorts circle': { fill: '#E74C3C', type: 'output' }
  }
});

component.multi = new joint.shapes.devs.ComponentModel({
  id: 'multi/' + generateUUID(),//groupID+UUID
  position: { x: 300, y: 50 },
  size: { width: 90, height: 90 },
  inPorts: ['in'],
  outPorts: ['out'],
  attrs: {
    '.label': { text: 'multi' },
    rect: { fill: '#2ECC71' },
    '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
    '.outPorts circle': { fill: '#E74C3C', type: 'output' }
  }
});

component.display = new joint.shapes.devs.ComponentModel({
  id: 'display/' + generateUUID(),//groupID+UUID
  comid: "display",
  position: { x: 600, y: 150 },
  size: { width: 90, height: 90 },
  inPorts: ['in'],
  outPorts: [],
  attrs: {
    '.label': { text: 'display' },
    rect: { fill: '#2ECC71' },
    '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
    '.outPorts circle': { fill: '#E74C3C', type: 'output' }
  }
});

component.accel = new joint.shapes.devs.ComponentModel({
  id: 'accel/' + generateUUID(),//groupID+UUID
  position: { x: 300, y: 50 },
  size: { width: 90, height: 90 },
  inPorts: [],
  outPorts: ['out'],
  attrs: {
    '.label': { text: 'accel' },
    rect: { fill: '#2ECC71' },
    asynchronous: true,
    '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
    '.outPorts circle': { fill: '#E74C3C', type: 'output' }
  }
});
previewGraph.addCell(previewComponent.attr({ '.body': { 'rx': 6, 'ry': 6 } }));
graph.addCells([component.up, component.down, component.display, component.multi, component.accel]);

//コンポーネントスクリプト
var compcode = [];

compcode.up = function () {
  console.log("through up");
  return 1;
}

compcode.down = function () {
  console.log("through down");
  return -1;
}

compcode.multi = function (num) {
  console.log("through multi");
  return  2;
}

compcode.display = function (num) {
  console.log("through display");
  console.log($("#counter").text());
  var sum = Number($("#counter").text()) + num;
  $('#counter').text(sum);
  return 0;
}

compcode.accel = function () {
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
  var onAccelerometerChanged = function(event) {
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
}



var linkInOpt = [];
var linkOutOpt = [];
linkInOpt.inbound = true;
linkOutOpt.outbound = true;

var allInConnectedElementList = [];
//Create Componentボタンが押されたときの挙動
$('#create-component').click(function () {
  //エラーハンドリング
  if ($("#component-name").val() == "") {
    $("#component_editor_log").prepend("<font color='#FF0000'><p>you should put a Component Name</p></font>");
  } else {

    console.log(editor.getValue());
    var functionBody = editor.getValue().match(/\{([^\}]*)\}/g);
    console.log(functionBody);
    compcode[$("#component-name").val()] = new Function("msg", functionBody)
    component[$("#component-name").val()] = stationeryComponent;
    console.log(stationeryComponent);
    console.log(component.up);
    $("#advancedComponent").append("<li id='" + $('#component-name').val() + "'" + "class='ui-state-default draggableComponent' title='1秒ごとに1を出力する'>" + $("#component-name").val() + "</li>");
    $(".draggableComponent").draggable({
      appendTo: "body",
      helper: "clone",
    });
  }
});
//deployボタンが押されたときの挙動
$('#deploy').click(function () {


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
        allInConnectedElementPromiseArray.push(compcode[getGroupID(element.id)]().then(function(value)
        {
           allInConnectedElementList[element.id] = value;
        })
        );
      } else {
        allInConnectedElementList[element.id] = createSourceFlow().map(compcode[getGroupID(element.id)]);
      }
      //それ以外
    } else {
      unconnectedElementQueue.enqueue(element);
    }


  });
Promise.all(allInConnectedElementPromiseArray).then(function(){
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
              console.log( allInConnectedElementList[elementID]);
              allInConnectedElementList[element.id] = allInConnectedElementList[elementID].onValue(compcode[getGroupID(element.id)]);
              connectedElement = true;
              console.log(elementID + "--->" + element.id);
            } else {
              console.log( allInConnectedElementList[elementID]);
              allInConnectedElementList[element.id] = allInConnectedElementList[elementID].map(compcode[getGroupID(element.id)]);
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
                mergeFlow = mergeFlow.merge(allInConnectedElementList[elementID]);
                console.log("merge: " + elementID)
              }
            }
          });
        });
        if (typeof element.ports.out === "undefined") {
          allInConnectedElementList[element.id] = mergeFlow.onValue(compcode[getGroupID(element.id)]);
          console.log("merged flow" + "--->" + element.id);
        } else {
          allInConnectedElementList[element.id] = mergeFlow.map(compcode[getGroupID(element.id)]);
          console.log("merged flow" + "--->" + element.id);
        }
      } else {
        unconnectedElementQueue.enqueue(element);
      }
    }
  }
  });
});

//jquery ui
var startPosition;

$(function () {
  $(".draggableComponent").draggable({
    appendTo: "body",
    helper: "clone",
    start: function () {
      var finalOffset = $(this).offset();
      startPosition = finalOffset;
      var finalxPos = finalOffset.left;
      var finalyPos = finalOffset.top;

      console.log('Final X: ' + finalxPos);
      console.log('Final Y: ' + finalyPos);
    }
  });

  $("#droppable").resizable({
    stop: function (event, ui) {
      var width = ui.size.width;
      var height = ui.size.height;
      paper.setDimensions(width, height);
      console.log("width:" + width);
    }
  }).droppable({
    accept: ".draggableComponent",
    classes: {
      "ui-droppable-active": "ui-state-active",
      "ui-droppable-hover": "ui-state-hover"
    },
    drop: function (event, ui) {
      var componentID = ui.draggable.attr("id");
      var addComponent = component[componentID].clone();
      addComponent.position(ui.position.left - $("#droppable").offset().left, ui.position.top - $("#droppable").offset().top);
      var id = componentID + "/" + generateUUID();
      addComponent.set('id', id);
      graph.addCell(addComponent);
      $("g[model-id = '" + id + "']").prepend("<g id='Flash'><g fill='#FFCC00'  stroke='#D57300' stroke-width='2' ><path stroke-linecap='round' d='m 10.311873 9.0776039 9.400261 -7.988867 -0.05562 6.2501137 -2.224914 0.093987 -0.05562 5.5452134 11.402682 -0.04699 -18.522406 16.024725 0.05562 -6.015145 2.169291 -0.09398 -0.05562 -5.874165 -11.51392928 0.04699 z'/></g></g>");
    }
  });
});

$(function () {
  $(".accordion").accordion({
    heightStyle: "fill"
  });
  $(".sortable").sortable({
    revert: true
  });
  $("#accordion-resizer").resizable({
    minHeight: 140,
    minWidth: 200,
    resize: function () {
      $(".accordion").accordion("refresh");
    }
  });
});

//tooltipの生成
Object.keys(component).forEach(function (key) {
  $('#' + key).tooltip({
    position: {
      my: 'left center',
      at: 'right+10 center'
    },
    show: {
      effect: "slideDown",
      delay: 250
    }
  });
});

$(function () {
  $("#tabs").tabs();
});


//option radio button
$(function () {
  $("input[type='radio']").checkboxradio();
  $("fieldset").controlgroup();
});

//toggleの関数定義とバインドハンドラ
function handleName(e) {
  console.log("component name is changed");
  stationeryComponent.attr('.label/text', $("#component-name").val());
  previewComponent.attr('.label/text', $("#component-name").val());
  console.log($("#component-name").val());
  stationeryComponent.set('id', $("#component-name").val() + "/" + generateUUID());
  previewComponent.set('id', $("#component-name").val() + "/" + generateUUID());

  console.log(stationeryComponent);
}

function handleInOutType(e) {
  console.log("inout type is changed");
  console.log(e.currentTarget.id);

  var changeInOut = [];
  changeInOut["in-out"] = function () {
    stationeryComponent.set(`inPorts`, ['in']);
    stationeryComponent.set(`outPorts`, ['out']);
    previewComponent.set(`inPorts`, ['in']);
    previewComponent.set(`outPorts`, ['out']);
    editor.setValue("function(msg){\n\n something code..... \n\n return msg;\n}");
  }
  changeInOut["only-in"] = function () {
    stationeryComponent.set(`inPorts`, ['in']);
    stationeryComponent.set(`outPorts`, []);
    previewComponent.set(`inPorts`, ['in']);
    previewComponent.set(`outPorts`, []);
    editor.setValue("function(msg){\n\n something code..... \n\n }");
  }
  changeInOut["only-out"] = function () {
    stationeryComponent.set(`inPorts`, []);
    stationeryComponent.set(`outPorts`, ['out']);
    previewComponent.set(`inPorts`, []);
    previewComponent.set(`outPorts`, ['out']);
    editor.setValue("function(){\n\n something code..... \n\n return msg;\n}");
  }

  changeInOut[e.currentTarget.id]();
  console.log(stationeryComponent);
}

$("#component-name").on("change", handleName);
$("[name='inout-type']").on("change", handleInOutType);
//Ace Editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.insert("Something cool");
editor.gotoLine(1);
editor.resize();

