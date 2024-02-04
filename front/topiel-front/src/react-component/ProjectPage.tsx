import React from 'react'
import { IFCViewer } from './IFCViewer'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import App from '../App';
import AppBimBar from './AppBimBar';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '../classes/Project';
import agent from '../../api/agent';
import CircularProgress from '@mui/material/CircularProgress';
import BasicInfo from './BasicInfo';

function ProjectPage() {
  const [project, setProject] = React.useState<Project>({
    name: "",
    description: "",
    status: "pending",
    useRole: "architect",
    finishDate: "",
    cost : 0,
    progress:0,
    id:0,
  })
  var {id}  = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    if(id){
      const idProject = parseInt(id);
      agent.project.getProject(idProject).then((resp)=>{
        setProject(resp);
      }).then(()=>setLoading(false))
        .catch(e=>{console.warn(e); navigate("/not-found")})
    }else{
      navigate("/not-found");
    }
    
  },[])

  return (
    <>
        <Grid container spacing={2} >
            <Grid item xs={12}>
              <AppBimBar />
            </Grid>
            <Grid item xs={2}>
                {(loading) ? <CircularProgress color="success" /> : <BasicInfo {...project}/>}
            </Grid>
            <Grid item xs={10}>
                <div style={{height:'60%!important'}}>
                  <IFCViewer {...project}/>
                </div>
            </Grid>
        </Grid>
    </>
    
  )
}

export default ProjectPage