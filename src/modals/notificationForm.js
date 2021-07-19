import React, { useState } from 'react'
import { Dialog, Button } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import firebase from '../components/firebase'

export default function NotificationForm(props) {
    const { showNotificationForm,setNotificationForm, allUser, snapshot, currentUserId, getNotif, setNotif} = props;

    const [selected, setSelected] = useState([])
    let IDs = []
    function handleClose() {
        setNotificationForm(false);
    }
    function remove(val){
        let index = 0
        if(selected.includes(val)){
            for(let i=0; i<selected.length; ++i){
                if(selected[i] === val){
                    index = i
                }
            }
        }
        selected.splice(index, 1)
        console.log(selected)
        setSelected(selected)
    }
    function Approve(){
        createDoc()
        getIDs()
        assignDoc()
        deleteDoc()

    }

    function Reject(){
        deleteDoc()
    }
    async function createDoc(){
        await firebase.createTicketDoc(currentUserId, getNotif.Title, getNotif.Description, getNotif.Priority, getNotif.id)
    }
    
    async function assignDoc(){
        for(let i=0; i<IDs.length; ++i){    
            await firebase.createTicketDoc(IDs[i], getNotif.Title, getNotif.Description, getNotif.Priority, getNotif.id)     
       }
    }
    async function deleteDoc(){
        await firebase.DeleteNotificationDoc(currentUserId, getNotif.id)
    } 
    function getIDs(){
        allUser.map((user) => {
            if(selected.includes(user.Name)){
                IDs.push(user.id)
            }
        })
    }
    return (
    <>
    <Dialog open={showNotificationForm} maxWidth="md" onClose={handleClose}>
            <Card style={{
                display:"flex",
                flexDirection:"column",
                padding:"20px",
                width:"500px",
                height:"auto",
            }}>
                <div style={{
                    display:"flex",
                    justifyContent:"center",
                    borderBottom:"1px solid #111",
                    padding:"10px",
                }}>
                    <Typography style={{
                        fontSize:"40px",
                    }}><b>Review Issue</b></Typography>
                </div>
                <Typography style={{
                    display:"flex",
                    padding:"10px",
                }}><b>Project Title:</b>&nbsp;{getNotif.Title}</Typography>
                <Typography style={{
                    display:"flex",
                    padding:"10px",
                }}><b>Issue :</b>&nbsp;{getNotif.Description}</Typography>
                <Typography style={{
                    display:"flex",
                    padding:"10px",
                }}><b>Priority :</b>&nbsp;{getNotif.Priority}</Typography>
                <b style={{
                    display:"flex",
                    padding:"10px",
                }}>Assign Developer</b>
                    {
                        allUser.map((user) => 
                            user.Role === 'Developer' ? <FormControlLabel  style={{
                                display:"flex",
                                paddingLeft:"10px",
                            }}
                            control={<Checkbox 
                            value={user.Name} 
                            onChange={(e) => 
                                !selected.includes(e.target.value) ? setSelected([...selected, e.target.value])
                                : remove(e.target.value)                                                  
                            }/>}
                            label={user.Name}
                          /> : ''
                        )
                    }
                <Button className="notif-btn1" style={{
                    backgroundColor:"green",
                    color:"#fff",
                    margin:"5px",
                    letterSpacing:"4px",
                    borderRadius:"0px",
                }} onClick={Approve}>APPROVE</Button>
                 <Button style={{
                    backgroundColor:"red",
                    color:"#fff",
                    margin:"5px",
                    letterSpacing:"4px",
                }} onClick={Reject}>REJECT</Button>
            </Card>
    </Dialog>
    </>
    )
}
