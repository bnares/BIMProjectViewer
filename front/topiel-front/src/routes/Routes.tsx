import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "../react-component/HomePage";
import ProjectPage from "../react-component/ProjectPage";
import NotFound from "../react-component/NotFound";
import App from "../App";

export const router = createBrowserRouter([
    {
        path:'/',
        element: <App />,
        children:[
            {path:'', element:<HomePage />},
            {path:"/project/:id", element:<ProjectPage />},
            {path:"/not-found", element:<NotFound />},
            {path:"*", element:<Navigate replace to="/not-found" />}
        ]
    }
])