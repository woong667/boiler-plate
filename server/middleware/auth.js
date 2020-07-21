const {User}=require('../models/User');  //user모델을 먼저 불러온뒤.
let auth=(req,res,next)=>{
 
    //인증 처리를 하는곳.

    /***  1. 클라이언트 쿠키에서 Token을 가져온다. ***/
    let token=req.cookies.x_auth; //쿠키에서 x_auth로 지정해놓은 토큰을 가져온다.

    /***  2. Token을 복호화 한 후 user를 찾는다. ***/

    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth:false,error:true})

        req.token=token;
        req.user=user;   //user와 token 정보를 언제라도 쓸 수 잇도록 req에 넣어주었다.
        next();      //미들웨어이기 때문에 할거 다 했으면 다음으로 넘어가라고.
    }) //token을 찾기위한 메소드를 설정

    /***  3. user가 있으면 인증 ok  ***/
    
    /***  4. user가 없으면 인증 xx  ***/
}
module.exports={auth};