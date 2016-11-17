define(['IDManager'], function (IDManager) {
  return {
    up: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'up/' + IDManager.generateUUID(),//groupID+UUID
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
      })
    },

    down: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'down/' + IDManager.generateUUID(),//groupID+UUID
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
      })
    },
    multi: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'multi/' + IDManager.generateUUID(),//groupID+UUID
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
      })
    },

    display: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'display/' + IDManager.generateUUID(),//groupID+UUID
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
      })
    },
    phoneAccel: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'phoneAccel/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: [],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'phoneAccel' },
          rect: { fill: '#2ECC71' },
          asynchronous: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }
      })
    },
    accel: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'accel/' + IDManager.generateUUID(),//groupID+UUID
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
      })
    },

    temp: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'temp/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: [],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'temp' },
          rect: { fill: '#2ECC71' },
          asynchronous: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }
      })
    },
    chartContainer: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'chartContainer/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: [],
        attrs: {
          '.label': { text: 'chartContainer' },
          rect: { fill: '#2ECC71' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    },
    combine: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'combine/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'combine' },
          rect: { fill: '#2ECC71' },
          combine: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    }
  }
});