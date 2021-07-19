import React,{ useState, useEffect } from 'react'
import { Button  } from "@material-ui/core";
import '../component.css'
import firebase from './firebase';
import IssueForm from '../modals/issueForm';
import * as FaIcons  from "react-icons/fa"
import {Dropdown, DropdownMenu} from 'reactstrap'
import NotificationForm from '../modals/notificationForm';


export default function MyTickets({allUser, snapshot, currentUserId}) {
    const [currentUser, setCurrentUser] = useState(snapshot.Role)
    const [openForm, setForm] = useState(false)
    const [data, setData] = useState([])
    const [notification, setNotification] = useState([])
    const [showNoti, setShowNoti] = useState(false)
    const [showNotificationForm, setNotificationForm] = useState(false)
    const [getNotif, setNotif] = useState({})

    let response = []
    useEffect(() => {
        const loadProject= async () => {
            try{
                await firebase.db.collection('projects').doc(currentUserId).collection('MyProjects').get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) =>{
                        response.push(doc.data())
                    })
                    setData(response)
                })
                let reponse1 = []
                await firebase.db.collection('projects').doc(currentUserId).collection('Notification').get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) =>{
                            reponse1.push(doc.data())
                        })
                        setNotification(reponse1)
                })
            }catch(e){
            }
        }
        loadProject()
    }, []);

    function getNotificationDoc(doc){
        setNotif(doc)
        setNotificationForm(true)
    }

    return (
    <> 
    <div style={{
        marginLeft:"auto",
        marginTop:"20px",
    }}>
            {
                snapshot.Role === 'Admin' ? <Button style={{
               
                }}><FaIcons.FaBell  style={{
                   fontSize:"20px",
                }} onClick={(e) => setShowNoti(!showNoti)}/></Button>: ''
            }
         {  notification.length > 0 ? <sup class="badge" style={{
                position:"absolute",
                top:"6px",
                right:"-5px",
                padding:"5px 10px",
                borderRadius:"50%",
                background:"red",
                color:"white",
                fontSize:"10px",
                marginRight:"12px",
                zIndex:'1',
            }}>{notification.length}</sup> : ''}
            {
             showNoti.length > 0 ?  <Dropdown  style={{
                position:"absolute",
                padding:"2px",
                zIndex:"10",
                marginLeft:"-120px",
                border:"0.6px solid #111",
                backgroundColor:"#fff",
                display:"flex",
                justifyContent:"center",
                flexDirection:"column",
            }}
            // onChange={(e) => setTitle(e.target.value)}
            // ref={selectInputRef}
            >
                <div style={{
                    display:"flex",
                    justifyContent:"center",
                    borderBottom:"1px solid #111",
                }}>Report</div>
    {
        notification.map((proj) => 
            <DropdownMenu style={{
                padding:"10px",
                display:"flex",
                flexDirection:"column",
                width:"150px",
                alignItems:"center",
            }}value={proj.Title}>{proj.Title}
            <Button style={{
                backgroundColor:"green",
                color:"#fff",
                padding:"1px",
            }}onClick={() => getNotificationDoc(proj)}>View</Button>    
            </DropdownMenu>
        )
    }
     </Dropdown> : ''
            }  
    </div>
           <div style={{
            display:"flex",
            flexDirection:"column",
            margin:"50px",
            width:"100%",
            padding:"20px",
            overflow:"hidden",
            alignItems:"center",
        }}>
           <div style={{
           }}>
                 <div className="btn-pos" style={{
                    display:"flex",
                    justifyContent:"center",
                    flexDirection:"column",
                    padding:"10px",
                }}><h1 style={{
                    margin:"25px",
                }}>MY TICKETS</h1>
               { currentUser !== 'Developer' ? <Button className="btn" style={{
                    backgroundColor:"#111",
                    color:"#deeaee",
                    borderRadius:"0px",       
                    display:"flex",
                    alignItems:"center",             
                }} onClick={() => setForm(true)}><FaIcons.FaBug/>&nbsp;&nbsp;Report Issue</Button>: '' } 
                    
                </div>
            
           </div>
           <div style={{
               margin:"4px 4px",
               backgroundColor:"#fff",
               width:"100%",
               height: "auto",
               maxHeight:"400px",
               overflowX:"hidden",
               overflowY:"auto",
           }}>
                <IssueForm
                openForm = {openForm}
                setForm = {setForm}
                allUser = {allUser}
                snapshot={snapshot}
                currentUserId={currentUserId}    
                data = {data} 
                setData = {setData}
        />
        <NotificationForm
              showNotificationForm = {showNotificationForm}
              setNotificationForm = {setNotificationForm}
              allUser = {allUser}
              snapshot={snapshot}
              currentUserId={currentUserId}    
              getNotif = {getNotif} 
              setNotif = {setNotif} 
        /> 
           </div>
        </div>
    </>

    )
}
