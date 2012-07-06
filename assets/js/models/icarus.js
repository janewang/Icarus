window.Icarus = Backbone.Model.extend({
  defaults: {
    x         : 0,
    y         : 0,
    color     : 'white' 
  }
});

window.IcarusCollection = Backbone.Collection.extend({
  model: Icarus
});

var icarusCollection = new IcarusCollection(1);

// console.log(icarusCollection.models[0].attributes.x);
// console.log(icarusCollection.models[0].attributes.y);

var socket = io.connect('http://localhost');

socket.on('player position', function (data) {
  console.log(data);
});