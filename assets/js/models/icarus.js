window.Icarus = Backbone.Model.extend({
  defaults: {   
    x         : 0,
    y         : 0,
    username  : 'Icarus',
    sessionId : 0,
    blood     : 100,
    spirit    : 100,
    alive     : true
  }
});

window.IcarusCollection = Backbone.Collection.extend({
  model: Icarus
});