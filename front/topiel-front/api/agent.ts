import axios, {AxiosError, AxiosResponse} from "axios";
import {router} from "../src/routes/Routes";
import {toast} from "react-toastify";
import { Task } from "../src/bim-components";

axios.defaults.baseURL = "https://localhost:7131/api/";

const responseBody = (response : AxiosResponse)=> response.data;

const request = {
    get: (url: string)=>axios.get(url).then(responseBody),
    post: (url: string, body: {})=>axios.post(url, body).then(responseBody),
    delete: (url: string)=> axios.delete(url).then(responseBody)
}

// axios.interceptors.response.use(async response =>{
//     console.log("interceptors axios reposne: ",response);
//     return response;
// },(error: AxiosError)=>{
//     const {data, status} = error.response! as AxiosResponse;
//     console.log("axios interceptors: ", error);
//     switch(status){
//         case 400:
//             if(data.errors){
//                 const modelStateErrors: string[] = [];
//                 for(const key in data.errors){
//                     if(data.errors[key]){
//                         modelStateErrors.push(data.errors[key]);
//                     }
//                 }
//                 toast.error(modelStateErrors.flat()[0]);
//                 throw modelStateErrors.flat();
//             }
//             toast.error(data.title);
//             break;
//         case 401:
//             toast.error(data.title);
//             break;
//         case 403:
//             toast.error("You are not allowed to do that");
//             break;
//         case 500:
//             router.navigate("/server-error",{state:{error:data}});
//             toast.error(data.title);
//             break;
//         default:
//             break;
//     }
//     console.log("error interceptors: ", error);
//     return Promise.reject(error.response);
// })

const project = {
    allProject: ()=>request.get("Project/allProjects"),
    getProject: (id:number)=>request.get(`Project/getProject/${id}`),
    addProject: (data:any)=>request.post("Project/newProject",data)

}

const todo = {
    addToDo: (data:{}) => request.post("ToDo/addNewToDo",data),
    getAllModelToDo: ((id: number)=>request.get(`ToDo/allToDo/${id}`)),
}

const agent = {
    project,
    todo,
}

export default agent;

