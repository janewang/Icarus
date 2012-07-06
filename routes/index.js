var site = require('./site');

app.get('/', site.index);
app.get('/about', site.about);
app.get('/contact', site.contact);