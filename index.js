const express=require('express')
const {User}=require('./server/models/User');
const {auth}=require('./server/middleware/auth');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const config=require('./server/config/key'); 
const cookieParser=require('cookie-parser');
const app=express()
const port=5000



mongoose.connect(config.mongoURI,{
            useNewUrlParser:true,useUnifiedTopology :true,useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log("MongoDb connected...")).catch(err=>console.log(err));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));//데이터를 분석해서 가져 올 수 있게해준다.
app.use(bodyParser.json()); //json 타입으로 가져온것을 분석할 수 있도록

app.post('/api/users/register',(req,res)=>{
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

app.post('/api/users/login',(req,res)=>{    //로그인을 할때의 과정
 
    // 1,데이터 베이스에서 요청한 email 찾기.
    User.findOne({ email:req.body.email},(err,user)=>{
         if(!user){
             return res.json({
                 loginSuccess: false,
                 message: "제공된 이메일에 해당되는 유저가 없습니다."
             })
         }
         user.comparePassword(req.body.password,(err, isMatch)=>{
                 if(!isMatch)
                  return res.json({loginSuccess: false,message: "비밀번호가 틀렸습니다."})


                //비밀번호가 까지 맞다면 토큰을 생성해야댐.
                user.generateToken((err,user)=>{         //status 200은 성공, 400은 에러
                    if(err) return res.status(400).send(err);

                    //토큰을 저장함.  어디?? 쿠키, 로컬스토리지....etc 여기서는 쿠키에다가..
                    res.cookie("x_auth",user.token)
                    .status(200).json({loginSuccess:true ,userid: user._id})

             })
        }) 
         
    })
    // 2,데이터 베이스에서 요청한 email이 있다면 비밀번호가 맞는 비밀번호인지 확인

    // 3,비밀번호까지 같다면 Token을 생성   

})

app.get('/api/users/auth',auth,(req,res)=>{        // auth라는 미들웨어를 사용한다.
  
    //여기까지 미들웨어를 통과했다는 의미는  Authentication이 true라는 뜻.
    res.status(200).json({
        _id:req.user._id,
        isAdmin:req.user.role===0 ? false:true,
        isAuth:true,
        email:req.user.email,
        name: req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })
 })

 app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},
        {token:""},         //token: " " 은 토큰을 지워버려라라는 코드.
        (err,user)=>{
            if(err)return res.json({success: false,err})
             res.status(200).send({
                 success: true
             })
        })
})
 

app.get('/',(req,res)=>res.send('Hello world!'))

app.get('/api/hello',(req,res)=>{
    res.send("안녕!");
})


app.listen(port,()=>console.log(`Example app listening on${port}!`))