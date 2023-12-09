import React from 'react';
import { Link } from 'react-router-dom';
import{ useState, useEffect } from 'react';
import axios from "axios";

export default function C_PActivos() {
  const [products, setProducts] = useState([]);
    
  const [editIndex, setEditIndex] = useState(-1);
  const [editProduct, setEditProduct] = useState({
    nombre: '',
    precio: '',
    unidades: 0,
  });

  const [cart, setCart] = useState([]);
  const [unitCount, setUnitCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user')) ;
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/pedido', {params: {Cod_usuario:user.Cod_usuario }});
      setProducts(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const agregarProducto = () => {
    const nuevoProducto = {
      nombre: 'Nuevo Producto',
      precio: '$0',
      unidades: 0,
    };
    setProducts([...products, nuevoProducto]);
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = [...products];
    nuevosProductos.splice(index, 1);
    setProducts(nuevosProductos);
  };

  const editarProducto = (index) => {
    setEditIndex(index);
    setEditProduct(products[index]);
  };

  const guardarProductoEditado = () => {
    const nuevosProductos = [...products];
    nuevosProductos[editIndex] = editProduct;
    setProducts(nuevosProductos);
    setEditIndex(-1);
    setEditProduct({ nombre: '', precio: '', unidades: 0 });
  };

  const agregarAlCarrito = (product) => {
    const units = prompt(`Ingrese la cantidad de unidades para ${product.nombre}:`);
    if (units !== null) {
      const unitCountInt = parseInt(units, 10);
      if (!isNaN(unitCountInt) && unitCountInt > 0) {
        setCart([...cart, { ...product, unidades: unitCountInt }]);
        setUnitCount(unitCount + unitCountInt);
      } else {
        alert("Por favor, ingrese una cantidad válida.");
      }
    }
  };   
  const handleRealizado = async () => {
    try {
      const response = await axios.put("http://localhost:8081/pedido_realizado", {Cod_usuario: user.Cod_usuario} )
      fetchProductos();
      console.log('Respuesta de la solicitud PUT:', response.data);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      
    }
  } 
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-lg-6 col-6">
          <div className="small-box bg-success">
            <div className="inner">
              <h3>Activos</h3>
            </div>
            <div className="icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <Link to="/c_pactivos" className="small-box-footer">
              <i className="fas fa-arrow-circle-down"></i>
            </Link>
          </div>
        </div>
        <div className="col-lg-6 col-6">
          <div className="small-box bg-warning">
            <div className="inner">
              <h3>Historial</h3>
            </div>
            <div className="icon">
              <i className="fas fa-receipt"></i>
            </div>
            <Link to="/ppasados" className="small-box-footer">
              <i className="fas fa-arrow-circle-down"></i>
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
      <div className="card-header border-0">
        <h3 className="card-title">Pedidos</h3>  
        <p className="ml-auto">Total de Unidades: {unitCount}</p>
        </div>
        <div className="card-body table-responsive p-0">
          <table className="table table-striped table-valign-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Unidades Solicitadas</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index}>
                  <td>{item.Nombre_Producto}</td>
                  <td>{item.Precio}</td>
                  <td>{item.Unidades_Vendidas}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className= "my-3 d-flex justify-content-center">
          <button className="btn btn-primary" onClick={handleRealizado}>
              Enviar Pedido
            </button>
            </div>
        </div>
      </div>

    </div>
  );
}
