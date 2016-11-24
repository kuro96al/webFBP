require(['component','componentModel','IDManager','StreamManager'], function(component,componentModel,IDManager,StreamManager) {

//joinjs
//コンポーネントモデルとコンポーネントモデルビューのインスタンス
joint.shapes.devs.ComponentModel = componentModel.getModel();
joint.shapes.devs.ComponentModelView = componentModel.getModelView();
var compcode = componentModel.compcode;



//use

//main editor のインスタンス
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

//preview editorのインスタンス
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
console.log(component.up);

previewGraph.addCell(previewComponent.attr({ '.body': { 'rx': 6, 'ry': 6 } }));
graph.addCells([component.up(), component.down(), component.display(), component.multi(), component.accel()]);

//Create Componentボタンが押されたときの挙動
$('#create-component').click(function () {
  //エラーハンドリング
  if ($("#component-name").val() == "") {
    $("#component_editor_log").prepend("<font color='#FF0000'><p>you should put a Component Name</p></font>");
  } else {

    console.log(editor.getValue());
    var functionBody = editor.getValue().match(/\{([^\}]*)\}/g);
    functionBody = functionBody[0].substr(1,functionBody[0].length-2);
    console.log(functionBody);
    compcode[$("#component-name").val()] = new Function("msg", functionBody);
    component[$("#component-name").val()] = function(){return stationeryComponent};
    console.log(stationeryComponent);
    componentModel.compcode = compcode;
    $("#advancedComponent").append("<li id='" + $('#component-name').val() + "'" + "class='ui-state-default draggableComponent' title='1秒ごとに1を出力する'>" + $("#component-name").val() + "</li>");
    $(".draggableComponent").draggable({
      appendTo: "body",
      helper: "clone",
    });
  }
});
//deployボタンが押されたときの挙動
$('#deploy').click(function () {
  StreamManager.makeStream(graph);
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
      var addComponent = component[componentID]().clone();
      addComponent.position(ui.position.left - $("#droppable").offset().left, ui.position.top - $("#droppable").offset().top);
      var id = componentID + "/" + IDManager.generateUUID();
      addComponent.set('id', id);
      graph.addCell(addComponent);
      //$("g[model-id = '" + id + "']").prepend("<g id='Flash'><g fill='#FFCC00'  stroke='#D57300' stroke-width='2' ><path stroke-linecap='round' d='m 10.311873 9.0776039 9.400261 -7.988867 -0.05562 6.2501137 -2.224914 0.093987 -0.05562 5.5452134 11.402682 -0.04699 -18.522406 16.024725 0.05562 -6.015145 2.169291 -0.09398 -0.05562 -5.874165 -11.51392928 0.04699 z'/></g></g>");
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
  stationeryComponent.set('id', $("#component-name").val() + "/" + IDManager.generateUUID());
  previewComponent.set('id', $("#component-name").val() + "/" + IDManager.generateUUID());

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

});
