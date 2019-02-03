const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const articleScheme = new Schema({name: String, auhtor: String}, {versionKey: false});
const Article = mongoose.model("Article", articleScheme);
 
app.use(express.static(__dirname + "/public"));
 
mongoose.connect("mongodb://localhost:27017/articledb", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});
  
app.get("/api/article", function(req, res){
        
    Article.find({}, function(err, articles){
        if(err) return console.log(err);
        res.send(articles)
    });
});
 
app.get("/api/article/:id", function(req, res){
    const id = req.params.id;
    Article.findOne({_id: id}, function(err, article){ 
        if(err) return console.log(err);
        res.send(article);
    });
});
    
app.post("/api/articles", jsonParser, function (req, res) {
        
    if(!req.body) return res.sendStatus(400);
        
    const articleName = req.body.name;
    const articleAuthor = req.body.auhtor;
    const article = new Article({name: articleName, auhtor: articleAuthor});
        
    article.save(function(err){
        if(err) return console.log(err);
        res.send(article);
    });
});
     
app.delete("/api/articles/:id", function(req, res){
         
    const id = req.params.id;
    Article.findByIdAndDelete(id, function(err, article){
                
        if(err) return console.log(err);
        res.send(article);
    });
});
    
app.put("/api/articles", jsonParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const articleName = req.body.name;
    const articleAuhtor = req.body.auhtor;
    const newArticle = {auhtor: articleAuhtor, name: articleName};
     
    Article.findOneAndUpdate({_id: id}, newArticle, {new: true}, function(err, article){
        if(err) return console.log(err); 
        res.send(article);
    });
});



// Error handling middle-ware

app.use(function(err,req,res,next) {
  console.log(err.stack);
  res.status(500).send({"Error" : err.stack});
});

