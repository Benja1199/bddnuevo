import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Productos() {
  const user = JSON.parse(localStorage.getItem('user')) ;
    console.log("user:", user) 
    const localdelete = () => {
        localStorage.removeItem('user');
    }
    const isAdmin = user && user.Rol === "Admin";
    const isCliente = user && user.Rol === "Cliente";
    const isSecre = user && user.Rol === "Secre";
  const [unidades, setUnidades] = useState(1);
  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editProduct, setEditProduct] = useState({
    Cod_producto: '',
    Nombre: '',
    Precio: '',
    Unidades_disponibles: 0,
  });
  const handleChange = (e) => {
    setUnidades((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    //console.log(e.target.value)
  };
  // Solicitud GET al localhost para obtener los datos de la tabla producto
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/producto');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEditInputChange = (e, fieldName) => {
    setEditProduct({
      ...editProduct,
      [fieldName]: e.target.value,
    });
  };
  const guardarProductoEditado = () => {
    editarProduct(editProduct);
    setEditProduct({
      Cod_producto: '',
      Nombre: '',
      Precio: '',
      Unidades_disponibles: 0,
    });
  };

  const agregarProducto = async () => {
    try {
      const nuevoProducto = {
        Nombre: 'Editar',
        Precio: 0,
        Unidades_disponibles: 0,
      };

      await axios.post('http://localhost:8081/producto', nuevoProducto);
      fetchProductos();
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const eliminarProducto = (Cod_producto) => {
    axios
      .delete(`http://localhost:8081/producto/${Cod_producto}`)
      .then(() => {
        fetchProductos();
      })
      .catch((error) => {
        console.error('Error al eliminar el producto: ', error);
      });
  };

  const editarProducto = (index) => {
    setEditIndex(index);
    setEditProduct(products[index]);
  };
  const editedProductRef = useRef('')
  // Solicitud PUT para editar un cliente ya existente
  const editarProduct = (productoEditado) => {
    const {Cod_producto} = productoEditado;
    console.log(productoEditado)
    axios.put(`http://localhost:8081/producto/${Cod_producto}`, 
      productoEditado
    )
    .then(() => {
      fetchProductos(); // Actualizar la lista después de editar un cliente
      setEditIndex(-1); // Salir del modo de edición
      setEditProduct({Cod_producto: '', Nombre: '', Precio: '', Unidades_disponibles: 0 });
        editedProductRef.current = null;
    })
    .catch((error) => {
      console.error('Error al editar el producto: ', error);
    });
  };
  
  const agregarApedido = async (producto) => {
    //console.log(producto)
    try {
      producto.Unidades_vendidas=Number(unidades.unidades)
      producto.Cod_usuario=user.Cod_usuario
      producto.Estado="Activo"
      console.log(user)
      console.log(producto)

      await axios.post('http://localhost:8081/pedido', producto);
      fetchProductos();
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };
  

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header border-0">
          <h3 className="card-title">PRODUCTOS DE VINOS DON ROGELIO</h3>
          <div className="card-tools">
          {isAdmin || isSecre && (
            <button onClick={agregarProducto} className="btn btn-primary">
              Agregar
            </button>
            )}
          </div>
        </div>
        <div className="card-body table-responsive p-0">
          <table className="table table-striped table-valign-middle">
            <thead>
              <tr>
                <th>Productos</th>
                <th>Precios CHL</th>
                <th>Unidades Disponibles</th>
                <th>Tipo Envase</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editProduct.Nombre}
                        onChange={(e) => handleEditInputChange(e, 'Nombre')}
                      />
                    ) : (
                      product.Nombre
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editProduct.Precio}
                        onChange={(e) => handleEditInputChange(e, 'Precio')}
                      />
                    ) : (
                      product.Precio
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="number"
                        value={editProduct.Unidades_disponibles}
                        onChange={(e) =>
                          handleEditInputChange(
                            e,
                            'Unidades_disponibles'
                          )
                        }
                      />
                    ) : (
                      product.Unidades_disponibles
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editProduct.Tipo_envase}
                        onChange={(e) =>
                          handleEditInputChange(
                            e,
                            'Tipo_envase'
                          )
                        }
                      />
                    ) : (
                      product.Tipo_envase
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <button
                        onClick={guardarProductoEditado}
                        className="btn btn-success"
                      >
                        Guardar
                      </button>
                    ) : (
                      <>
                      {(isAdmin || isSecre) && (
                        <button
                          onClick={() => editarProducto(index)}
                          className="btn btn-info"
                        >
                          Editar
                        </button>
                      )}
                      {(isAdmin || isSecre) &&  (
                        <button
                          onClick={() =>
                            eliminarProducto(product.Cod_producto)
                          }
                          className="btn btn-danger"
                        >
                          Eliminar
                        </button>
                      )}
                      
                        <button className="btn btn-primary" data-toggle="modal" data-target={"#staticBackdrop" + index}>
                          Agregar a pedido
                        </button>
                        <div class="modal fade" id={"staticBackdrop" + index} data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                          <div class="modal-dialog" role="document">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel">¿Cuantas unidades necesita?</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body">
                                <p>Producto Seleccionado: {product.Nombre}</p>
                                <p>Valor Unitario: {product.Precio} / Unidades Disponibles: {product.Unidades_disponibles} </p>
                                <form action="/agregarpedido" method="post">
                                <input type="number" name="unidades"  min={1} max={product.Unidades_disponibles} onChange={handleChange}/>
                                </form>
                                
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                <button onClick={()=>agregarApedido(product)} data-dismiss="modal" type="button" class="btn btn-primary">Aceptar</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
  );
}

