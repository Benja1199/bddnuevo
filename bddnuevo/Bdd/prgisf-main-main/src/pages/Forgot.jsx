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
import emailjs from '@emailjs/browser';


function Forgot() {
    const [state, setState] = useState({
        correo: '',
        correoError: '',
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
    
      const handleSubmit = (event) => {
        event.preventDefault();

        const { correo} = state;
      
        if (!isValidcorreo(correo)) {
          return;
        }
        // Realiza una llamada a la API para autenticar al usuario usando Axios y tu backend de Node.js
        axios.post('http://localhost:8081/forgot', { correo})
          .then((response) => {
            //actualizamos la contraseña
            axios.put('http://localhost:8081/forgot', { correo})
            // Almacena el token en el almacenamiento local o de sesión
            //localStorage.setItem('user',JSON.stringify(response.data.usuario));
            
            
            //correo.preventDefault();
            emailjs.send('gmailMessage', 'template_pjgnddr',{correo} , 'ccTywwTmtnGnIxcZ5')
              .then((result) => {
                  console.log('Correo enviado');
              }, (error) => {
                  console.log(error.text);
              });
            // Redirecciona al login
            navigate('/Login');
          })
          .catch((error) => {
            // Correo erroneo
            console.error(error);
            setState((prevState) => ({
              ...prevState,
              correoError: 'Credenciales incorrectas',
            }));
          });
      };
    return (
        <MDBContainer fluid>

        <MDBRow className='d-flex justify-content-center align-items-center h-50'>
            <MDBCol col='12'>

            <MDBCard className=' text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px', backgroundColor: "#7D0C38"}}>
                <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                <h2 className="fw-bold mb-4 text-uppercase">VDL </h2>
                {!isValidcorreo(state.correo) && <p className="text-danger">{state.correoError}</p>}
                <MDBInput style={{borderRadius: '1rem'}} wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='correo' id='formControlLg' type='email' size="lg" onChange={handleEmailChange}/>
                <button style={{ borderRadius: "35px", backgroundColor: "#EEE8E8"}}>
                    <Link to="/login" onClick={handleSubmit} className="nav-link">
                        Enviar correo
                    </Link>
                </button>

                </MDBCardBody>
            </MDBCard>

            </MDBCol>
        </MDBRow>

        </MDBContainer>
    );
}

export default Forgot;