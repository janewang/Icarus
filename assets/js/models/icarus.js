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