import React,{useState} from 'react'
import {useDispatch} from 'react-redux'
import {loginUser} from '../../../_actions/user_action';

function LoginPage() {
     
    const dispatch=useDispatch();
    const [Email,setEmail]=useState("")
    const [Password,setPassword]=useState("")
    const onEmailHandler=(event)=>{
           setEmail(event.currentTarget.value)
    }
    const onPasswordHandler=(event)=>{
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler=(event)=>{
        event.preventDefault();
        console.log('Email',Email);
        console.log('Password',Password);
        let body={
            email:Email,
            password:Password
        }

        //이제 여기까지 입력받은 이메일과 password를 Axios를 것을 이용해서 서버로 보내야함
        dispatch(loginUser(body))
    }
    return (
        <div style={{
            display:'flex',justifyContent:'center',alignItems:'center',
            width:'100%',height:'100vh'
        }}> 
           <form style ={{display:'flex',flexDirection:'column'}}
           onSubmit={onSubmitHandler}>
               <label>Email</label>
               <input type="email" value={Email} onChange={onEmailHandler} />
               <label>Password</label>
               <input type="password" value={Password} onChange={onPasswordHandler} />
               <br />
               <button>
                   Login
               </button>
           </form>
        </div>
    )
}

export default LoginPage
