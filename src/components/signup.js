import React from "react";
import "../App.css";
import { Button, Input } from "@material-ui/core";
import firebase from './firebase'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
 

export default function SignUp() {
 
  let history = useHistory('')

  const [getMail, setMail] = useState('')
  const [getPass, setPass] = useState('')

  const [name, setName] = useState('')


  const getName = (event) => {
    event.persist()
    setName(event.target.value);
  }


  async function Register(){
    try{
      const user_data = await firebase.register(getMail, getPass, name) 

      // console.log("heteerererwet",name, getMail)
      await firebase.createUserDoc(user_data, name, getMail);

      // console.log(user_data)
  
      swal("Good job!", "Registered Successfully", "success");
      history.push('./login')



    }catch(e){
      swal("Registration failed", e.messege);
    }
  }


  return (
      <div className="container">
        <div className="signup-form">
        <h1>SIGN UP</h1>
        <div className="divider"></div>
        <div className="Input-field" id="model-signup">
          <form id="signup-form" onSubmit={e => e.preventDefault()}>
          <Input
              disableUnderline={true}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e)=>{getName(e)}}
              className="Input"
              required
            />
            <br />
            <Input
              disableUnderline={true}
              type="email"
              placeholder="Email"
              value={getMail}
              onChange={e => setMail(e.target.value)}
              className="Input"
              required
            />
            <br />
            <Input
              disableUnderline={true}
              type="password"
              placeholder="Set Password"
              value={getPass}
              onChange={e => setPass(e.target.value)}
              className="Input"
              required
            />
            <br />
            <div className="reg">
              <Button className="btn" id="reg-but" type="submit" onClick={Register}>
                Register
              </Button>
              <br />
            </div>
            <br />
            <div className="toggle" style={{display:"flex", justifyContent:"center" }}>
             <p>Already have an account? &nbsp;<a href='./login' >Login</a> </p>
            </div>
          </form>
        </div>
      </div>
      </div>
  );
}
