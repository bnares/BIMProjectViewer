import React from 'react'
import * as OBC from "openbim-components";
import { FragmentsGroup } from 'bim-fragment';
//import { TodoCreator } from '../bim-components/TodoCreator';
import { AsignTask } from '../bim-components';
import { useNavigate, useParams } from 'react-router-dom';
import agent from '../../api/agent';
import * as THREE from "three"
import { Project } from '../classes/Project';

interface IViewerContext{
    viewer: OBC.Components | null,
    setViewer: (viewer: OBC.Components | null)=>void,
}

export interface downloadedToDo {
    camera: string,
    date: string,
    description: string,
    id: number,
    priority: string,
    fragmentMap: string,
    projectId: number,
    project: any,
}

export const ViewerContext = React.createContext<IViewerContext>({
    viewer: null,
    setViewer: ()=>{}
})

export function ViewerProvider(props: {children: React.ReactNode}){
    const [viewer, setViewer] = React.useState<OBC.Components | null>(null);
    return (
        <ViewerContext.Provider value={{viewer, setViewer}}>
            {props.children}
        </ViewerContext.Provider>
    )
}


export function IFCViewer(props: Project){
    const {setViewer} = React.useContext(ViewerContext);
    const {id} = useParams();
    const navigate = useNavigate();
    let viewer : OBC.Components;

    console.log("props: ",props);

    const createViewer = async ()=>{
        viewer = new OBC.Components();
        setViewer(viewer);
        const sceneComponent = new OBC.SimpleScene(viewer);
        sceneComponent.setup();
        viewer.scene = sceneComponent;
        const scene = sceneComponent.get();
        scene.background = null;

        const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement;
        const rendereComponent = new OBC.PostproductionRenderer(viewer, viewerContainer);
        viewer.renderer = rendereComponent;

        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
        viewer.camera = cameraComponent;

        const raycasterCompoent = new OBC.SimpleRaycaster(viewer);
        viewer.raycaster = raycasterCompoent;

        viewer.init();
        cameraComponent.updateAspect();
        rendereComponent.postproduction.enabled = true;

        const fragmentManager = new OBC.FragmentManager(viewer);

        const exportFragments = (model: FragmentsGroup)=>{
            const fragmentBinary = fragmentManager.export(model);
            const blob = new Blob([fragmentBinary]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${model.name.replace(".ifc","")}.frag`;
            a.click();
            URL.revokeObjectURL(url);
        }

        const highlighter = new OBC.FragmentHighlighter(viewer);
        highlighter.setup();

        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);

        const taskItem = new AsignTask(viewer, Number(id), props);
        taskItem.setup();

        const createFragmentMapFromDownladedTodo = (model : FragmentsGroup, todo: downloadedToDo)=>{
            var fragmentMap : any = {};
            for(var taskExpressIdDownloaded of todo.fragmentMap.split(", ").filter(x=>x.length!=0)){
                for(var item of model.items){
                    var fragmentIdModel = item.id;
                    for(var expressIDsModel of item.items){
                        if(taskExpressIdDownloaded == expressIDsModel){
                            if(Object.keys(fragmentMap).includes(fragmentIdModel)){
                                var addedData = fragmentMap[fragmentIdModel];
                                //addedData.push(taskExpressIdDownloaded);
                                addedData.add(taskExpressIdDownloaded);
                                var newFragmentMap = {...fragmentMap, fragmentIdModel: addedData};
                                fragmentMap = newFragmentMap;
                            }else{
                                //fragmentMap[fragmentIdModel] = [taskExpressIdDownloaded];
                                fragmentMap[fragmentIdModel] = new Set([taskExpressIdDownloaded]);
                            }
                        }
                    }
                }
            }
            if(Object.keys(fragmentMap).includes("fragmentIdModel")){
                delete fragmentMap["fragmentIdModel"];
            }
            return fragmentMap; 
        }

        const createCameraPositionFromDwonloadedToDo=(cameraDownloaded: string)=>{
            
            if(!(viewer.camera instanceof OBC.OrthoPerspectiveCamera) ){
                throw new Error("This is not orthoperspective camera");
            }
            var camera = JSON.parse(cameraDownloaded);
            var position = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
            var target = new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z);
            return {position, target};
        }

        const onModelLoaded = async (model : FragmentsGroup)=>{
            console.log(model);
            highlighter.update();
            propertiesProcessor.process(model);
            highlighter.events.select.onHighlight.add((fragmentMap)=>{
                const expressID = [...Object.values(fragmentMap)[0]][0];
                propertiesProcessor.renderProperties(model, Number(expressID));
            })
            
            if(id){
                const todo :downloadedToDo[] = await agent.todo.getAllModelToDo(Number.parseInt(id));
                for(var item  of todo){
                    
                    var fragmentMapCreated = createFragmentMapFromDownladedTodo(model,item);
                    var cameraCreated =  createCameraPositionFromDwonloadedToDo(item.camera);
                    await taskItem.loadTaskFromDb(fragmentMapCreated,cameraCreated,item);
                }
                
            }else{
                navigate("/not-found");
            }
            
        }

        

        const ifcLoader = new OBC.FragmentIfcLoader(viewer);
        ifcLoader.settings.wasm = {
            path: "https://unpkg.com/web-ifc@0.0.43/",
            absolute: true
        }

        ifcLoader.onIfcLoaded.add(async (model)=>{
            onModelLoaded(model);
        });

        
        //var test = ifcLoader.uiElement.get("main").get().click();
        const toolbar = new OBC.Toolbar(viewer);
        toolbar.addChild(
            ifcLoader.uiElement.get("main"),
            propertiesProcessor.uiElement.get("main"),
            taskItem.uiElement.get("activationButton"),
        )
        viewer.ui.addToolbar(toolbar);
    }

    React.useEffect(()=>{
        createViewer();
        return ()=>{
            viewer.dispose();
            setViewer(null);
        }
    },[])

    return(
    <div
      id="viewer-container"
      className="dashboard-card"
      style={{ minWidth: 0, position: "relative" }}
    >
       
    </div>
    )
}