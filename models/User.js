const mongoose=require('mongoose');     

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

const User=mongoose.model('User',userSchema)

module.exports={User}