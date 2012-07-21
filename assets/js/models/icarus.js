window.Icarus = Backbone.Model.extend({
  defaults: {   
    x         : 0,
    y         : 0,
    sessionId : 0,
    spirit    : 100
  }
});

window.IcarusCollection = Backbone.Collection.extend({
  model: Icarus
});