import React from 'react'
import { Divider } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

export default function Profile({snapshot}) {
    return (
        <div style={
            {
                marginTop:"100px",
                display:"flex",
                justifyContent:"center",
            }
        }>
            <Card style={{
                display:"flex",
                padding:"10px",
                flexDirection:'column',  
                backgroundColor:"ghostwhite",
                borderRadius:"0px",          
            }}>
                <div style={{
                    display:"flex",
                    justifyContent:"center",
                }}>
                <Typography style={{
                    fontSize:"30px",
                }}><b>Profile</b></Typography>
                </div>
                 <Divider style={{
                    backgroundColor: "#111",
                }}/><br/>
                <Typography  style={{
                    fontSize:"20px",
                }}><b>Name: &nbsp;</b> {snapshot.Name}</Typography>
                <Typography  style={{
                    fontSize:"20px",
                }}><b>Email:  &nbsp;</b> {snapshot.Email}</Typography>
                <Typography  style={{
                    fontSize:"20px",
                }}><b>Registration Date:  &nbsp;</b> {moment(snapshot.RegistrationDate.toDate()).format('DD-MM-YYYY')}</Typography>
                <Typography  style={{
                    fontSize:"20px",
                }}><b>Role:  &nbsp;</b> {snapshot.Role}</Typography>
            </Card>

        </div>
    )
}
