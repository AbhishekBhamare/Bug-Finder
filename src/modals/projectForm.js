import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Divider, TextField, makeStyles } from '@material-ui/core'
import firebase from '../components/firebase'
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
import EditProjectForm from './editProject';
import '../App.css'

const useStyles = makeStyles(theme =>({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        tap: theme.spacing(5),
        width: "50%",
        height:'60%',
    }
}))

export default function ProjectForm(props) {
    const { openForm, setForm, allUser, snapshot, currentUserId, data, setData} = props;
    const classes = useStyles();
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [taskList, setTaskList] = useState([])
    const [selected, setSelected] = useState([]);
    const [editData, setEditData] = useState({});
    const [openEditForm, setEditForm] = useState(false)

    let temp = []
    let array = {}, map = [], options = {}

    const handleInputChange = (e) => {
    
        const {name, value} = e.target

        if(name === "title"){
            setTitle(value)
        }else{
            setDescription(value)
        }
    }

    const saveCard = (taskObj) => {
        let tempList = taskList
        tempList.push(taskObj)
        setTaskList(tempList)
    }

    const handleSave = (e) => {
        let projId = Date.now()
        e.preventDefault()
        let taskObj = {}
        taskObj['Title'] = title
        taskObj['Description'] = description
        saveCard(taskObj)
        setSelected(temp)
        getIDs()
        projectDocument(taskObj, projId)
        assignProj(taskObj, projId)
        setForm(false)
    }
    let IDs = []

    async function assignProj(taskObj, projId){
        for(let i=0; i<IDs.length; ++i){
            await firebase.createProjectDoc(IDs[i], taskObj.Title, taskObj.Description, projId)
        }
      }
    let response = []
    
    function getIDs(){
        allUser.map((user) => {
            if(selected.includes(user.Name)){
                IDs.push(user.id)
            }
        })
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

    useEffect(() => {
        let reponse = []
        firebase.db.collection('projects').doc(currentUserId).collection('MyProjects').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let temp = doc.data();
                temp['id'] =  `${doc.id}`
                reponse.push(temp)
            });
            setData(reponse)
        })
    }, [data])
    async function projectDocument(taskObj, projId){
        await firebase.createProjectDoc(currentUserId, taskObj.Title, taskObj.Description, projId);
        await firebase.db.collection('projects').doc(currentUserId).collection('MyProjects').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) =>{
                response.push(doc.data())
                console.log("proj",doc.data());
            })
            setData(response)
        })
    }
    function handleEditData(obj){
        setEditData(obj)
        setEditForm(true)
    }
  
    function handleClose() {
        setForm(false);
        setSelected('')
      }
    
    allUser.map((user) => {
        if(user.Role !== 'Admin'){
            let x = user.Name
            map.push({x});
        }
    })

    return (
        <>
        <Dialog open={openForm} maxWidth="md" classes={ {paper: classes.dialogWrapper} } onClose={handleClose}>
            <DialogTitle style={{
                display:"flex",
                justifyContent:"center",
            }}>
                <h1>Add New Project</h1>
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
                    <TextField id="outlined-basic" label="Project Title" value={title} name="title" onChange={handleInputChange} style={{
                        color:"#111",
                    }}/>
                    <TextField id="outlined" label="Project Description" value={description} name="description" onChange={handleInputChange} style={{
                        color:"#111",
                        marginTop:"20px",
                    }}/>
                    <div style={
                        {
                            display:"flex",
                            flexDirection:"column",
                            justifyContent:"center",
                            paddingTop:"20px",
                        }
                    }>
                    <div style={
                        {
                            fontFamily:"font-family: 'Roboto', sans-serif",
                        }
                    }>
                        <b>Assign Developer</b><br/>
                        {
                            allUser.map((user) => 
                                user.Role !== 'Admin' && user.Role !=='Tester' ? <FormControlLabel
                                control={<Checkbox  
                                value={user.Name} 
                                onChange={(e) => 
                                    !selected.includes(e.target.value) ? setSelected([...selected, e.target.value])
                                    : remove(e.target.value)  }/>}
                                label={user.Name}
                              /> : ''
                            )
                        }
                        <br/><br/><b>Assign Tester</b><br/>
                        {
                            allUser.map((user) => 
                                user.Role ==='Tester' ? <FormControlLabel
                                control={<Checkbox  
                                value={user.Name} 
                                onChange={(e) => 
                                    !selected.includes(e.target.value) ? setSelected([...selected, e.target.value])
                                    : remove(e.target.value)  }/>}
                                label={user.Name}
                              /> : ''
                            )
                        }
                    </div>                                              
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
            <TableCell align="left" >DESCRIPTION</TableCell>
            <TableCell align="left">REPORT DATE</TableCell>
            <TableCell align="left">STATUS</TableCell>
            <TableCell align="start">ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{
        }}>
          {data.map((row) => (
            <TableRow>
              <TableCell style={{

                border:"2px #ddd solid",
            }} align="left">{(row.Title).toUpperCase()}</TableCell>
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
                    row.Status !== 'INPROGRESS' ? <FaIcons.FaCheck/> :"INPROGRESS"
                }
            </TableCell>
            <TableCell align="left" style={{
                border:"2px #ddd solid",
            }}>
                  <Button variant="outlined" style={{
                      backgroundColor:"#111",
                      color:"#fff",
                      borderRadius:"0px",
                      padding:"0px",
                  }} onClick={() => handleEditData(row)}>EDIT</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <EditProjectForm 
      openEditForm = {openEditForm}
      setEditForm = {setEditForm}
      allUser = {allUser}
      snapshot = {snapshot}
      currentUserId = {currentUserId}
      editData = {editData}
      setData = {setData}
      data = {data}
    />
    </>
    )
}
