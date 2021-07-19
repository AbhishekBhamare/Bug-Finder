import app from "firebase/app"
import "firebase/auth"
import 'firebase/firebase-firestore'
import Cookies from 'js-cookie'

// Your web app's Firebase configuration
const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
}

class Firebase{
    constructor(){
        this.isauthenticated = false;
        app.initializeApp(config)
        this.auth = app.auth()
        this.db = app.firestore();


    }
    async register(email, password, name){
        this.isauthenticated = true;
        const { user } = await this.auth.createUserWithEmailAndPassword(email, password)
        this.auth.currentUser.updateProfile({
            displayName: name
        })
        return user
    }

    async login(email, password){
       this.isauthenticated = true
       const { user } = await this.auth.signInWithEmailAndPassword(email, password)
       return user
    }

    async logout(){
        this.isauthenticated = false;
        return await this.auth.signOut()
     }

     async createUserDoc(user, name, email) {
        
         if(!user) return;
         const userRef = this.db.collection('users').doc(user.uid).set({
             Name: name,
             Email: email,
             Role: "Developer",
             RegistrationDate: new Date(),
         }, {merge: true});
     }

     async createProjectDoc(id, title, desc, projId){
         if(!id) return;
        const userRef = this.db.collection('projects').doc(id).collection('MyProjects').doc(`${projId}`).set({
            id:projId,
            Title:title,
            Description:desc,
            Status: "INPROGRESS",
            ProjectDate: new Date(),
          }, {merge: true});
     }

     async updateProjectDoc(id, title, desc, status, issueId){
        this.db.collection('projects').doc(id).collection('MyProjects').doc(`${issueId}`).update({
            Title:title,
            Description:desc,
            Status:status,
            UpdatedOn:new Date(),
        })
     }

     async createTicketDoc(id, title, desc, priority, docId){
        if(!id) return;
       const userRef = this.db.collection('projects').doc(id).collection('MyTickets').doc(`${docId}`).set({
           id:docId,
           Title:title,
           Description:desc,
           Priority:priority,
           Status: "INPROGRESS",
           ProjectDate: new Date(),
         }, {merge: true});
    }

    async updateTicketDoc(id, title, desc,priority, status, docId){
        this.db.collection('projects').doc(id).collection('MyTickets').doc(`${docId}`).update({
            Title:title,
            Description:desc,
            Priority:priority,
            Status:status,
            UpdatedOn:new Date(),
        }, {merge: true})
     }
    async createNotificationTicketDoc(id, title, desc, priority, docId){
        if(!id) return;
        this.db.collection('projects').doc(id).collection('Notification').doc(`${docId}`).set({
            id:docId,
            Title:title,
            Description:desc,
            Priority:priority,
            Status: "INPROGRESS",
            ProjectDate: new Date(),
          }, {merge: true});

    }

    async DeleteNotificationDoc(currentUserId, id){
        this.db.collection('projects').doc(currentUserId).collection('Notification').doc(`${id}`).delete();
    }
    readCookie = () =>{
        const user = Cookies.get("user")
        if(user){
            this.isauthenticated = true
            return true
        }else{
            this.isauthenticated = false
            return false
        }
    } 

   
}

export default new Firebase()