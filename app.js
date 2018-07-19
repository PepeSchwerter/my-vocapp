var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var mysql = require('mysql');
//Data Base Config
var connection = mysql.createConnection({
  host     : 'hauss.cl',
  user     : 'hausscl_test',
  password : 'pepex8554may',
  database : 'hausscl_vocapp'
});

function select_all(callback){
    var select_all_query= "SELECT * FROM Words ORDER BY Word;";
    connection.query(select_all_query, (error, results)=> {
        if (error) throw error;
        console.log("Se ha realizado la peticion!");
        callback(null, results);
     });
}

function search(data, callback){
    var search_query = "SELECT * FROM Words WHERE Word LIKE '"+data.word+"%' ORDER BY Word;";
    console.log(search_query);
    connection.query(search_query, (error, results)=> {
        if (error) throw error;
        console.log("Se ha realizado la busqueda!");
        callback(null, results);
     });
}


function add_word(data){
    var insert = `INSERT INTO Words (Word, Translation, Meaning) VALUES("${data.Word}","${data.Translation}","${data.Meaning}")`;
    connection.query(insert, function (error, results) {
        if (error) throw error;
        console.log("Dato almacenado!");
        });
}

function select_by_id(id, callback){
    var select = "SELECT * FROM Words WHERE ID = " + id;
    connection.query(select, (error, results)=> {
        if (error) throw error;
        console.log("Se ha realizado la peticion!");
        callback(null, results);
     });
}

function update_by_id(data,id){
    var update = `UPDATE Words SET Word = '${data.Word}', Translation = '${data.Translation}', Meaning = '${data.Meaning}' WHERE ID = ${id};`;
    connection.query(update, function (error, results) {
        if (error) throw error;
        console.log("Dato actualizado!");
        });
}

function delete_by_id(id){
    var del = `DELETE FROM Words WHERE ID = ${id};`;
    connection.query(del, function (error, results) {
        if (error) throw error;
        console.log("Dato eliminado!");
        });
}


function count_words(callback){
    var count = `SELECT COUNT(ID) AS Words FROM Words;`;
    connection.query(count, function (error, results) {
        if (error) throw error;
        console.log("Datos contados!");
        callback(null, results);
        });
}

connection.connect();

// connection.query(create_table, function (error, results) {
//     if (error) throw error;
//     console.log("Dato almacenado!");
// });

app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


//-ROUTES-
app.get('/',(req,res) =>{
    res.render('home');
});

app.get('/words',(req,res) =>{
    var num = count_words((err, results) => {
        return results.Words;
    });
    console.log(num);
    select_all((err, results) =>{
        res.render('index.ejs',{words:results, num:num});
    });
});

app.post('/words/search',(req,res) =>{
    search(req.body, (err, results) =>{
        res.render('index.ejs',{words:results});
    });
});

app.get('/words/new',(req,res) =>{
    res.render('new');
});

app.post('/words',(req,res) =>{
    add_word(req.body);
    res.redirect("/words");
});

app.get('/words/:id/edit',(req,res) =>{
    select_by_id(req.params.id, (err, results) =>{
        res.render('edit',{word:results[0]});

    });
});

app.put('/words/:id',(req,res) =>{
    update_by_id(req.body, req.params.id);
    res.redirect("/words");
});

app.delete('/words/:id',(req,res) =>{
    delete_by_id(req.params.id);
    res.redirect("/words");
});

//start server
var port = process.env.PORT;
app.listen(port,() =>{
    console.log(port, "It's alive!" );
});