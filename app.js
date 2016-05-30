const express = require('express')
    , mongodb = require('mongodb')
    , assert = require('assert')
    , bodyParser = require('body-parser')
    , app = express();

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/assets', express.static('node_modules'));

mongodb.connect('mongodb://localhost:27017/movies', function(err, db) {
  assert.equal(null, err);

  const movies = db.collection('movies');

  app.get('/', function(req, res) {
    movies.find({}).toArray(function(err, results) {
      assert.equal(null, err);
      res.render('index', {
        results
      });
    });
  });

  app.post('/', function(req, res) {
    const name = req.body.name;
    var doc = {
      name
    };

    movies.insertOne(doc, function(err, r) {
      assert.equal(null, err);
      res.send(JSON.stringify({
        err: false
      , data: doc
      }));
    });
  });

  app.put('/:id', function(req, res) {
    const id = new mongodb.ObjectId(req.params.id)
        , name = req.body.name;

    movies.findOneAndUpdate({
     _id: id 
    }, {
      name
    }, function(err, r) {
      assert.equal(null, err);
      res.send(JSON.stringify({
        err: false,
        data: r
      }));
    });
  });

  app.delete('/:id', function(req, res) {
    const id = new mongodb.ObjectId(req.params.id);
    movies.deleteOne({
      _id: id
    }, function(err, r) {
      assert.equal(null, err);
      res.send(JSON.stringify({
        err: false
      }));
    });
  });

  console.log('DB OK');
});

app.listen(3000);
console.log('Express server listening on port 3000');