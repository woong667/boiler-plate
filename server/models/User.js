const mongoose=require('mongoose');     
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const saltRounds=10
const userSchema=mongoose.Schema({

    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,  /*trim은 띄어쓰기를 없애주는 역할 */
        unique:1  /*똑같은 이메일은 있으면 안되기때문이다.*/
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{   /* 관리자이면서 유저일수있다.*/ 
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{   /*token을 사용할수 있는 기간.*/
         type:Number
    }
})



userSchema.pre('save',function(next){    //데이터를 저장하기전에 거치는 구간.

    /************************************비밀번호를 암호화 시키기위한 함수구간*********************************************/
       var user=this;  //데이터 베이스에 입력된 정보를 이 user 변수에 담아온다.
       if(user.isModified('password')){  //패스워드가 변할때만 비밀번호를 암호화해준다.

       bcrypt.genSalt(saltRounds, function(err, salt) { //Salt를 만들기위해서는 SaltRound가 필요하다. 몇자리의 솔트를 쓸것인지를 정함.
           if(err) return next(err);
           bcrypt.hash(user.password, salt, function(err, hash) {   //user의 패스워드(plainpassword)  hash는 암호와된 비밀번호
               if(err) return next(err);
               // Store hash in your password DB.

           user.password=hash;   //해쉬된 비밀번호를 user의 비밀번호로 바꿔준다.
           next()  //다음으로 넘겨준다.
           })
       })
   }  //패스워드가 변할때에만 암호화 끝
   else{  //다른것을 바꿀때에는 
       next() //그냥 넘긴다.
   }
   /************************************비밀번호를 암호화 시키기위한 함수 구간 끝*******************************************/
})

userSchema.methods.comparePassword=function(plainPassword,cb){

    //plainPassword가 1234567 이라고 생각하고 암호화된 패스워드는 또 $223$9299어쩌구저쩌구 .. 
    //따라서 plainPassword를 다시 암호화시켜서 비교를 한다.
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);          //cb는 콜백(callback)함수.
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken =function(cb){
    var user=this;
    //jsonwebToken을 사용해서 Token을 생성하기.
    var token=jwt.sign(user._id.toHexString(),'secretToken')
    user.token=token
    user.save(function(err,user){
        if(err) return cb(err)
         cb(null,user)
    })
}

userSchema.statics.findByToken=function(token,cb){
    var user=this //유저를 넣어주고.

    //토큰을 디코드 한다.

    jwt.verify(token,'secretToken',function(err,decoded){

      // 유저아이디를 이용해서 user를 찾은 다음에 
      // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인.
      user.findOne({"_id":decoded,"token":token},function(err,user){
          if(err) return cb(err)
           cb(null,user)  
      })
    })
  }


const User=mongoose.model('User',userSchema)
module.exports={User}