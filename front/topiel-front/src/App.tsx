import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App(){

    return(
        <>
            <ToastContainer position='bottom-right' theme='colored' hideProgressBar/>
            <CssBaseline />
            <Outlet />
        </>
    )
}

export default App;