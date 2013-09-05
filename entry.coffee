Express = require 'express'

app = new Express()
app.use Express.static "#{__dirname}"
app.listen 3111
console.log 'SERVER STARTED'