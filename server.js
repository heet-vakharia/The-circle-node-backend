const http = require('http').createServer();
const mysql = require('mysql');
const app = require("express")();
const cors = require("cors")
const io = require('socket.io')(http, {
    reconnect:true
});
var client;
const users = [];
const group = {};
app.use(cors);
app.get("/",(req,res)=>{
    res.send("Done")
})
io.on('connection',(socket)=>{
    console.log("Connnnnn");
    console.log(socket.id);
    socket.on('connected',(data)=>{
        console.log(data,456);
        users[data] = socket.id;
        console.log(users,1234);
        client = data
    })
   socket.on('user_connected',function(data){
        
        io.to(users[data.name1]).emit('new_message',client);
        
        
   })
   socket.on('greet', function(data) {
    console.log(data);
    socket.emit('respond', { hello: 'Hey, Mr.Client!' });
  });
  socket.on('disconnect', function() {
    console.log('Socket disconnected');
  });
   socket.on('send-message',(data)=>{
       console.log(data);
       io.to(users[data.name2]).emit('recieve-message',data)
   })
   socket.on('disconnect',(data)=>{

       console.log('user has been disconnected');
   })
   socket.on('newgroup',(data)=>{
       
       if (data.groupname in group){
        var error = "already";
       }
       else{
           var error ="notalready";
           group[data.groupname] = [data.name1]
           users[data.name1]=socket.id;
       }
       var data1 ={'error':error,'name1':data.name1}
       socket.emit('added',data1);
   })
   socket.on('addmember',(data)=>{
    
       console.log(data,group);
    var k =  group[data.groupname]
    if (data.friend in k){
        console.log(123);
    }
     else{
        if(data.groupname in group){
            group[data.groupname].push(data.friend)

            if (!users[data.friend]){
                users[data.friend] = socket.id
                console.log(users,123); 
        }
                   
            
          }
          else{
            group[data.groupname] = [data.friend]
            if (!users[data.friend]){
                users[data.friend] = socket.id
                console.log(users);
        }
            console.log(users);
          }
     }
   })
   socket.on('sending',(data)=>{
       console.log(data)
       const op = group[data.group];
       console.log(group[data.group],123);
        var i = 0
        for(i =0;i<op.length;i++){
            
            if(data.sender!=op[i]){
                console.log(users)
                console.log(op[i],56)
                io.to(users[op[i]]).emit('recieve',data);
            }
            
        }
   })
   
})

// const db = mysql.createConnection({
//     host:'localhost',
//     user :'root',
//     password :'',
//     database:'nodemysql'
// })
//
// db.connect((err) =>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log("mysql connected......")
//     }
// })
// const app =  express();
// app.use(cors);
// app.get('/createddb',(req,res)=>{
//     let sql = 'CREATE DATABASE nodemysql';
//     db.query(sql,(err,result)=>{
//         if (err) throw err;
//         console.log(result);
//         res.send('Database created....')
//     })
// })
// app.get('/createposttable',(req,res)=>{
//     let sql = 'CREATE TABLE posts(username VARCHAR(50),password VARCHAR(50))'
//     db.query(sql,(err,result)=>{
//         if(err) throw err;
//         res.send('Table created ...')
//         console.log(result);
//     })
// })
// app.get('/addpost1',(req,res)=>{
//     let post = {username :'kandarp',password:'123456'};
//     let sql = 'INSERT INTO posts set ?';
//     let query = db.query(sql,post,(err,results)=>{
//         if(err) throw err;
//         console.log("Inserted ...")
//         res.send("completed....")
//     })
// })

http.listen(process.env.PORT|| 3002,()=>{
    console.log('server connected')
})