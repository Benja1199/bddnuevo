import React from "react";
import logovdr from './../imagenes/logo2.jpg';
import { Link } from "react-router-dom";




export default function Aside() {
    const user = JSON.parse(localStorage.getItem('user')) ;
    console.log("user:", user) 
    const localdelete = () => {
        localStorage.removeItem('user');
    }
    const isAdmin = user && user.Rol === "Admin";
    console.log(user.Rol)
    const isCliente = user && user.Rol === "Cliente";
    const isSecre = user && user.Rol === "Secre";
    return (
        <aside className="Menu_TopMenus to body main-sidebar sidebar-dark-primary custom-sidebar">
            <Link to="/app" className="brand-link">
                <img src={logovdr} style={{ width: "50px", height: "50px", borderRadius: "100%" }} />
                <span className="brand-text font-weight-light">  Vinos Don Rogelio</span>
            </Link>
            {/* Sidebar */}
            <div className="sidebar">
                <nav className="mt-2">
                    <ul
                        className="nav nav-pills nav-sidebar flex-column"
                        data-widget="treeview"
                        role="menu">
                        <li className="nav-item">
                            <Link to="/c_pactivos" className="nav-link">
                                <i className="nav-icon fas fa-clipboard-list" />
                                <p>   Pedido</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/productos" className="nav-link">
                                <i className="nav-icon fas fa-wine-bottle" />
                                <p>   Productos</p>
                            </Link>
                        </li>
                {(isAdmin || isSecre) && (
                        <li className="nav-item">
                            <Link to="/clientes" className="nav-link">
                                <i className="nav-icon fas fa-users-cog" />
                                <p>   Clientes</p>
                            </Link>
                        </li>
                        )}
                        <li className="nav-item">
                            <Link to="/perfil" className="nav-link">
                                <i className="nav-icon fas fa-address-card fa-thin" />
                                <p>   Mi Perfil</p>
                            </Link>
                        </li>
                        <li onClick={localdelete} className="nav-item">
                        
                            <Link to="/login" className="nav-link">
                                <i class="nav-icon fas fa-sign-out-alt" />
                                <p>   Cerrar Sesión</p>
                            </Link>
                            
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
