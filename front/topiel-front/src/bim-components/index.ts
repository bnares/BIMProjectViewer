import * as OBC from "openbim-components"
import * as THREE from "three"
import { TaskCard } from "./src/TaskCard";
import { FileImageInput } from "./fileUpload";
import agent from "../../api/agent";
import { downloadedToDo } from "../react-component/IFCViewer";
import { Project } from "../classes/Project";


export type ToDoPriority = "Low" | "Medium" | "High";

export interface Task{
    projectId: number,
    description: string,
    priority: ToDoPriority,
    date: Date,
    camera: {position: THREE.Vector3, target: THREE.Vector3},
    fragmentMap: OBC.FragmentIdMap,
}

interface FormData{
    
    description: string,
    priority: ToDoPriority,
}

interface cameraDownloaded{
    position:{
        X:number,
        Y:number,
        Z:number,
    },
    target:{
        X:number,
        Y:number,
        Z:number,
    }
}

export class AsignTask extends OBC.Component<Task[]> implements OBC.UI{
    static uuid : string = "cdaa024e-9aa2-4277-9f7f-139a834ce274";
    enabled: boolean = true;
    private _taskList: Task[] = [];
    private _projectId: number;
    private _projectData: Project;
    private _errorListComponents: OBC.SimpleUIComponent[] = [];
    private _userList = [{id:1, name:"Piotr Ostrouch", role: "Engineer"}, {id:2, name:"Jan Kowalski", role:"Construction Manager"}, {id:3, name:"Adam Dobry", role:"Owner"}]
    uiElement = new  OBC.UIElement<{
        activationButton: OBC.Button,
        taskList: OBC.FloatingWindow
    }>();
    private _components : OBC.Components;

    constructor(components : OBC.Components, projectId:number, project:Project){
        super(components);
        this._components = components;
        this._components.tools.add(AsignTask.uuid,this);
        this._projectId = projectId;
        this._projectData = project;
        this.SetUI();
    }

    loadTaskFromDb = async (fragmentMapCreated: any, cameraCreated:any,todoDownloaded: downloadedToDo)=>{
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter);
        const task: Task = {
            description: todoDownloaded.description,
            date: new Date(todoDownloaded.date),
            projectId: todoDownloaded.projectId,
            fragmentMap: fragmentMapCreated,
            camera: cameraCreated,
            priority: todoDownloaded.priority as ToDoPriority,
        }

