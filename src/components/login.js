import React from 'react'
import '../App.css';
import {Button, Input} from '@material-ui/core';
import firebase from './firebase'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'
import swal from 'sweetalert';


export default function Login() {
       
   const [getMail, setMail] = useState('')
   const [getPass, setPass] = useState('')
   let history = useHistory();
   

    async function Login(){

     try{
       const user = await firebase.login(getMail, getPass)
     
      Cookies.set("user", "loginTrue")
      history.push('/navbar')
      

     }catch(e){
       swal({
        title: "Falied",
        text: "Register before login",
        icon: "warning",
        button: "Ok",
      });

       history.push("/")
     }

    
   }
    return (
         <div className="container">
            <div className="login-form">
          <h1>WELCOME BACK!</h1>
          <div className="divider"></div>
          <div className="  Input-field" id="model-signup">
            <form id="login-form" onSubmit={e => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Email"
                className="Input"
                id="log-email"
                value={getMail}
                onChange={e => setMail(e.target.value)}
                disableUnderline={true}
                required
              />
              <br />
              <Input
                type="password"
                placeholder="Password"
                className="Input"
                disableUnderline={true}
                id="log-password"
                value={getPass}
                onChange={e => setPass(e.target.value)}
                required
              />
              <br />
              <div className="reg">
                <Button className="btn" id="log-but" type="submit" onClick={Login}>
                  Login
                </Button>
                <br />
                <br />
              </div>
              <br />
              <div className="toggle" style={{display:"flex", justifyContent:"center" }}>
             <p>Don't have an account? &nbsp;<a href='./' >Register</a> </p>
            </div>
            </form>
          </div>
        </div>
           </div>
    )
}
