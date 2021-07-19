import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Divider, TextField, makeStyles } from '@material-ui/core'
import firebase from '../components/firebase'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme =>({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        tap: theme.spacing(5), 
        width: "50%",
        height:'60%',
    }
}))


export default function EditProjectForm(props) {

    const { openEditForm, setEditForm, allUser, snapshot, currentUserId, editData, setData, data} = props;
    const classes = useStyles();

    const [title, setTitle] = useState(editData.Title)
    const [description, setDescription] = useState(editData.Description)
    const [selected, setSelected] = useState([]);
    const [status, setStatus] = useState('')

    function handleClose() {
        setEditForm(false);
        setSelected([])
        setTitle('')
        setDescription('')
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

    const handleInputChange = (e) => {
    
        const {name, value} = e.target

        if(name === "title"){
            setTitle(value)
        }else{
            setDescription(value)
        }
    }


    const handleSave = (e) => {
        e.preventDefault()
      
        getIDS();
        updateData();
        assignProject();
        setSelected([])
    }
    let IDs = []
    function getIDS(){
        allUser.map((user) => {
            if(selected.includes(user.Name)){
                IDs.push(user.id)
            }
        })
    }
    async function updateData(){
        await firebase.updateProjectDoc(currentUserId, title, description, status, editData.id);
        setEditForm(false)
    }

    async function  assignProject(){
        for(let i=0; i<IDs.length; ++i){
        await firebase.updateProjectDoc(IDs[i], title, description, status, editData.id);
        }
    }

    return (
        <>
            <Dialog open={openEditForm} maxWidth="md" classes={ {paper: classes.dialogWrapper}} onClose={handleClose}>
            <DialogTitle style={{
                display:"flex",
                justifyContent:"center",
            }}>
                <h1>Edit Project</h1>
            </DialogTitle>
            <Divider style={{
                    backgroundColor: "#111",
                }}/>
            <DialogContent style={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"start",
                height:"500px",
            }}> 
           
                <form style={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"start",
                    width:"100%",
                    padding:"20px",
                }}>
                    <TextField id="outlined-basic" label="Project Title" value={title} defaultValue={editData.Title} name="title" onChange={handleInputChange} style={{
                        color:"#111",
                    }}/>
                    <TextField id="outlined" label="Project Description" value={description} name="description" default={editData.Description} onChange={handleInputChange} style={{
                        color:"#111",
                        marginTop:"20px",
                    }}/><br/>
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
                                user.Role === 'Developer' ? <FormControlLabel
                                control={<Checkbox  
                                value={user.Name} 
                                onChange={(e) => 
                                    !selected.includes(e.target.value) ? setSelected([...selected, e.target.value])
                                    : remove(e.target.value)  }
                                    />}
                                label={user.Name}
                              /> : ''
                            )
                        }<br/>
                        <br/><b>Assign Tester</b><br/>
                        {
                            allUser.map((user) => 
                                user.Role === 'Tester' ? <FormControlLabel
                                control={<Checkbox  
                                value={user.Name} 
                                onChange={(e) => 
                                    !selected.includes(e.target.value) ? setSelected([...selected, e.target.value])
                                    : remove(e.target.value)  }
                                    />}
                                label={user.Name}
                              /> : ''
                            )
                        }
                    </div> 
                        <br/><b>STATUS</b>
                    <Select  style={{
                            padding:"2px",
                            width:"100%",
                        }}
                        defaultValue="Status"
                        onChange={(e) => setStatus(e.target.value)}
                        required>
                            <MenuItem value="INPROGRESS">INPROGRESS</MenuItem> 
                            <MenuItem value="COMPLETED">COMPLETED</MenuItem>       
                     </Select> <br/>                                           
                    <Button style={{
                            marginTop:"20px",
                            color:"#deeaee",
                            backgroundColor:"#111",
                            borderRadius:"0px",
                        }} onClick={handleSave} >Submit</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    )
}
