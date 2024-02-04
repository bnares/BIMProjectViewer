import { Button, Divider, Paper, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <Typography variant='h3' gutterBottom component={Paper} sx={{height:400}}>
        Oooops - We could not found what you are looking for
        <Divider />
        <Button fullWidth component = {Link} to="/dashboard"> Go back to Dashboard</Button>
    </Typography>
  )
}

export default NotFound