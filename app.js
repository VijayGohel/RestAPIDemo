const express  = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.listen(3000, ()=>{
    console.log("Server started on port 3000");
})

app.route("/articles")
.get((req,res)=>{
    Article.find({},(err,result)=>{
        if(!err)
            res.send(result);
        else
            res.send(err);
    })
})
.post((req,res)=>{
    const article= new Article({
        title:req.body.title,
        content:req.body.content
    });

    article.save((err)=>{
        if(!err)
            res.send("Successfully posted");
        else
            res.send(err);
    })
})
.delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if(!err)
            res.send("Successfully deleted");
        else
            res.send(err);
    })
});

app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,result)=>{
        res.send(result);
    })
})
.put((req,res)=>{
    Article.updateOne({title:req.params.articleTitle}, {$set:req.body},
        {overwrite:true},
        (err)=>{
            if(err)
                res.send(err);            
            else
                res.send("Successfully updated");
    })
})
.patch((req,res)=>{
    Article.updateOne({title:req.params.articleTitle}, {$set:req.body},
        (err)=>{
            if(err)
                res.send(err);            
            else
                res.send("Successfully updated");
    })
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle}, (err)=>{
        if(err)
                res.send(err);            
            else
                res.send("Successfully deleted");
    })
});