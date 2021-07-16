import React, { useEffect, useState } from 'react'
import firebase from './firebase'
import { useHistory } from 'react-router-dom'
import '../App.css'
import { withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Button, Divider } from '@material-ui/core';
import 'firebase/firebase-firestore'
import 'firebase/database';
import * as FaIcons  from "react-icons/fa"
import * as MdIcons  from "react-icons/md"
import * as FiIcons  from "react-icons/fi"
import MyProject from './MyProject'
import MyTickets from './myTickets'
import Profile from './userProfile'
import Role from './roleAssign'

function Navbar() { 

    const [snapshot, setSnapshot] = useState('')
    const [Div, setDiv] = useState("0")
    const [allUser,setAllUser] = useState([])
    const [currentUserId, setCurrentUserId] = useState('')
   
    let history = useHistory();

    async function Logout(){
       try{
        await firebase.logout()
        // console.log("Logged out")
        Cookies.remove("user")
        history.push("/")
       } catch(e){
        // console.log(e.message)
       }
        
    }

    let reponse = []
    useEffect( () => {

        firebase.auth.onAuthStateChanged((user) => {
            if(!user) return
            firebase.db.collection("users").get().then((querySnapshot) => {

                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    temp['id'] =  `${doc.id}`
                reponse.push(temp)
                if(`${doc.id}` === user.uid){
                    setSnapshot(doc.data())
                    setCurrentUserId(user.uid)
                }
                });
            })
            setAllUser(reponse)
        });  

        
    }, []);
    // console.log("all", allUser)
    // console.log("navbar",reponse)
    return (

    <>
        <div className="navbar" style={
            {
                width:"85%",
                
                position:"fixed",
            }
        }>
          <div className="info" style={{ display:"flex", flexDirection:"column", alignItems:"center"}}>
                    <p><FaIcons.FaUserAlt style={{fontSize:"20px"}}/>&nbsp; Welcome {snapshot.Name}</p>
                    <p>Logged in as &nbsp; <b>{snapshot.Role}</b></p>
                    
          </div>   
          
        </div>
        <nav className='nav-menu active'>          
            <div className="menu" style={{
                display: "flex",
                justifyContent:"start",
                flexDirection: "column",
            }}> 
                       
            <h1 style={{
                    display:"flex",
                    alignItems:'center',
                    padding:"10px",
                    color: "#111",
                    fontSize:"48px",
                }}><FaIcons.FaBars color="#111" fontSize="50px"/>&nbsp;MENU</h1>
                <Divider style={{
                    backgroundColor: "#111",
                }}/>
                <Button className="btn" onClick={()=>setDiv("0")} style={{marginTop:"20px"}}><MdIcons.MdAssignmentInd style={{fontSize:"16px"}}/>&nbsp;&nbsp;Role Assignment</Button><br/>
                <Button className="btn" onClick={()=>setDiv('1')}><FaIcons.FaProjectDiagram style={{fontSize:"16px"}}/>&nbsp;&nbsp;My Projects</Button><br/>
                <Button className="btn" onClick={()=>setDiv("2")}><FaIcons.FaBug style={{fontSize:"16px"}}/>&nbsp;&nbsp;My Tickets</Button><br/>
                <Button className="btn" onClick={()=>setDiv("3")}><FaIcons.FaUserCircle style={{fontSize:"16px"}}/>&nbsp;&nbsp;User Profile</Button><br/>
                <Button className="btn" onClick={Logout}><FiIcons.FiLogOut style={{fontSize:"16px"}}/>&nbsp;&nbsp;Logout</Button><br/>
            </div>
        
        </nav>
        <div className="cont" style={{
            display:"flex",
            alignItems:"center",
        }}>  
            {
                 Div === '2' ? <MyTickets allUser={allUser} snapshot={snapshot} currentUserId={currentUserId}/> : Div === '1' ? <MyProject allUser={allUser} snapshot={snapshot} currentUserId={currentUserId} /> : Div === '3' ? <Profile snapshot={snapshot}/> : <Role allUser = {allUser} snapshot = {snapshot}/>         

            }
        </div>
    </>
    );
}
export default withRouter(Navbar)