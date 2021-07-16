import React,{ useState, useEffect } from 'react'
import { Button  } from "@material-ui/core";
import { Add } from "@material-ui/icons"
import '../component.css'
import ProjectForm from '../modals/projectForm';
import firebase from './firebase';


function MyProject({allUser, snapshot, currentUserId}) {
    // console.log("myu",allUser)


    const [currentUser, setCurrentUser] = useState(snapshot.Role)
    const [openForm, setForm] = useState(false)
    const [data, setData] = useState([])
    let response = []
    useEffect(() => {
        // console.log("wefbra;sibvriubvrwiuabviruvbr eiubrsvirobnreoibriobreioe")
        const loadProject= async () => {
            try{
                await firebase.db.collection('projects').doc(currentUserId).collection('MyProjects').get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) =>{
                        response.push(doc.data())
                        // console.log("proj",doc.data());

                    })
                    setData(response)
                })
                // console.log("res",response)
            }catch(e){
                // console.log(e.messege);
            }
        }
        loadProject()
    }, []);

    
    // console.log("dataaaaaaaaaaaaaaaa", data)
    return (
        <>
           <div style={{
            display:"flex",
            flexDirection:"column",
            // border:"black solid",
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
                    // border:"black solid",
                    padding:"10px",
                }}><h1 style={{
                    margin:"25px",
                }}>MY PROJECTS</h1>
                
               { currentUser === 'Admin' ? <Button className="btn" style={{
                    backgroundColor:"#111",
                    color:"#deeaee",
                    borderRadius:"0px",       
                    display:"flex",
                    alignItems:"center",             
                }} onClick={() => setForm(true)}> <Add/> Create New Project</Button>: '' } 
                    
                </div>
           </div>
           <div style={{
            //    border:"1px black solid",
               margin:"4px 4px",
               backgroundColor:"#fff",
               width:"100%",
               height: "auto",
               maxHeight:"400px",
               overflowX:"hidden",
               overflowY:"auto",
           }}>
                <ProjectForm
                    openForm = {openForm}
                    setForm = {setForm}
                    allUser = {allUser}
                    snapshot = {snapshot}
                    currentUserId = {currentUserId}
                    data = {data}
                    setData = {setData}
                /> 
           </div>
        </div>
    </>   
    )
}

export default MyProject