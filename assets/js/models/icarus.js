window.Icarus = Backbone.Model.extend({
  defaults: {
    username  : 'Anon',
    x         : 0,
    y         : 0,
    blood     : 0,
    spirit    : 0
  }
});

window.IcarusCollection = Backbone.Collection.extend({
  model: Icarus
});