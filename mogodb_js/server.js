// nodemon 無法控制時kill -9 $(lsof -t -i:12390)  
// ---- 基本設定 ----
var express = require('express');
var app = express();
var port = process.env.PORT || 12390;
// ---- body-parser ----
const bodyParser = require('body-parser')


// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.set('view engine', 'ejs')

// Middlewares and other routes here...
// ---- ROUTES ----

var router = express.Router();

// 首頁路由 (http://localhost:8080)
// router.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html')
//     // res.send('home page!');
// });

// 另一張網頁路由 (http://localhost:8080/about)
router.get('/about', function(req, res) {
  res.send('about page!');
});




// const MongoClient = require('mongodb').MongoClient
const {
  MongoClient
} = require('mongodb');
const uri = "mongodb+srv://node:vxmlcWlVByeneF69@cluster0.8v7pm.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object

//   client.close();
// });

// MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true },
//    (err, client) => {
//   if (err) return console.error(err)
//   console.log('Connected to Database')
// })
MongoClient.connect(uri, {
    // useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(client => {
    // ...
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    router.post('/quotes', (req, res) => {
      // console.log('Hellooooooooooooooooo!')
      console.log(req.body)
      quotesCollection.insertOne(req.body)
        .then(result => {
          // console.log(result)
          res.redirect('/')
        })
        .catch(error => console.error(error))


    })

    router.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', {
            quotes: results
          })
        })
        .catch( /* ... */ )
    })
    router.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate({
          name: '123'
        }, {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        }, {
          upsert: false
        })
        .then(result => {
          res.json('Success')
        })
        .catch(error => console.error(error))

    })
    router.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne({
          name: req.body.name
        })
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json(`Deleted Darth Vadar's quote`)
        })
        .catch(error => console.error(error))
    })


    // 將路由套用至應用程式
    app.use('/', router);
    app.use(express.static('public'))
      // ---- 啟動伺服器 ----
    app.listen(port);


  })
  .catch(error => console.error(error))