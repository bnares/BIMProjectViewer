import React from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import ProjectCard from './ProjectCard';
import agent from "../../api/agent";
import { Project } from '../classes/Project';

function HomePage() {
    const [projects, setProjects] = React.useState(Project[{name:"Piotre", description:"des", status:'active', useRole: "architect", finishData:"2024-12-34",progress:34,cost:2000,id:44}]);
    React.useEffect(()=>{
        agent.project.allProject().then((resp)=>(setProjects(resp))).catch(e=>console.warn(e));
    },[])
    
  return (
    <Grid container spacing={2}>
        <Grid item xs={2} style={{backgroundColor:"var(--background-100)", height:'100vh'}}>
            <Box style={{backgroundColor:"var(--background-100)", display:"flex", justifyContent:'center', flexDirection:"column", alignItems:'center'}}>
                <Tooltip title="Viewer">
                    <IconButton color='primary' size='large'>
                        <EngineeringIcon sx={{fontSize:'2rem'}}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Account">
                    <IconButton color='primary' size='large' >
                        <PersonIcon sx={{fontSize:'2rem'}}/>
                    </IconButton>
                </Tooltip>
            </Box>
        </Grid>
        <Grid item xs={10}>
            {(projects && projects.length > 0 ) ? 
                <Grid container spacing={1}>
                    {(projects.map((item : Project)=>(<Grid item xs={10} md={4} key={item.id}> <ProjectCard key={item.id} {...item}  /></Grid>)))}
                </Grid>
            : <h1>LOading...</h1>}
            
        </Grid>

    </Grid>
  )
}

export default HomePage