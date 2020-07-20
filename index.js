const express=require('express')
const {User}=require('./models/User');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const config=require('./config/key'); 
const app=express()
const port=5000



mongoose.connect(config.mongoURI,{
            useNewUrlParser:true,useUnifiedTopology :true,useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log("MongoDb connected...")).catch(err=>console.log(err));


app.use(bodyParser.urlencoded({extended:true}));//데이터를 분석해서 가져 올 수 있게해준다.
app.use(bodyParser.json()); //json 타입으로 가져온것을 분석할 수 있도록

app.post('/register',(req,res)=>{
    //회원가입시 필요한 정보들을 client에서 가져오면 
    //그것들을 데이터 베이스에 넣어주는 공간.

    const user=new User(req.body)   //이 유저는 클라이언트로부터의 정보를 bodyparser를 이용해서 받아와서 변수에 넣어줌.

    user.save((err,userInfo)=>{
        if(err)return res.json({success:false,err})
        return res.status(200).json({       //res.stats(200)은 성공했다는 코드 ,그걸 json형식으로 전달.
            success:true           //회원가입이 성공하면 success: true 가 뜨도록 된다.
        })
    })
})

app.get('/',(req,res)=>res.send('Hello world!'))
app.listen(port,()=>console.log(`Example app listening on${port}!`))