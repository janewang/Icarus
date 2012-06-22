app.locals.use(function(req, res, done) {
  res.locals.title = 'Icarus'
  done();
});