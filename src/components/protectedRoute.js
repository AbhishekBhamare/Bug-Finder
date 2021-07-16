import React from 'react'
// import {Redirect, Route} from 'react-router-dom'
import firebase from './firebase'
import { useHistory } from 'react-router-dom'


function ProtectedRoute(props) {
    let history = useHistory()
    let Component = props.Component;
     if(!firebase.readCookie()){
        history.push("/")
    }
    return <Component {...props} />

}

export default ProtectedRoute