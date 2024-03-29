require(['component', 'componentModel', 'IDManager', 'StreamManager', 'dnd'], function (component, componentModel, IDManager, StreamManager, dnd) {

  //joinjs
  //コンポーネントモデルとコンポーネントモデルビューのインスタンス
  joint.shapes.devs.ComponentModel = componentModel.getModel();
  joint.shapes.devs.ComponentModelView = componentModel.getModelView();


  //use

  //main editor のインスタンス
  var graph = new joint.dia.Graph;
  var paper = new joint.dia.Paper({
    el: $('#myholder'),
    height: $('#myholder').height(),
    width: $('#myholder').width(),
    model: graph,
    gridSize: 1,
    snapLinks: true,
    linkPinning: false,
    embeddingMode: true,
    highlighting: {
      'default': {
        name: 'stroke',
        options: {
          padding: 6
        }
      },
      'embedding': {
        name: 'addClass',
        options: {
          className: 'highlighted-parent'
        }
      }
    },
    defaultLink: new joint.shapes.devs.Link({
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
    },
    validateEmbedding: function (childView, parentView) {

      return parentView.model instanceof joint.shapes.devs.Coupled;
    }

  });

  paper.on('cell:pointerdown', function (cellView) { selectedElement = cellView.model });
  //preview editorのインスタンス
  var previewGraph = new joint.dia.Graph;
  var previewPaper = new joint.dia.Paper({
    el: $('#previewPaper'),
    height: "300",
    width: "300",
    model: previewGraph,
    gridSize: 1,
    defaultLink: new joint.shapes.devs.Link({
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
  var previewComponent = new joint.shapes.devs.ComponentModel({
    position: { x: 100, y: 100 },
    size: { width: 90, height: 90 },
    inPorts: [],
    outPorts: [],
    attrs: {
      '.label': { text: 'stationery', 'ref-y': 100 },
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
  /*
    var date =component.date();
    var soundmeter = component.soundmeter();
    var chartContainer = component.chartContainer();
    var link1 = new joint.shapes.devs.Link({
        source: { id: date.id },
        target: { id: chartContainer.id }
      });
      var link2 = new joint.shapes.devs.Link({
        source: { id: soundmeter.id },
        target: { id: chartContainer.id }
      });
    graph.addCells([date, soundmeter, chartContainer,link1,link2]);
  */

  //検証用コード
  var soundmeter = component.soundmeter();
  var gps = component.gps();
  var delay1 = component.delay();
  var delay2 = component.delay();
  var combine = component.zipwith();
  var noisemaprealtime = component.noisemaprealtime();
  var noisetubeget = component.noisetubeget();
  var noisemappast = component.noisemappast();
  var noisetuberegist = component.noisetuberegist();
  var boxRangePosition = component.boxRangePosition();
  var slidingWindow = component.slidingWindow();
  var noisePastInformationDisplay = component.noisePastInformationDisplay();
  var averageNoise = component.averageNoise();
  var link1 = new joint.shapes.devs.Link({
    source: { id: gps.id },
    target: { id: combine.id },
  });
  var link2 = new joint.shapes.devs.Link({
    source: { id: soundmeter.id },
    target: { id: combine.id }
  });
  var link3 = new joint.shapes.devs.Link({
    source: { id: combine.id },
    target: { id: delay1.id }
  });
  var link4 = new joint.shapes.devs.Link({
    source: { id: delay1.id },
    target: { id: boxRangePosition.id }
  });
  var link5 = new joint.shapes.devs.Link({
    source: { id: combine.id },
    target: { id: noisemaprealtime.id }
  });
  var link6 = new joint.shapes.devs.Link({
    source: { id: noisetubeget.id },
    target: { id: noisemappast.id }
  });
  var link7 = new joint.shapes.devs.Link({
    source: { id: combine.id },
    target: { id: noisetuberegist.id }
  });
  var link8 = new joint.shapes.devs.Link({
    source: { id: boxRangePosition.id },
    target: { id: noisetubeget.id }
  });
  var link9 = new joint.shapes.devs.Link({
    source: { id: combine.id },
    target: { id: noisePastInformationDisplay.id }
  });
  var link10 = new joint.shapes.devs.Link({
    source: { id: combine.id },
    target: { id: slidingWindow.id }
  });
  var link11 = new joint.shapes.devs.Link({
    source: { id: slidingWindow.id },
    target: { id: averageNoise.id }
  });

  graph.addCells([averageNoise, noisePastInformationDisplay, slidingWindow, boxRangePosition, gps, noisetuberegist, noisetubeget, noisemaprealtime, noisemappast, combine, delay1, soundmeter]);

  //graph.addCells([link9, link8]);
  //graph.addCells([link1, link2,link5]);
  graph.addCells([link1, link2, link3, link4, link5, link6, link7, link8, link9, link10, link11]);
  //download flow data 
  $('#download-flow').click(function () {
    console.log(JSON.prune(graph.getCells()));
    var blob = new Blob([JSON.prune(graph.toJSON())], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "flow.json");
  });

  //load flow data 

  var dndfile = new dnd.DnDFileController('body', function (files) {
    var f = files[0];
    /*
      if (!f.type.match('application/json')) {
        alert('Not a JSON file!');
      }
    */
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var result = JSON.parse(this.result);
      graph.clear();
      graph.fromJSON(result);
      graph.getLinks().forEach(function (element) {
        element.toFront();      
        console.log(element);
      })
      console.log(result);
    };
    reader.readAsText(f);
  });

  //Create Componentボタンが押されたときの挙動
  $('#create-component').click(function () {
    //エラーハンドリング
    if ($("#component-name").val() == "") {
      $("#component_editor_log").prepend("<font color='#FF0000'><p>you should put a Component Name</p></font>");
    } else {

      console.log(editor.getValue());
      var functionBody = editor.getValue().match(/\{([^\}]*)\}/g);
      functionBody = functionBody[0].substr(1, functionBody[0].length - 2);
      console.log(functionBody);
      componentModel.compcode[$("#component-name").val()] = new Function("msg", functionBody);
      component[$("#component-name").val()] = function () { return stationeryComponent };
      console.log(stationeryComponent);
      $("#userComponent").append("<li id='" + $('#component-name').val() + "'" + "class='ui-state-default draggableComponent' >" + $("#component-name").val() + "</li>");
      $(".draggableComponent").draggable({
        appendTo: "body",
        helper: "clone",
      });
    }
  });
  //deployボタンが押されたときの挙動
  $('#deploy').click(function () {

    //コンポーネントコードインスタンスの初期化
    var allElement = graph.getElements();
    var compInstanceCode = componentModel.compcode;
    allElement.forEach(function (element) {
      console.log(componentModel.compInstanceCode);
      if (!componentModel.compInstanceCode.hasOwnProperty(element.id)) {
        console.log("make component instance code");
        componentModel.compInstanceCode[element.id] = componentModel.compcode[IDManager.getGroupID(element.id)];
      }
    });
    console.log(componentModel.compInstanceCode);
    StreamManager.makeStream(graph, componentModel.compInstanceCode);
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
    $("#sortable").disableSelection(); //おまけ：テキスト選択を無効にする
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
  function nameChangeHander(e) {
    console.log("component name is changed");
    stationeryComponent.attr('.label/text', $("#component-name").val());
    previewComponent.attr('.label/text', $("#component-name").val());
    console.log($("#component-name").val());
    stationeryComponent.set('id', $("#component-name").val() + "/" + IDManager.generateUUID());
    previewComponent.set('id', $("#component-name").val() + "/" + IDManager.generateUUID());

    console.log(stationeryComponent);
  }

  function iconChangeHander(e) {
    stationeryComponent.attr("image/xlink:href", $("select").data("picker").selected_values());
    previewComponent.attr("image/xlink:href", $("select").data("picker").selected_values());
    console.log(stationeryComponent);
  }

  function InOutTypeChangeHandler(e) {
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
    console.log($("select").data("picker").selected_values());
  }

  $("#component-name").on("change", nameChangeHander);
  $("[name='inout-type']").on("change", InOutTypeChangeHandler);
  $("select").on("change", iconChangeHander);
  //Ace Editor

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/solarized_light");
  editor.getSession().setMode("ace/mode/javascript");
  editor.insert("Something cool");
  editor.gotoLine(1);
  editor.resize();

  //icon選択(image picker) 
  $("select").imagepicker({
    hide_select: false
  });
  //見栄えが悪いのでプルダウンメニューの削除
  $(".ui-selectmenu-button").remove();
});

$(function () {
  $(".controlgroup").controlgroup();
});

//html editor
(function(){

	window.addEventListener('hashchange', function(){
		location.reload();
	}, false);




	// anytime the editor content changes, this is triggered
	window.addEventListener('message', function(e) {
/*
		// reference to the preview iframe
		var preview = window.preview;
		var previewDoc = preview.document;

		// grab the code currently in the editor
		// and innerHTML it into the preview
		previewDoc.documentElement.innerHTML = e.data;

		// OK. cool! HTML and CSS work fine, however JS will
		// not be executed when innerHTML'd
		// so we have to find all the <script> tags
		// and manually execute them

		var scripts = previewDoc.getElementsByTagName('script')
*/
$("#html-preview").empty();
$("#html-preview").append(e.data);
	}, false);

})();