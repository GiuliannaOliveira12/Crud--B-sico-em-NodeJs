//Constants
const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars');
const app=express();
const urlencodeParser = bodyParser.urlencoded({extended:false});

//criando conexao com banco de dados 

const sql = mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   port:3306

});

sql.query("use nodejs");


//template engine 
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));

// Criando rotas e templates
app.get('/',function(req,res){
   //enviando uma mensagem 
   /*res.send("pagina inicial")*/
   res.render('index');

})
//inserindo dados 
app.get("/inserir",function(req,res){res.render("inserir");});

// listando todos os tados 
app.get("/select:id?",function(req,res){
  if(!req.params.id){
     sql.query("select * from user order by id ",function(err, results, fields){
         res.render('select',{data:results})
     });
  }else{
   sql.query("select * from user where id=? order by id asc ", [req.params.id],function(err, results, fields){
      res.render('select',{data:results})
  }); 
  }


});
//deletando dados
app.get('/deletar/:id',function(req,res){
   sql.query("delete from user where id=?",[req.params.id]);
   res.render('deletar');
});

//atualizando dados
app.get("/update/:id",function(req,res){
   sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
       res.render('update',{id:req.params.id,name:results[0].name,age:results[0].age});
   });
});

app.post("/controllerUpdate",urlencodeParser,function(req,res){
  sql.query("update user set name=?,age=? where id=?",[req.body.name,req.body.age,req.body.id]);
  res.render('controllerUpdate');
});



//pegando dados inseridos no formulario
app.post("/controllerForm",urlencodeParser,function(req,res){
   sql.query("insert into user values (?,?,?)",[req.body.id,req.body.name,req.body.age]);
   //mostrando que dados foram inseridos 
   res.render('controllerForm',{name:req.body.name});
});





//iniciando servidor 
app.listen(3000,function(req,res){
   console.log('Servidor está rodando!');
});
