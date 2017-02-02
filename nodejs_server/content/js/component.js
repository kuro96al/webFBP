define(['IDManager'], function (IDManager) {
  return {
    couple: function () {
      return new joint.shapes.devs.Coupled({
        id: 'couple/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 50, y: 50 },
        size: { width: 500, height: 500 },
        attrs: {
          '.label': { text: 'couple' },
          rect: { fill: '#9E1C21' }
        }
      })
    },
    delay: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'delay/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 50, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'delay' },
          rect: { fill: '#2ECC71' },
          throttle: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }
      })
    },
    slidingWindow: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'slidingWindow/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 50, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'slidingWindow' },
          rect: { fill: '#2ECC71' },
          bufferWithCount: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }
      })
    },
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

    date: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'date/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 50, y: 200 },
        size: { width: 90, height: 90 },
        inPorts: [],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'date' },
          rect: { fill: '#2ECC71' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }
      })
    },
    random: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'random/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 50, y: 200 },
        size: { width: 90, height: 90 },
        inPorts: [],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'random' },
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
    soundmeter: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'soundmeter/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: [],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'soundmeter' },
          image: { 'xlink:href': 'icon/Music/microphone-48.png' },
          rect: { fill: '#2ECC71' },
          asynchronous: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }
      })
    },
    gps: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'gps/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: [],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'gps' },
          rect: { fill: '#2ECC71' },
          asynchronous: false,
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
          combine: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    },
    noisemaprealtime: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'noisemaprealtime/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: [],
        attrs: {
          '.label': { text: 'noisemaprealtime' },
          rect: { fill: '#2ECC71' },
          combine: true,
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
        z:0,
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
    },
    noisetuberegist: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'noisetuberegist/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: [],
        attrs: {
          '.label': { text: 'noisetuberegist' },
          rect: { fill: '#2ECC71' },
          combine: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    },
    noisemappast: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'noisemappast/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: [],
        attrs: {
          '.label': { text: 'noisemappast' },
          rect: { fill: '#2ECC71' },
          combine: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    },
    noisetubeget: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'noisetubeget/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'noisetubeget' },
          rect: { fill: '#2ECC71' },
          combine: true,
          asynchronous: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    },
    boxRangePosition: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'boxRangePosition/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: ['out'],
        attrs: {
          '.label': { text: 'boxRangePosition' },
          rect: { fill: '#2ECC71' },
          combine: true,
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    },
    noisePastInformationDisplay: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'noisePastInformationDisplay/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: [],
        attrs: {
          '.label': { text: 'noisePastInformationDisplay' },
          rect: { fill: '#2ECC71' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    },
    averageNoise: function () {
      return new joint.shapes.devs.ComponentModel({
        id: 'averageNoise/' + IDManager.generateUUID(),//groupID+UUID
        position: { x: 300, y: 50 },
        size: { width: 90, height: 90 },
        inPorts: ['in'],
        outPorts: [],
        attrs: {
          '.label': { text: 'averageNoise' },
          rect: { fill: '#2ECC71' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }

      })
    },
  }
});