        this._taskList.push(task);
        var taskCard = new TaskCard(this._components);
        taskCard.description = task.description;
        taskCard.date = task.date;
        taskCard.priority = task.priority;
        taskCard.user = this._projectData.name;
        this.uiElement.get("taskList").addChild(taskCard);
        taskCard.cardUIClicked.add(()=>{
            if(!(this._components.camera instanceof OBC.OrthoPerspectiveCamera)){
                throw new Error("This is not orthoperspective camera");
            }
            this._components.camera.controls.setLookAt(
                cameraCreated.position.x,
                cameraCreated.position.y,
                cameraCreated.position.z,
                cameraCreated.target.x,
                cameraCreated.target.y,
                cameraCreated.target.z,
                true,
            )
            
            var fragmentMap = fragmentMapCreated as OBC.FragmentIdMap;
            const fragmentMapLength = [Object.keys(fragmentMap)].length;
            if(fragmentMapLength==0) return;
            highlighter.highlightByID("select",task.fragmentMap);
        })
    }

    addTask = async (data : FormData)=>{
        var highlighter = await this._components.tools.get(OBC.FragmentHighlighter);
        const camera = this._components.camera;
        if(!(camera instanceof OBC.OrthoPerspectiveCamera)){
            throw new Error("This is not orthoperspective camera");
        }
        const position = new THREE.Vector3();
        camera.controls.getPosition(position);
        const target = new THREE.Vector3();
        camera.controls.getTarget(target);

        const task : Task = {
            description: data.description,
            priority: data.priority,
            date: new Date(),
            projectId: this._projectId,
            fragmentMap : highlighter.selection.select,
            camera: {position, target}
        }

        var dataToSend = {
            description: data.description,
            priority: data.priority,
            date: new Date().toDateString(),
            projectId: this._projectId,
            fragmentMap : JSON.stringify(task.fragmentMap),
            camera: JSON.stringify({position, target}),

        }

        var indexData = "";
        for(var item of Object.values(task.fragmentMap)){
            for(var index of item){
                indexData +=index+", ";
            }
        }

        dataToSend = {...dataToSend, fragmentMap:indexData}
        this._taskList.push(task);
        await agent.todo.addToDo(dataToSend).catch(e=>console.warn(e));
        
        const taskCard = new TaskCard(this._components);
        taskCard.description = task.description;
        taskCard.date = task.date;
        taskCard.priority = task.priority;
        taskCard.user = this._projectData.name;
        this.uiElement.get("taskList").addChild(taskCard);
        taskCard.cardUIClicked.add(()=>{
            camera.controls.setLookAt(
                task.camera.position.x,
                task.camera.position.y,
                task.camera.position.z,
                task.camera.target.x,
                task.camera.target.y,
                task.camera.target.z,
                true
            );
            const fragmentMapLength = [Object.keys(task.fragmentMap)].length;
            if(fragmentMapLength==0) return;
            highlighter.highlightByID("select", task.fragmentMap);
            
        })

    }

    private setBg = () => {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
         return "#" + randomColor;
        
      }

    async setup(){
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter);
        const priorityData = ["Low", "Normal", "High"];

        // for(var user of this._userList){
        //     highlighter.add(`${AsignTask.uuid}-${user.name}`, [new THREE.MeshStandardMaterial({color:this.setBg()})])
        // }
        for(var priority of priorityData){
            console.log('filter name: ',priority+" "+this._projectData.name);
            highlighter.add(`${AsignTask.uuid}-priority-${priority}-${this._projectData.name}`,[new THREE.MeshStandardMaterial({color:this.setBg()})])
        }
    }

    private SetUI =()=>{
        const priorityData = ["Low", "Normal", "High"];
        const activationButton = new OBC.Button(this._components);
        activationButton.materialIcon="add_task";
        activationButton.tooltip = "Task";

        const newTaskBtn = new OBC.Button(this._components,{name:"Add"});
        activationButton.addChild(newTaskBtn);

        const taskListBtn = new OBC.Button(this._components,{name:"List"});
        activationButton.addChild(taskListBtn);

        const taskList = new OBC.FloatingWindow(this._components);
        taskList.title = "Task List";
        taskList.visible = false;
        this._components.ui.add(taskList);

        const colorizeUI = new OBC.SimpleUIComponent(this._components);
        taskList.addChild(colorizeUI);
        
        const colorizeByPriorityBtn = new OBC.Button(this._components);
        colorizeByPriorityBtn.tooltip = "Colorize By Priority";
        colorizeByPriorityBtn.materialIcon="format_color_fill";
        colorizeUI.addChild(colorizeByPriorityBtn);
        

        colorizeByPriorityBtn.onClick.add(async ()=>{
            colorizeByPriorityBtn.active = !colorizeByPriorityBtn.active;
            const highlighter = await this._components.tools.get(OBC.FragmentHighlighter);

            if(colorizeByPriorityBtn.active){
                for(var task of this._taskList){
                    const fragmentMapLength = Object.keys(task.fragmentMap).length;
                    if(fragmentMapLength==0) continue;
                    highlighter.highlightByID(`${AsignTask.uuid}-priority-${task.priority}`,task.fragmentMap); 
                }
            }else{
                for(var priority of priorityData){
                    highlighter.clear(`${AsignTask.uuid}-priority-${priority}`)
                }
                
            }
        })

        taskListBtn.onClick.add(()=>{
            taskList.active = !taskList.active;
            taskList.visible = true;
        })

        this.uiElement.set({
            activationButton,
            taskList
        });

        const addTaskForm = new OBC.Modal(this._components);
        
        addTaskForm.title = "ADD TASK";
        addTaskForm.visible = false;
        this._components.ui.add(addTaskForm);

        addTaskForm.slots.content.get().style.padding="20px";
        addTaskForm.slots.content.get().style.display="flex";
        addTaskForm.slots.content.get().style.flexDirection="column";
        addTaskForm.slots.content.get().style.rowGap="10px";

        const test= new FileImageInput(this._components);
        addTaskForm.slots.content.addChild(test);

        var pdfBtn = new OBC.Button(this._components);
        pdfBtn.materialIcon="picture_as_pdf";
        addTaskForm.slots.content.addChild(pdfBtn);

        pdfBtn.onClick.add(()=>{
            window.open(".\\public\\pdf\\krew.pdf","_blank");
            
        })

        const description = new OBC.TextArea(this._components);
        description.label = "Description";
        addTaskForm.slots.content.addChild(description);

        const priorityDropdown = new OBC.Dropdown(this._components);
        priorityDropdown.label = "Priority";
        const priosityData = ["Low", "Normal", "High"];
        for(var item of priosityData){
            priorityDropdown.addOption(item);
        }
        priorityDropdown.value = priosityData[0];
        addTaskForm.slots.content.addChild(priorityDropdown);

        newTaskBtn.onClick.add(()=>{
            newTaskBtn.active = !newTaskBtn.active;
            addTaskForm.visible = newTaskBtn.active;
        })

        addTaskForm.onCancel.add(()=>{
            this._errorListComponents = [];
            newTaskBtn.active = false;
            addTaskForm.visible = false;
            taskList.active = false;
            taskList.visible = false;
        })

        addTaskForm.onAccept.add(()=>{
            if(this._errorListComponents.length>0){
                addTaskForm.removeChild(this._errorListComponents[0]);
            }
            
            this._errorListComponents = [];
            
            var data = {
                description: description.value,
                name : this._projectId,
                priority: priorityDropdown.value
            }
            if(data.description == null || data.description == undefined || data.description==""){
                console.log("inside error if")
                var errorText = `<div id='errorElem' class='errorMsg'>Fill in Description</div>`
                var errorComponent = new OBC.SimpleUIComponent(this._components,errorText);
                errorComponent.visible = true;
                addTaskForm.slots.content.addChild(errorComponent);
                this._errorListComponents.push(errorComponent);
                
            }
           
            const formData : FormData = {
                description: data.description,
                priority: data.priority as ToDoPriority,
            }
            this.addTask(formData);
            
            newTaskBtn.active = false;
            addTaskForm.visible = false;
            taskList.active = false;
            taskList.visible = false;
            
        })

    }

    get(): Task[] {
        return this._taskList;
    }
    
    

}