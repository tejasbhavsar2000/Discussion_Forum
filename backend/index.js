const express = require('express');
const Datastore = require('nedb');
const cors = require('cors');
const { request, response } = require('express');
const app = express();
app.listen(4000, () => console.log("listening at 4000"));
app.use(cors());
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('databse.db');
database.loadDatabase();

app.get('/getAllPosts',  (request, response) => {
        const data =  database.getAllData().sort();
        response.json(data);
    });

app.post('/createDiscussion', (request,reposnse) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp=timestamp;
    console.log(data);
    database.insert(data);
    reposnse.json(data);
});

app.get('/post/:id',  (request, response) => {
    const id  = request.params.id;
    database.findOne({_id:`${id}`}, (err,data) =>{
        response.json(data);
    });
});

app.post('/post/addComment/:id', (request,response)=> {
    const id = request.params.id;
    const data = request.body;
    console.log(data);
    database.update(
        { "_id": id }, 
        { $set: { "comments": data.comments} },
        {},// this argument was missing
        function (err, numReplaced) {
          console.log("replaced---->" + numReplaced);
        }
        );
})

app.post('/')