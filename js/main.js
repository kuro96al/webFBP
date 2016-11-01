
//queue
function Queue() {
	this.__a = new Array();
}

Queue.prototype.enqueue = function(o) {
	this.__a.push(o);
}

Queue.prototype.dequeue = function() {
	if( this.__a.length > 0 ) {
		return this.__a.shift();
	}
	return null;
}

Queue.prototype.size = function() {
	return this.__a.length;
} 

Queue.prototype.toString = function() {
	return '[' + this.__a.join(',') + ']';
}

//joinjs開始
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
    validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        // Prevent linking from input ports.
        if (magnetS && magnetS.getAttribute('type') === 'input') return false;
        // Prevent linking from output ports to input ports within one element.
        if (cellViewS === cellViewT) return false;
        // Prevent linking to input ports.
        return magnetT && magnetT.getAttribute('type') === 'input';
    },
    validateMagnet: function(cellView, magnet) {
        // Note that this is the default behaviour. Just showing it here for reference.
        // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
        return magnet.getAttribute('magnet') !== 'passive';
    }
});
    var previewGraph = new joint.dia.Graph;
    var previewPaper = new joint.dia.Paper({
        el: $('#previewPaper'),
        height: "200",
        width: "200",
        model: previewGraph,
        gridSize: 1,
   defaultLink: new joint.dia.Link({
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
    }),
    validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        // Prevent linking from input ports.
        if (magnetS && magnetS.getAttribute('type') === 'input') return false;
        // Prevent linking from output ports to input ports within one element.
        if (cellViewS === cellViewT) return false;
        // Prevent linking to input ports.
        return magnetT && magnetT.getAttribute('type') === 'input';
    },
    validateMagnet: function(cellView, magnet) {
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
    function getGroupID(id){
       var ID = id.split("/");
      return ID[0];
    }

    function createSourceFlow(){
      return Bacon.interval(1000,1);
    }

  
    //コンポーネントの定義

    //コンポーネント周りのカラー設定
var componentColor = [];
componentColor.label = "#111111";
componentColor.rect = "#111111";

var stationeryComponent = new joint.shapes.devs.Model({
    position: { x: 50, y: 50 },
    size: { width: 90, height: 90 },
    inPorts: [],
    outPorts: [],
    attrs: {
        '.label': { text: 'stationery', 'ref-x': .4, 'ref-y': .2 },
        rect: { fill: '#2ECC71' },
        '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
        '.outPorts circle': { fill: '#E74C3C', type: 'output' }
    }
    });
var component = {};

    component.up = new joint.shapes.devs.Model({
     id:'up/'+ generateUUID(),//groupID+UUID
    position: { x: 50, y: 50 },
    size: { width: 90, height: 90 },
    inPorts: [],
    outPorts: ['out'],
    attrs: {
        '.label': { text: 'up', 'ref-x': .4, 'ref-y': .2 },
        rect: { fill: '#2ECC71' },
        '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
        '.outPorts circle': { fill: '#E74C3C', type: 'output' }
    }
    });

        component.down = new joint.shapes.devs.Model({
               id:'down/'+ generateUUID(),//groupID+UUID
    position: { x: 50, y: 200 },
    size: { width: 90, height: 90 },
    inPorts: [],
    outPorts: ['out'],
    attrs: {
        '.label': { text: 'down', 'ref-x': .4, 'ref-y': .2 },
        rect: { fill: '#2ECC71' },
        '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
        '.outPorts circle': { fill: '#E74C3C', type: 'output' }
    }
    });

        component.multi = new joint.shapes.devs.Model({
     id:'multi/'+ generateUUID(),//groupID+UUID
    position: { x: 300, y: 50 },
    size: { width: 90, height: 90 },
    inPorts: ['in'],
    outPorts: ['out'],
    attrs: {
        '.label': { text: 'multi', 'ref-x': .4, 'ref-y': .2 },
        rect: { fill: '#2ECC71' },
        '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
        '.outPorts circle': { fill: '#E74C3C', type: 'output' }
    }
    });

    component.display= new joint.shapes.devs.Model({
           id:'display/'+ generateUUID(),//groupID+UUID
      comid:"display",
    position: { x: 600, y: 150 },
    size: { width: 90, height: 90 },
    inPorts: ['in'],
    outPorts: [],
    attrs: {
        '.label': { text: 'display', 'ref-x': .4, 'ref-y': .2 },
        rect: { fill: '#2ECC71' },
        '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
        '.outPorts circle': { fill: '#E74C3C', type: 'output' }
    }
});
       previewGraph.addCell(stationeryComponent);
 graph.addCells([component.up,component.down,component.display,component.multi]);

//コンポーネントスクリプト
var compcode =[];

compcode.up = function(){
  console.log("through up");
  return 1;
}

compcode.down = function(){
  console.log("through down");
  return -1;
}

compcode.multi = function(num){
  console.log("through multi");
  return num*2;
}

compcode.display = function(num){
  console.log("through display");
  console.log($("#counter").text());
  var sum = Number($("#counter").text()) + num;
 $('#counter').text(sum);
 return 0;
}




var linkInOpt = [];
var linkOutOpt = [];
linkInOpt.inbound = true;
linkOutOpt.outbound = true;

  var allInConnectedElementList = [];
//Create Componentボタンが押されたときの挙動
$('#create-component').click(function(){
console.log(editor.getValue());
var functionBody = editor.getValue().match(/\{([^\}]*)\}/g);
console.log(functionBody);
compcode[$("#component-name").val()] = new Function ("msg", functionBody)
component[$("#component-name").val()] = stationeryComponent;
console.log(stationeryComponent);
console.log(component.up);
$("#advancedComponent").append("<li id='" + $('#component-name').val() + "'" + "class='ui-state-default draggableComponent' title='1秒ごとに1を出力する'>"+ $("#component-name").val() + "</li>");
$( ".draggableComponent").draggable({
            appendTo: "body",
            helper: "clone",
});

});
//deployボタンが押されたときの挙動
$('#deploy').click(function(){


//inが接続されていないoutのlinkの削除
var allElement = graph.getElements();
  var delLinkFin;
do{
  delLinkFin = true;
allElement.forEach(function(element){
  if(typeof element.ports.in !== "undefined" && graph.getConnectedLinks(element,linkInOpt).length == 0 && graph.getConnectedLinks(element,linkOutOpt).length != 0){
    graph.removeLinks(element);
    console.log("removed links!!");
    delLinkFin = false;
  }
});
}while(!delLinkFin)

//outが接続されていないinのlinkの削除
do{
  delLinkFin = true;
allElement.forEach(function(element){
  if(typeof element.ports.out !== "undefined" && graph.getConnectedLinks(element,linkInOpt).length != 0 && graph.getConnectedLinks(element,linkOutOpt).length == 0){
    graph.removeLinks(element);
    console.log("removed links!!");
    delLinkFin = false;
  }
});
}while(!delLinkFin)


  var unconnectedElementQueue = new Queue();
  var uncheckedElementList = graph.getElements();

    //flowのdispose()
   Object.keys(allInConnectedElementList).forEach(function (elementID) {
   	if(typeof allInConnectedElementList[elementID] === 'function'){
   		allInConnectedElementList[elementID]();
   		console.log("delete: " + elementID);
   	}
   });
   allInConnectedElementList = [];

   //ソースをallInConnectedElementListに入れる
  uncheckedElementList.forEach(function(element) {
    //源流のとき
if (typeof element.ports.in === "undefined" && graph.getConnectedLinks(element).length != 0) {
    
    allInConnectedElementList[element.id] = createSourceFlow().map(compcode[getGroupID(element.id)]);
      //それ以外
}else{
  unconnectedElementQueue.enqueue(element);
}

  
});
var element;
while( element = unconnectedElementQueue.dequeue()){
  var links = graph.getConnectedLinks(element,linkInOpt);
  //inで接続されている数がひとつの場合
  if(links.length == 1){
    var connectedElement = false;
  links.forEach(function(link){
    Object.keys(allInConnectedElementList).forEach(function (elementID) {
    if(link.getSourceElement().id == elementID){
      if (typeof element.ports.out === "undefined") {
        allInConnectedElementList[element.id] = allInConnectedElementList[elementID].onValue(compcode[getGroupID(element.id)]);
        connectedElement = true;
        console.log(elementID + "--->" +element.id);
      }else{
        allInConnectedElementList[element.id] = allInConnectedElementList[elementID].map(compcode[getGroupID(element.id)]);
        connectedElement = true;
        console.log(elementID + "--->" +element.id);
      }
    }
    });
  });
  if(!connectedElement){
    unconnectedElementQueue.enqueue(element);
  }

   //inで接続されている数が複数の場合
  }else if(links.length > 1){
    var connectPermission = false;
    var connectCounter = 0;
    links.forEach(function(link){
   Object.keys(allInConnectedElementList).forEach(function (elementID) {
    if(link.getSourceElement().id == elementID){
    connectCounter++;
    }
    });
    if(connectCounter == links.length){
      connectPermission = true;
    }
  });

  //merge可能
  if(connectPermission){
    var mergeFlow = null;
 links.forEach(function(link){
   Object.keys(allInConnectedElementList).forEach(function (elementID) {
    if(link.getSourceElement().id == elementID){
      if(mergeFlow == null){
      mergeFlow = allInConnectedElementList[elementID];
                   console.log("merge: " + elementID)
      }else{
      mergeFlow = mergeFlow.merge(allInConnectedElementList[elementID]);
             console.log("merge: " + elementID)
      }
    }
    });
  });
     if (typeof element.ports.out === "undefined") {
       allInConnectedElementList[element.id] = mergeFlow.onValue(compcode[getGroupID(element.id)]);
           console.log("merged flow" + "--->" +element.id);
     }else{
   allInConnectedElementList[element.id] = mergeFlow.map(compcode[getGroupID(element.id)]);
           console.log("merged flow" + "--->" +element.id);
     }
  }else{
    unconnectedElementQueue.enqueue(element);
  }
  }
}
});

//jquery ui
var startPosition;

  $( function() {
    $( ".draggableComponent").draggable({
            appendTo: "body",
            helper: "clone",
        start: function(){
            var finalOffset = $(this).offset();
            startPosition = finalOffset;
            var finalxPos = finalOffset.left;
            var finalyPos = finalOffset.top;

            console.log('Final X: ' + finalxPos);
            console.log('Final Y: ' + finalyPos);
        }
});

    $( "#droppable" ).resizable({
      stop:function(event,ui){
        var width = ui.size.width;
        var height = ui.size.height;
        paper.setDimensions(width,height);
        console.log("width:" + width);
      }
    }).droppable({
      accept: ".draggableComponent",
      classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function( event, ui ) {
 var componentID  = ui.draggable.attr("id");
var addComponent = component[componentID].clone();
addComponent.position(ui.position.left-$("#droppable").offset().left,ui.position.top -$("#droppable").offset().top );
var id = componentID + "/" + generateUUID();
addComponent.set('id', id);
graph.addCell(addComponent);
$("g[model-id = '" + id + "']").prepend("<g id='Flash'><g fill='#FFCC00'  stroke='#D57300' stroke-width='2' ><path stroke-linecap='round' d='m 10.311873 9.0776039 9.400261 -7.988867 -0.05562 6.2501137 -2.224914 0.093987 -0.05562 5.5452134 11.402682 -0.04699 -18.522406 16.024725 0.05562 -6.015145 2.169291 -0.09398 -0.05562 -5.874165 -11.51392928 0.04699 z'/></g></g>");
      }
    });
  } );

 $( function() {
    $( ".accordion" ).accordion({
      heightStyle: "fill"
    });
     $( ".sortable" ).sortable({
      revert: true
    });
    $( "#accordion-resizer" ).resizable({
      minHeight: 140,
      minWidth: 200,
      resize: function() {
        $( ".accordion" ).accordion( "refresh" );
      }
    });
  } );

//tooltipの生成
 Object.keys(component).forEach(function (key) {
    $('#'+key).tooltip({
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

  $( function() {
    $( "#tabs" ).tabs();
  } );


//option radio button
  $( function() {
    $( "input[type='radio']" ).checkboxradio();
    $( "fieldset" ).controlgroup();
  } );

  //toggleの関数定義とバインドハンドラ
     function handleName(e) {
       console.log("component name is changed");
       stationeryComponent.attr('.label/text',$("#component-name").val());
              console.log($("#component-name").val());
              stationeryComponent.set('id', $("#component-name").val() + "/" + generateUUID());
       console.log(stationeryComponent); 
     }

     function handleInOutType(e){
       console.log("inout type is changed");
       console.log(e.currentTarget.id);

       var changeInOut = [];
       changeInOut["in-out"] = function(){
          stationeryComponent.set(`inPorts`,['in']);
          stationeryComponent.set(`outPorts`,['out']);
          editor.setValue("function(msg){\n\n something code..... \n\n return msg;\n}");   
       }
      changeInOut["only-in"] = function(){
          stationeryComponent.set(`inPorts`,['in']);
          stationeryComponent.set(`outPorts`,[]); 
         editor.setValue("function(msg){\n\n something code..... \n\n }");   
       }
      changeInOut["only-out"] = function(){
          stationeryComponent.set(`inPorts`,[]);
          stationeryComponent.set(`outPorts`,['out']);
         editor.setValue("function(){\n\n something code..... \n\n return msg;\n}");   
       }

       changeInOut[e.currentTarget.id]();
       console.log(stationeryComponent);
     }

 $( "#component-name").on( "change", handleName );
  $( "[name='inout-type']").on( "change", handleInOutType );
//Ace Editor
   var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.insert("Something cool");
    editor.gotoLine(1);
    editor.resize();