import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Divider, TextField, makeStyles } from '@material-ui/core'
import firebase from '../components/firebase'
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import * as FaIcons  from "react-icons/fa"
import EditIssueForm from './editIssueForm'

const useStyles = makeStyles(theme =>({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        tap: theme.spacing(5),
        width: "50%",
        height:'60%',
    }
}))

export default function IssueForm(props) {
    const { openForm, setForm, allUser, snapshot, currentUserId, data, setData} = props;
    const classes = useStyles();

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [taskList, setTaskList] = useState([])
    const [selected, setSelected] = useState([])
    const [priority, setPriority] = useState('')
    const [ticketData, setTicketData] = useState([])
    const [adminId, setAdminId] = useState('')
    const [editData, setEditData] = useState({});
    const [openEditForm, setEditForm] = useState(false)

    function handleClose() {
        setForm(false);
    }

    let temp = []
    let IDs = []
    
    const handleInputChange = (e) => {
    
        const {name, value} = e.target
    
        setDescription(value)
    }

    const saveCard = (taskObj) => {
        let tempList = taskList
        tempList.push(taskObj)
        setTaskList(tempList)
    }

    const handleSave = (e) => {
        let issueId = Date.now()
        e.preventDefault()
        let taskObj = {}
        taskObj['Title'] = title
        taskObj['Description'] = description
        taskObj['Priority'] = priority
        saveCard(taskObj) 
        getIDs()
        if(snapshot.Role === 'Tester'){
            getAdminId()
            notificationDoc(taskObj, issueId);
        }
        else{
            ticketDocument(taskObj, issueId)
            assignTicket(taskObj, issueId)
        }
        setForm(false)
        setTitle('')
        setDescription('')
    }

    async function notificationDoc(taskObj, issueId){
        await firebase.createNotificationTicketDoc(adminId, taskObj.Title, taskObj.Description, taskObj.Priority, issueId)
    }

    async function assignTicket(taskObj, issueId){
        if(snapshot.Role === 'Admin'){
            for(let i=0; i<IDs.length; ++i){
                await firebase.createTicketDoc(IDs[i], taskObj.Title, taskObj.Description, taskObj.Priority, issueId)
            }
        }else if(snapshot.Role === 'Tester'){
            getAdminId()
            await firebase.createTicketDoc(adminId, taskObj.Title, taskObj.Description, taskObj.Priority, issueId)
        }
      }    
    function getIDs(){
        allUser.map((user) => {
            if(selected.includes(user.Name)){
                console.log(user.id)
                IDs.push(user.id)
            }
        })
        console.log(IDs)
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
        setSelected(selected)
    }

    useEffect( async () => {
        let response1 = []
        await firebase.db.collection('projects').doc(currentUserId).collection('MyTickets').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) =>{
                let temp = doc.data();
                temp['id'] =  `${doc.id}`
                response1.push(temp)
            })
            setTicketData(response1)
        })
    }, [ticketData])

    function getAdminId(){
        allUser.map((user) => {
            if(user.Role === 'Admin'){
                console.log(user.id)
                setAdminId(user.id)
            }
        })
    }
    let response = []
    async function ticketDocument(taskObj, issueId){
        await firebase.createTicketDoc(currentUserId, taskObj.Title, taskObj.Description, taskObj.Priority, issueId);
        await firebase.db.collection('projects').doc(currentUserId).collection('MyTickets').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) =>{
                response.push(doc.data())
            })
            setData(response)
        })
        let response1 = []
        await firebase.db.collection('projects').doc(currentUserId).collection('MyTickets').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) =>{
                response1.push(doc.data())
            })
            setTicketData(response1)
        })
    }

    function handleEditData(obj){
        setEditData(obj)
        setEditForm(true)
    }

    return (
        <>
        <Dialog open={openForm} maxWidth="md" classes={ {paper: classes.dialogWrapper} } onClose={handleClose}>
            <DialogTitle style={{
                display:"flex",
                justifyContent:"center",
            }}>
                <h1>Issue Details</h1>
            </DialogTitle>
            <Divider style={{
                    backgroundColor: "#111",
                }}/>
            <DialogContent style={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"start",
            }}> 
           
                <form style={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"start",
                    width:"100%",
                    padding:"20px",
                }}>
                    <div style={
                        {
                            display:"flex",
                            flexDirection:"column",
                            justifyContent:"center",
                            paddingTop:"20px",
                        }
                    }>
        <b><p>Project</p></b>
        <Select  style={{
                            padding:"2px",
                            width:"100%",
                        }}
                        defaultValue="Select Role"
                        onChange={(e) => setTitle(e.target.value)}
                        // ref={selectInputRef}
                        required>
                        {
                            data.map((proj) => (
                                
                                    <MenuItem value={proj.Title}>{proj.Title}</MenuItem>
                                
                            ))
                        }
            </Select>
         
     <TextField id="outlined" label="Issue Description" value={description} name="description"  onChange={handleInputChange} style={{
                        color:"#111",
                        marginTop:"20px",
                    }}/> 
      <b><p style={{
            marginTop:"30px",
        }}>Priority</p></b>              
            <Select  style={{
                            padding:"2px",
                            width:"100%",
                        }}
                        defaultValue="Select Role"
                        onChange={(e) => setPriority(e.target.value)}
                        required>
                            <MenuItem value="Low">Low</MenuItem> 
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>            
            </Select> <br/>
            {
                snapshot.Role === 'Admin' ? <div style={
                    {
                        fontFamily:"font-family: 'Roboto', sans-serif",
                        marginTop:"10px",
                    }
                }>
                    <b>Assign Developer</b><br/>
                    {
                        allUser.map((user) => 
                            user.Role !== 'Admin' ? <FormControlLabel
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
                
         </div> : <div style={
                    {
                        fontFamily:"font-family: 'Roboto', sans-serif",
                        marginTop:"10px",
                    }
                }>
                    <b>Report to Admin</b><br/>
                    {
                        allUser.map((user) => 
                        user.Role === 'Admin' ? <FormControlLabel
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
         </div>
    }                                                        
                    <Button style={{
                            marginTop:"20px",
                            color:"#deeaee",
                            backgroundColor:"#111",
                            borderRadius:"0px",
                        }} onClick={handleSave}>Submit</Button>
                
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <TableContainer component={Paper} style={{
             borderRadius:"0px",
         }}>
      <Table className={classes.table} aria-label="simple table" style={{
          borderRadius:"0px",
          overflow:"hidden",
      }}>
        <TableHead style={{
            width:"100%",
        }}>
          <TableRow style={{
              backgroundColor:"orange",
          }}>
            <TableCell align="left">PROJECT TITLE</TableCell>
            <TableCell align="left" >ISSUE</TableCell>
            <TableCell align="left">REPORT DATE</TableCell>
            <TableCell align="left">STATUS</TableCell>
             <TableCell align="start">PRIORITY</TableCell>
            <TableCell align="start">ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{
        }}>
          {ticketData.map((row) => (
            <TableRow>
              <TableCell style={{
                border:"2px #ddd solid",
            }} align="left">{row.Title.toUpperCase()}</TableCell>
              <TableCell align="left" style={{
                border:"2px #ddd solid",
            }}>{row.Description.toUpperCase()}</TableCell>
              <TableCell align="left" style={{
                border:"2px #ddd solid",
            }}>{moment(row.ProjectDate.toDate()).format('DD-MM-YYYY')}</TableCell>
              <TableCell align="left" style={{
                border:"2px #ddd solid",
            }}>
                {
                    row.Status !=='INPROGRESS' ? <FaIcons.FaCheck/> :"INPROGRESS"
                }
            </TableCell>
             <TableCell align="left" style={{
                border:"2px #ddd solid",
            }}>{row.Priority.toUpperCase()}</TableCell>
              <TableCell align="left" style={{
                border:"2px #ddd solid",
            }}>
                  <Button variant="outlined" style={{
                      backgroundColor:"#111",
                      color:"#fff",
                      borderRadius:"0px",
                      padding:"0px",
                  }} onClick={() => handleEditData(row)} disabled={snapshot.Role==='Admin' ? true : false}>EDIT</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>     
    <EditIssueForm
       openEditForm = {openEditForm}
       setEditForm = {setEditForm}
       allUser = {allUser}
       snapshot = {snapshot}
       currentUserId = {currentUserId}
       editData = {editData}
       setData = {setData}
       ticketData = {ticketData}
    />   
</>
    )
}
