import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";


export default function Ppasados() {
  const [historial, setHistorial]= useState([])
  const user = JSON.parse(localStorage.getItem('user')) ;

  const fetchHistorial = async () => {
    try {
      const response = await axios.get('http://localhost:8081/pedido_historial', { params: user });
      setHistorial(response.data);
      console.log(historial)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);
    return (
        <div className="content-wrapper">

            <div className="row">
                <div className="col-lg-3 col-6 ">
                    <div className="small-box bg-success">
                        <div className="inner">
                            <h3>Actualizar</h3>
                        </div>
                        <div className="icon">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <Link to= "/c_pactivos" className="small-box-footer">
                            <i className="fas fa-arrow-circle-down"></i>
                        </Link>
                    </div>
                </div>
                <div className="col-lg-3 col-6">
                    <div className="small-box bg-warning">
                        <div className="inner">
                            <h3>Pasados</h3>
                        </div>
                        <div className="icon">
                            <i className="fas fa-receipt"></i>
                        </div>
                        <Link to= "/ppasados" className="small-box-footer">
                        <i className="fas fa-arrow-circle-down"></i>
                        </Link>
                    </div>
                </div>
            </div>

        <div class="card card-outline card-info">
  <div class="card-header">
    <h3 class="card-title">HISTORIAL DE PEDIDOS PASADOS</h3>
    <div class="card-tools">
    </div>
    </div>
    {historial.map(pedido => (
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Pedido {format(new Date(pedido.fecha), 'dd-MM-yyyy')}</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
        </div>
      </div>
      <div class="card-body">
        <h3 class ="card-title">Detalle de pedido: </h3>
        <br></br>
        <p>Nombre Producto: {pedido.Nombre} </p>
        <p>Precio Unitario: {pedido.Precio} </p>
        <p>Cantidad Vendida: {pedido.Unidades_vendidas} </p>
        <p>Total a pagar: {pedido.Precio*pedido.Unidades_vendidas} </p>
      </div>
    </div>
    ))}
  <div class="card-footer card card-outline">
    Numero de pedidos realizados = {historial.length}
  </div>
</div>
    </div>
)
}