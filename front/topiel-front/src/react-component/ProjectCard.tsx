import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Project } from '../classes/Project';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { Button, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

function ProjectCard(props : Project) {
  const [fileExist, setFileExist] = React.useState(false);
  const path = "https://localhost:7131/images/";
  React.useEffect(()=>{
    
    console.log("image: ",props);
    //var file = new File(`${path}${props.ImageName}`);

  },[])
  return (
    <Card sx={{ maxWidth: '340px', minHeight:'340px', maxHeight:'380px' }}>
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          {Array.from(props.name)[0].toUpperCase()}
        </Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      }
      title={props.name.toUpperCase()}
      subheader={props.finishDate}
    />
    <CardMedia
      component="img"
      height="50%"
      image= {props.imageSrc ? props.imageSrc :"./public/vite.svg"}
      alt="Project BIM Photo"
    />
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {props.description}
      </Typography>
    </CardContent>
    <CardActions sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
      <Button component = {Link} to = {`project/${props.id}`} variant="contained" color='warning' startIcon={<ViewInArIcon fontSize='large'  sx={{fontSize:'2rem'}}/>} sx={{width:'60%'}}>View</Button>
    </CardActions>
  </Card>
  )
}

export default ProjectCard