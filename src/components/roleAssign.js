import React, { useState, useRef } from 'react'
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Button,Divider } from '@material-ui/core';
import firebase from './firebase';

function Role({allUser, snapshot}) {
    console.log("sadvsd",allUser);

    const selectInputRef = useRef();

    const [Role, setRole] = useState('')
    const [user, setUser] = useState('')

    const updateProjectDoc= (e) => {
        for(let i=0; i<allUser.length; ++i){
            if(allUser[i].Name === user && Role){
                console.log(allUser[i].id)
                firebase.db.collection('users').doc(allUser[i].id).update({
                    Role: Role,
                })
            }
        }
    }

    
    console.log(Role, user);
    return (
        <>
        {
         snapshot.Role === 'Admin' ?  <div style={{
                display:"flex",
                alignItems:"center",
                flexDirection:"column",
                justifyContent:"center",
                width:"600px ",
                padding:"40px",
                marginTop:"100px",
                backgroundColor:"#deeaee",
                boxShadow:"8px 8px 12px grey",
                }}><h1 style={
                    {
                        // display:"flex",
                        // justifyContent:"center",
                    }
                }>Assign Role</h1><br/>
                <Divider style={{
                    backgroundColor: "#111",
                }}/>
            <Select  style={{
                            padding:"2px",
                            width:"100%",
                        }}
                        onChange={(e) => setUser(e.target.value)}
                        ref={selectInputRef}
                        
                        >
                {
                    allUser.map((user) => 
                        <MenuItem value={user.Name}>{user.Name}</MenuItem>
                    )
                }
            </Select>
            <br/>
            <Select  style={{
                            padding:"2px",
                            width:"100%",
                        }}
                        defaultValue="Select Role"
                        onChange={(e) => setRole(e.target.value)}
                        ref={selectInputRef}
                        required>
                            <MenuItem value="Admin">Admin</MenuItem> 
                            <MenuItem value="Developer">Developer</MenuItem>
                            <MenuItem value="Tester">Tester</MenuItem>            
            </Select>
            <br/>
            <Button style={{
                display:"flex",
                justifyContent:"center",
                padding: "5px",
                fontSize: "16px",
                width:"100%",
                padding:"5px",
                color: "#deeaee",
                textDecoration: "none",
                backgroundColor:"#111",
                borderRadius:"0px",
                letterSpacing:"12px",
            }}
            onClick={updateProjectDoc}
            >Assign</Button>
            </div>  : 
            
            <div style={{
                display:"flex",
                justifyContent:"center",
            }}><h1  style={{
                marginTop:"100px",
                display:"flex",
                justifyContent:"center",
                color:"#111",
            }}>Admin Only</h1></div>
        }
    </>
    )
}

export default Role