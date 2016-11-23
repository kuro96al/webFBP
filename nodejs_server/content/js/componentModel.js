define(['IDManager', 'compcode'], function (IDManager, compcode) {
    return {
        //モデルの定義
        getModel: function () {
            return joint.shapes.devs.Model.extend({

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
                            'ref-y': 100
                        },
                        asynchronous: false,
                        combine: false,
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
            return joint.shapes.devs.ModelView.extend({

                template: [
                    '<div class="html-element">',
                    '<button class="delete">x</button>',
                    '<button class="script">js</button>',
                    '<div class="show-sctipt"></div>',
                    '</div>'
                ].join(''),

                initialize: function () {
                    _.bindAll(this, 'updateBox', 'showSctipt');
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
                    console.log(this.model);
                    this.$box.remove();
                },
                showSctipt: function () {
                    console.log(compcode[IDManager.getGroupID(this.model.id)]);
                    //this.$box.find('.show-sctipt').append("<p>" + compcode[IDManager.getGroupID(this.model.id)] + "</p>");
                    console.log(this.$box.find('.show-sctipt'));
                    var editor = ace.edit( this.$box.find('.show-sctipt')[0]);
                    editor.setTheme("ace/theme/monokai");
                    editor.getSession().setMode("ace/mode/javascript");
                    editor.insert(compcode[IDManager.getGroupID(this.model.id)]+'');
                    editor.gotoLine(1);
                    editor.resize();
                }
            })
        }
    }
})