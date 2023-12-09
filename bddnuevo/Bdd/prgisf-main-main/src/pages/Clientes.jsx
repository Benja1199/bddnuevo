import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Clientes() {
  const [clients, setClients] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editClients, setEditClients] = useState({
    Nombre: '', Apellido1: '', Apellido2: '',
    Rut: '',
    Cod_usuario: '',
    Telefono: '',
    Id_rol: '',
    Cod_postal_ciudad: '',
  });

  // Inicializar el contador en 1
  const [nextClientId, setNextClientId] = useState(7); 

  // Solicitud GET al localhost para obtener los datos de la tabla usuario
  const fetchClientes = () => {
    axios.get('http://localhost:8081/Usuario')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error fetching data: ', error));
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEditInputChange = (e, field) => {
    setEditClients({
      ...editClients,
      [field]: e.target.value,
    });
  };

  const guardarClienteEditado = () => {
    editarCliente(editClients);
    setEditClients({
      Nombre: '', Apellido1:'', Apellido2:'',
      Rut: '',
      Cod_usuario: '',
      Telefono: '',
      Id_rol: '',
      Cod_postal_ciudad:'',
    });
  };

  // Se hace una copia de los clientes que se van agregando y al Cod_usuario obtiene el valor del contador
  const agregarCliente = (Cliente) => {
    const nuevoCliente = {
      ...Cliente,
      Cod_usuario: nextClientId // Usar el valor actual del contador como Cod_usuario
    };

    // Solicitud POST para agregar el nuevo cliente con su Cod_usuario + 1
    axios.post('http://localhost:8081/Usuario', nuevoCliente)
      .then(() => {
        fetchClientes(); // Actualizar la lista después de agregar un cliente
        setNextClientId(nextClientId + 1); // Incrementar el contador para el próximo cliente
      })
      .catch((error) => {
        console.error('Error al agregar el cliente: ', error);
      });
  };

  const editarClientes = (index) => {
    setEditIndex(index);
    setEditClients(clients[index]);
  };
  
  // Solicitud PUT para editar un cliente ya existente
  const editarCliente = (clienteEditado) => {
    const { Nombre, Apellido1, Apellido2, Cod_postal_ciudad, Rut, Cod_usuario, Telefono, Id_rol } = clienteEditado;
    axios.put(`http://localhost:8081/Usuario/${Cod_usuario}`, {
      Nombre, Apellido1, Apellido2, Cod_postal_ciudad, Rut, Cod_usuario, Telefono, Id_rol
    })
    .then(() => {
      fetchClientes(); // Actualizar la lista después de editar un cliente
      setEditIndex(-1); // Salir del modo de edición
    })
    .catch((error) => {
      console.error('Error al editar el cliente: ', error);
    });
  };

  // Solicitud delete para eliminar un cliente existente 
  const eliminarCliente = (Cod_usuario) => {
    axios.delete(`http://localhost:8081/Usuario/${Cod_usuario}`)
      .then(() => {
        fetchClientes(); // Actualizar la lista después de eliminar un cliente
      })
      .catch((error) => {
        console.error('Error al eliminar el cliente: ', error);
      });
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header border-0">
          <h3 className="card-title">CLIENTES DE VINOS DON ROGELIO</h3>
          <div className="card-tools">
            <button onClick={() => agregarCliente({
              Nombre: 'Editar', Apellido1:'Editar', Apellido2:'Editar',
              Rut: '0',
              Cod_usuario:'2' ,
              Telefono: '98728637',
              Id_rol: '3',
              Cod_postal_ciudad:'100',
            })} className="btn btn-primary">
              Agregar
            </button>
          </div>
        </div>
        <div className="card-body table-responsive p-0">
          <table className="table table-striped table-valign-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Apellido</th>
                <th>RUT</th>
                <th>Cod_usuario</th>
                <th>Telefono</th>
                <th>Id_Rol</th>
                <th>Id_cod_postal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((cliente, index) => (
                <tr key={cliente.Cod_usuario}>
                  {editIndex === index ? (
                    <>
                      <td><input type="text" value={editClients.Nombre} onChange={(e) => handleEditInputChange(e, 'Nombre')} /></td>
                      <td><input type="text" value={editClients.Apellido1} onChange={(e) => handleEditInputChange(e, 'Apellido1')} /></td>
                      <td><input type="text" value={editClients.Apellido2} onChange={(e) => handleEditInputChange(e, 'Apellido2')} /></td>
                      <td><input type="text" value={editClients.Rut} onChange={(e) => handleEditInputChange(e, 'Rut')} /></td>
                      <td><input type="text" value={editClients.Cod_usuario} onChange={(e) => handleEditInputChange(e, 'Cod_usuario')} disabled /></td>
                      <td><input type="text" value={editClients.Telefono} onChange={(e) => handleEditInputChange(e, 'Telefono')} /></td>
                      <td><input type="text" value={editClients.Id_rol} onChange={(e) => handleEditInputChange(e, 'Id_rol')}  disabled/></td>
                      <td><input type="text" value={editClients.Cod_postal_ciudad} onChange={(e) => handleEditInputChange(e, 'Cod_postal_ciudad')} /></td>
                      <td>
                        <button onClick={guardarClienteEditado} className="btn btn-success">
                          Guardar
                        </button>
                        <button onClick={() => setEditIndex(-1)} className="btn btn-warning">
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{cliente.Nombre}</td>
                      <td>{cliente.Apellido1}</td>
                      <td>{cliente.Apellido2}</td>
                      <td>{cliente.Rut}</td>
                      <td>{cliente.Cod_usuario}</td>
                      <td>{cliente.Telefono}</td>
                      <td>{cliente.Id_rol}</td>
                      <td>{cliente.Cod_postal_ciudad}</td>
                      <td>
                        <button onClick={() => { setEditIndex(index); setEditClients(cliente); }} className="btn btn-info">
                          Editar
                        </button>
                        <button onClick={() => eliminarCliente(cliente.Cod_usuario)} className="btn btn-danger">
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
