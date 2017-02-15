define(['IDManager', 'compcode'], function (IDManager, compcode) {
    return {
        //モデルの定義
        compcode: compcode,
        compInstanceCode: {},
        getModel: function () {
            return joint.shapes.devs.Model.extend({

                markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',

                defaults: joint.util.deepSupplement({

                    type: 'devs.ComponentModel',
                    size: {
                        width: 80,
                        height: 80
                    },
                    settings: {},
                    attrs: {
                        '.body': {
                            'rx': 6,
                            'ry': 6
                        },
                        '.label': {
                            'ref-y': 100
                        },
                        'image': { 'ref-x': 20, 'ref-y': 20, ref: 'rect', width: 48, height: 48 },
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
            })
        },

        //htmlの拡張
        //joint.shapes.devs.ComponentModel
        //joint.shapes.devs.ComponentModelView
        getModelView: function () {
            var self = this;
            return joint.shapes.devs.ModelView.extend({

                template: [
                    '<div class="html-element">',
                    '<button class="delete">x</button>',
                    '<button class="setting-toggle-button">s</button>',
                    '<button class="script">js</button>',
                    '<div class="main-script-editor" hidden>',
                    '<div class="btn-group"></div>',
                    '<div class="show-sctipt"></div>',
                    '</div>',
                    '</div>'
                ].join(''),
                editor: {},
                initialize: function () {
                    var selfChild = this;
                    _.bindAll(this, 'updateBox', 'showSctipt', 'settingToggle');
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
                    this.$box.find('.script').on('click', this.showSctipt);
                    //initialize script editor
                    this.editor = ace.edit(this.$box.find('.show-sctipt')[0]);
                    this.editor.setTheme("ace/theme/monokai");
                    this.editor.getSession().setMode("ace/mode/javascript");
                    this.editor.insert(self.compcode[IDManager.getGroupID(this.model.id)] + '');
                    this.editor.gotoLine(1);
                    this.editor.resize();
                    this.$box.find('.show-sctipt').resizable();

                    this.$box.find('.btn-group').prepend('<div class="btn-group"><button class="save btn btn-default"><i class="glyphicon glyphicon-floppy-save"></i>');
                    this.$box.find('.save').click(function (e) {
                        /*
                        var functionBody = selfChild.editor.getValue().match(/\{([^\}]*)\}/g).join('');
                        console.log(functionBody);
                        functionBody = functionBody.substr(1, functionBody.length - 2);
                        console.log(functionBody);
                        self.compInstanceCode[selfChild.model.id] = new Function("msg", functionBody);
                        */
                        console.log(eval("(" + selfChild.editor.getValue() + ")"))
                        self.compInstanceCode[selfChild.model.id] = eval("(" + selfChild.editor.getValue() + ")");
                    });

                    //initialize setting
                    //console.log("this component name is ", this.model.attr('.label/text'));
                    this.$box.find('.setting-toggle-button').on('click', this.settingToggle);
                    // Update the box position whenever the underlying model changes.
                    this.model.on('change', this.updateBox, this);
                    // Remove the box when the model gets removed from the graph.
                    this.model.on('remove', this.removeBox, this);



                    this.updateBox();

                    //要素を前面に移動
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
                    console.log(this.model);
                    this.$box.remove();
                },
                showSctipt: function () {
                    console.log(this.$box.find(".main-script-editor").is(':visible'));
                    if (this.$box.find(".main-script-editor").is(':visible')) {
                        this.$box.find(".main-script-editor").toggle();
                    } else {
                        this.$box.find(".main-script-editor").toggle();
                    }
                },
                settingToggle: function () {
                    var self = this;
                    var settings = self.model.attributes.settings;
                    var settingChangeHander = function (e) {
                        console.log("this component name is ", self.model.attr('.label/text'));
                        self.model.attr('.label/text', $('#setting-component-name').val());

                         Object.keys(settings).forEach(function (settingKey) {
                        //整数ならjuery spinnerを使う
                        if (Number.isInteger(settings[settingKey])) {
                            console.log(typeof Number($("#" + settingKey).val()));
                            settings[settingKey] = Number($("#" + settingKey).val());
                        } else if (typeof (settings[settingKey]) === "boolean") {
                            console.log(typeof $("#" + settingKey).prop("checked"));
                            settings[settingKey] = $("#" + settingKey).prop("checked");
                        } else if(typeof (settings[settingKey]) === "string"){
                            settings[settingKey] = $("#" + settingKey).val();
                        }else{
                            throw new Error("型が対応してないです。");
                        }
                    });
                    };

                    console.log(self.model.attributes.settings);
                    $("#settings-value").empty();
                    Object.keys(settings).forEach(function (settingKey) {
                        //整数ならjuery spinnerを使う
                        if (Number.isInteger(settings[settingKey])) {
                            $("#settings-value").append('<p><label for="' + settingKey + '" class="ui-state-default">' + settingKey + '<input type="text" value="' + settings[settingKey] + '" id="' + settingKey + '"></label></p>');
                            $("#" + settingKey).spinner();
                        } else if (typeof (settings[settingKey]) === "boolean") {
                            $("#settings-value").append('<p><label for="' + settingKey + '" class="ui-state-default">' + settingKey + '<input type="checkbox" value="' + settings[settingKey] + '" id="' + settingKey + '"></label></p>');
                          $("#" + settingKey).checkboxradio();
                          $("#" + settingKey).prop("checked", settings[settingKey]).checkboxradio("refresh");
                        }
                    });
                    $('#setting-component-name').val(this.model.attr('.label/text'));
                    $("#apply-setting").off();
                    $("#apply-setting").on("click", settingChangeHander);

                }
            })
        }
    }
})