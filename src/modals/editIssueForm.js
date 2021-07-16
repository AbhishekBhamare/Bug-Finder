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


export default function EditIssueForm(props) {
    const { openEditForm, setEditForm, allUser, snapshot, currentUserId, editData, setTicketData, ticketData} = props;

    const classes = useStyles();

    const [title, setTitle] = useState(editData.Title)
    const [description, setDescription] = useState(editData.Description)
    const [selected, setSelected] = useState([]);
    const [status, setStatus] = useState('')
    const [priority, setPriority] = useState('')

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
        // console.log(selected)
        setSelected(selected)
    }

    const handleInputChange = (e) => {
    
        const {name, value} = e.target
        setDescription(value)
    }

    function handleClose() {
        setEditForm(false);
        setSelected([])
        setTitle('')
        setDescription('')
        setPriority('')
    }

    const handleSave = (e) => {
        e.preventDefault()
      
        getIDS();
        // console.log(IDs)
        updateData();
        assignTicket();
        setSelected([])
    }
    let IDs = []
    function getIDS(){
        allUser.map((user) => {
            if(selected.includes(user.Name)){
                IDs.push(user.id)
            }
        })
        // console.log(IDs)
    }
    async function updateData(){
        console.log("neeeeeeeeeeeeeeeeeeee",currentUserId, editData.Title, description, priority, status, editData.id);
        await firebase.updateTicketDoc(currentUserId, editData.Title, description, priority, status, editData.id);
        setEditForm(false)
    }

    async function  assignTicket(){
        for(let i=0; i<IDs.length; ++i){
        // console.log("updateDataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",IDs[i], editData.Title, description, status, editData.id)
        await firebase.updateTicketDoc(IDs[i], editData.Title, description, priority,status, editData.id);
        }
    }
    console.log(selected);
    return (
        <>
          <Dialog open={openEditForm} maxWidth="md" classes={ {paper: classes.dialogWrapper}} onClose={handleClose}>
            <DialogTitle style={{
                display:"flex",
                justifyContent:"center",
            }}>
                <h1>Edit Ticket</h1>
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
                    // height:"450px",
                }}>
                    <TextField id="outlined-basic" label="Project Title" value={editData.Title} defaultValue={editData.Title} name="title" style={{
                        color:"#111",
                    }}/>
                    <TextField id="outlined" label="Issue" value={description}  name="description" default={editData.Description} onChange={handleInputChange} style={{
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
                         <b>Priority</b>
                        <Select  style={{
                            padding:"2px",
                            width:"100%",
                        }}
                        defaultValue="Select Role"
                        onChange={(e) => setPriority(e.target.value)}
                        // ref={selectInputRef}
                        required>
                            <MenuItem value="Low">Low</MenuItem> 
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>            
            </Select> <br/><br/>
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
                                    />
                                }
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
                        // ref={selectInputRef}
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
