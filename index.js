const express=require('express')
const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://travis:scott@youtubeclone.k4odt.mongodb.net/<dbname>?retryWrites=true&w=majority',{
            useNewUrlParser:true,useUnifiedTopology :true,useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log("MongoDb connected...")).catch(err=>console.log(err));
const app=express()
const port=5000

app.get('/',(req,res)=>res.send('Hello world!'))
app.listen(port,()=>console.log(`Example app listening on${port}!`))