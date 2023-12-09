import React, { useState } from 'react';
import axios from 'axios';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon
}
from 'mdb-react-ui-kit';
import { Link, useNavigate } from "react-router-dom";



function Login() {
    const [state, setState] = useState({
        correo: '',
        clave: '',
        correoError: '',
        claveError: '',
      });
    
    const navigate = useNavigate();
    
      const handleEmailChange = (event) => {
        const correo = event.target.value;
        const correoError = isValidcorreo(correo) ? '' : 'Formato de correo electrónico incorrecto';
        setState((prevState) => ({
          ...prevState,
          correo: correo,
          correoError,
        }));
        console.log(state)
      };
      
      const isValidcorreo = (correo) => {
        const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(correo);
      };
      const isValidclave = (clave) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_@#$%^&+=]).{8,}$/;
        return regex.test(clave);
      };
      const handleclaveChange = (event) => {
        const clave = event.target.value;
        const claveError = clave.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : '';
        setState((prevState) => ({
          ...prevState,
          clave: clave,
          claveError,
        }));
      };
    
    
      const handleSubmit = (event) => {
        event.preventDefault();
        const { correo, clave } = state;
      
        if (!isValidcorreo(correo)) {
          return;
        }
      
        if (clave.length < 6) {
          return;
        }
      
        // Realiza una llamada a la API para autenticar al usuario usando Axios y tu backend de Node.js
        axios.post('http://localhost:8081/login', { correo, clave })
          .then((response) => {
            // Maneja el inicio de sesión exitoso
            console.log('Inicio de sesión exitoso');
            
            // Almacena el token en el almacenamiento local o de sesión
            localStorage.setItem('user',JSON.stringify(response.data.usuario));
            // Redirecciona a la página deseada
            navigate('/perfil');
          })
          .catch((error) => {
            // Maneja el inicio de sesión fallido
            console.error('Inicio de sesión fallido:', error);
            setState((prevState) => ({
              ...prevState,
              claveError: 'Credenciales incorrectas',
            }));
          });
      };
    return (
        <MDBContainer fluid>

        <MDBRow className='d-flex justify-content-center align-items-center h-50'>
            <MDBCol col='12'>

            <MDBCard className=' text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px', backgroundColor: "#7D0C38"}}>
                <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                <h3 className="fw-bold mb-6 text-uppercase"> Vinos Don Rogelio </h3>
                {!isValidcorreo(state.correo) && <p className="text-danger">{state.correoError}</p>}
                {!isValidclave(state.clave) && <p className="text-danger">{state.claveError}</p>}
                <MDBInput style={{borderRadius: '1rem'}} wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='correo' id='formControlLg' type='email' size="lg" onChange={handleEmailChange}/>
                <MDBInput style={{borderRadius: '1rem'}} wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='clave' id='formControlLg' type='password' size="lg" onChange={handleclaveChange} />

                <button style={{ borderRadius: "35px", backgroundColor: "#EEE8E8"}}>
                    <Link to="/Forgot" className="nav-link">
                    ¿Olvidó su Contraseña?
                    </Link>
                </button>
                <button style={{ borderRadius: "35px", backgroundColor: "#EEE8E8"}}>
                    <Link onClick={handleSubmit} className="nav-link">
                        Iniciar Sesión
                    </Link>
                </button>

                </MDBCardBody>
            </MDBCard>

            </MDBCol>
        </MDBRow>

        </MDBContainer>
    );
}

export default Login;