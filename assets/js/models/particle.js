window.Particle = Backbone.Model.extend({
});

window.ParticleCollection = Backbone.Collection.extend({
    model: Particle
});

var particleCollection = new ParticleCollection();

var socket = io.connect('http://localhost');
socket.on('particle position', function (data) {
  particleCollection.reset(data);
});
