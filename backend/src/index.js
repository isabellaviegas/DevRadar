const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');
const {setupWebsocket} = require('./websocket');

 const app = express();
 const server = http.Server(app);

 setupWebsocket(server);

 mongoose.connect('mongodb+srv://isabellaviegas:i89955800a@cluster0-qn9bm.gcp.mongodb.net/week10?retryWrites=true&w=majority', {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useNewUrlParser: true,
   useFindAndModify: false,
   useCreateIndex: true
 });

app.use(cors());
app.use(express.json());
app.use(routes);

 server.listen(3333);