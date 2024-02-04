import React from 'react'
import { Project } from '../classes/Project'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function BasicInfo(props: Project) {

  return (
    <Card sx={{ minWidth: 50 }}>
      <CardContent>
        <Typography variant="h5" component="div">
         {props.name.toUpperCase()}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <b>Date: </b>{props.finishDate}<b />
        </Typography>
        <Typography variant="body2">
          <b>Status: </b>{props.status}
          <br />
        </Typography>
        <Typography variant="body2">
          <b>Cost: </b>{props.cost}
          <br />
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BasicInfo