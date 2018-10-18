//initializing node_modules
var express=require("express");
var bodyParser=require("body-parser");
var msSql=require("mssql");
var app=express();

//body-parser middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,HEAD,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,contentType,Content-Type,Accept,Authorization");
    next();
});


//Setting up server
var server=app.listen(process.env.PORT || 8080, function(){

    var port= server.address().port;
    console.log("app now running on port",port);
});

//initializing connetiction string
var dbConfig={
    user:"sa",
    password:"sa@12345",
    server:"DESKTOP-LCRB0EN",
    database:"db_exioms_test_cms",
    options: {
        encrypt: false
    }
};


var executeQuery=function(res,query)
{
    new msSql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(query)
         }).then(result => {
           let rows = result.recordset;
           res.status(200).json(result);
           msSql.close();
        }).catch(err => {
              res.status(500).send({ message: "${err}"})
              msSql.close();
        });    
}



//get menu's api
app.get("/api/menus",function(req,res){
    var query ="select * from menu";
    executeQuery(res,query);
});

//get page for selected menu api
app.get("/api/pages/:menuid",function(req,res){
    var query ="select * from page where MenuId = "+req.params.menuid;
    executeQuery(res,query);
});

//put  for updating page content for the menu
app.put("/api/pages/:menuid",function(req,res){
   var query="update page set HtmlContent='"+req.body.HtmlContent+"' where MenuId=" + req.params.menuid;
    executeQuery(res,query);
});

