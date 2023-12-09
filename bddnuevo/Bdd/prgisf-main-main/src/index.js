import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Ajustes from './pages/Ajustes';
import Perfil from './pages/Perfil';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import C_PActivos from './pages/C_PActivos';
import Ppasados from './pages/Ppasados';
import Login from './Login';
import Forgot from './pages/Forgot';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Header from './components/Header';
import Aside from './components/Aside';
import Footer from './components/Footer';




const Layout = () => {
  return (
    <div>
      <Header/>
      <div>
        <Aside />
        <div >
          <Outlet />
        </div>
        <Footer/>
      </div>
    </div>
  );
}; 


const RequireAuth = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user)
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (roles) {
    if (user != null){
    const userRol = user.Rol.split(",").map((role) => role.trim());
  
    const access = roles.some((role) => userRol.includes(role));
  
    if (!access) {
      return <Navigate to="/" />;
    }
  }
  }
  return children;
};

//const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) );
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/Forgot",
    element: <Forgot/>,
  },
  {
    path: "/", element: (<RequireAuth><Layout/></RequireAuth> ),

  children: [
    {
      path: "/app",
      element:(<RequireAuth roles={["Cliente"]}><App /></RequireAuth>),
    },
    {
      path: "/ajustes",
      element: (<RequireAuth roles={["Cliente"]}><Ajustes /></RequireAuth>),
    },
    {
      path: "/perfil",
      element:  (<RequireAuth roles={["Cliente"]}><Perfil /></RequireAuth>),
    },
    {
      path: "/productos",
      element:  (<RequireAuth roles={["Admin","Secre","Cliente"]}><Productos /></RequireAuth>),
    },
    {
      path: "/clientes",
      element: (<RequireAuth roles={["Admin", "Secre"]}><Clientes /></RequireAuth>),
    },
    {
      path: "/ppasados",
      element: (<RequireAuth roles={["Admin","Cliente","Secre"]}><Ppasados /></RequireAuth>),
    },
    {
      path: "/c_pactivos",
      element: (<RequireAuth roles={["Cliente"]}><C_PActivos /></RequireAuth>),
    },
  ]
},
]);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
