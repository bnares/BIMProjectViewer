import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
import ProjectPage from './react-component/ProjectPage.tsx'
import * as Router from "react-router-dom"
import HomePage from './react-component/HomePage.tsx'
import { router } from './routes/Routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Router.BrowserRouter>
      <Router.Routes>
        <Router.Route path='/' element={<HomePage />}></Router.Route>
        <Router.Route path='/projects' element={<ProjectPage />}></Router.Route>
      </Router.Routes>
    </Router.BrowserRouter> */}
    <Router.RouterProvider router={router} />
    
  </React.StrictMode>,
)
