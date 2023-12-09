const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: "localhost",
    database: "vinosdonrogelio",
    user: "root",
    password: "1199Benja"
});

// Obtener todos los clientes
app.get('/usuario', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM Usuario WHERE Id_rol = 3");
        connection.release();
        //console.log('Datos de los clientes:', rows);
        return res.json(rows);
    } catch (error) {
        console.error('Error consultando la base de datos: ' + error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Insertar un nuevo cliente
// Agregar un nuevo usuario
app.post('/Usuario', async (req, res) => {
    try {
        const { Nombre, Apellido1, Apellido2, Cod_postal_ciudad, Rut, Cod_usuario, Telefono, Id_rol } = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.query("INSERT INTO Usuario (Nombre, Apellido1, Apellido2, Cod_postal_ciudad, Rut, Cod_usuario, Telefono, Id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [Nombre, Apellido1, Apellido2, Cod_postal_ciudad, Rut, Cod_usuario, Telefono, Id_rol]);
        connection.release();
        //console.log('Nuevo usuario agregado:', result);
        return res.status(201).json({ message: 'Usuario agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar nuevo usuario: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Editar un usuario existente
app.put('/Usuario/:Cod_usuario', async (req, res) => {
    try {
        const { Nombre, Apellido1, Apellido2, Cod_postal_ciudad, Rut, Cod_usuario, Telefono, Id_rol } = req.body;
        const { Cod_usuario: id } = req.params;
        const connection = await pool.getConnection();
        const [result] = await connection.query("UPDATE Usuario SET Nombre=?, Apellido1=?, Apellido2=?, Cod_postal_ciudad=?, Rut=?, Telefono=?, Id_rol=? WHERE Cod_usuario=?", [Nombre, Apellido1, Apellido2, Cod_postal_ciudad, Rut, Telefono, Id_rol, Cod_usuario]);
        connection.release();
        //console.log('Usuario editado:', result);
        return res.status(200).json({ message: 'Usuario editado correctamente' });
    } catch (error) {
        console.error('Error al editar usuario: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Eliminar un usuario existente
app.delete('/Usuario/:Cod_usuario', async (req, res) => {
    try {
        const { Cod_usuario } = req.params;
        const connection = await pool.getConnection();
        const [result] = await connection.query("DELETE FROM Usuario WHERE Cod_usuario=?", [Cod_usuario]);
        connection.release();
        //console.log('Usuario eliminado:', result);
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.post('/login', async (req, res) => {
    try {
        const { correo, clave } = req.body;
        const connection = await pool.getConnection();
        
        try {
            const [rows] = await connection.query("SELECT usuario.*, rol.Rol FROM usuario JOIN rol ON usuario.Id_rol = rol.Id_rol WHERE usuario.correo = ?;", [correo]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            const usuario = rows[0];
            if (clave===usuario.clave){
                claveValida = true
            } else {
                claveValida = false
            }            
            if (!claveValida) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }
            // No devuelvas la contraseña en la respuesta
            delete usuario.clave;
            return res.status(200).json({ usuario });
        } catch (error) {
            console.error('Error al consultar la base de datos: ' + error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al establecer la conexión: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Forgot verifica correo
app.post('/forgot', async (req, res) => {
    try {
        const { correo } = req.body;
        const connection = await pool.getConnection();
        
        try {
            const [rows] = await connection.query("SELECT usuario.*, rol.Rol FROM usuario JOIN rol ON usuario.Id_rol = rol.Id_rol WHERE usuario.correo = ?;", [correo]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            const usuario = rows[0];
            return res.status(200).json({ usuario });
        } catch (error) {
            console.error('Error al consultar la base de datos: ' + error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al establecer la conexión: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
//Forgot actualiza clave
app.put('/forgot', async (req, res) =>{
    try {
        const { correo } = req.body;
        const connection = await pool.getConnection();
        
        try {
            //actualizar la clave dependiendo del corro
            const [rows] = await connection.query("Update usuario set usuario.clave= SUBSTRING(REPLACE(usuario.rut,'.',''), 1, 4) WHERE usuario.correo = ?;", [correo]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('Error al consultar la base de datos: ' + error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al establecer la conexión: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Obtener todos los productos
app.get('/producto', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM producto ");
        connection.release();
        //console.log('Datos de los productos:', rows);
        return res.json(rows);
    } catch (error) {
        console.error('Error consultando la base de datos: ' + error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Agregar producto
app.post('/producto', async (req, res) => {
    try {
        const { Nombre, Tipo_envase, Precio, Unidades_disponibles } = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.query("INSERT INTO producto (Nombre, Tipo_envase, Precio, Unidades_disponibles) VALUES (?, ?, ?, ?)", [Nombre, Tipo_envase, Precio, Unidades_disponibles]);
        connection.release();
        //console.log('Nuevo producto agregado:', result);
        return res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar nuevo producto: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Editar un producto existente
app.put('/producto/:Cod_producto', async (req, res) => {
    try {
        const { Nombre, Tipo_envase, Precio, Unidades_disponibles, Cod_producto } = req.body;
        const { Cod_producto: id } = req.params;
        const connection = await pool.getConnection();
        const [result] = await connection.query("UPDATE producto SET Nombre=?, Tipo_envase=?, Precio=?, Unidades_disponibles=? WHERE Cod_producto=?", [Nombre, Tipo_envase, Precio, Unidades_disponibles, Cod_producto]);
        connection.release();
        //console.log('Producto editado:', result);
        return res.status(200).json({ message: 'Producto editado correctamente' });
    } catch (error) {
        console.error('Error al editar producto: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Eliminar un producto existente
app.delete('/producto/:Cod_producto', async (req, res) => {
    try {
        const { Cod_producto} = req.params;
        const connection = await pool.getConnection();
        const [result] = await connection.query("DELETE FROM producto WHERE Cod_producto=?", [Cod_producto]);
        connection.release();
        console.log('Producto eliminado:', result);
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//agregar producto al pedido
app.post('/pedido', async (req, res) => {
    try {
        const {Cod_producto, Cod_usuario, Precio, Unidades_vendidas, Estado} = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.query("INSERT INTO detalle_pedido (Cod_usuario, cod_producto, Fecha, Precio_total) VALUES (?, ?, CURDATE(), ?)", [Cod_usuario, Cod_producto, Precio*Unidades_vendidas]);
        const det_pedido =await connection.query("SELECT MAX(Cod_detalle_pedido) AS codigo_detalle FROM detalle_pedido WHERE Cod_usuario = ?", [Cod_usuario])
        const Cod_detalle_pedido = det_pedido.map(([resultado]) => resultado?.codigo_detalle);
        //console.log('codigo', Cod_detalle_pedido)
        const [result_pedido] = await connection.query("INSERT INTO pedido (Cod_detalle_pedido, Cod_producto, Unidades_vendidas, Precio, Cod_usuario, Estado) VALUES (?, ?, ?, ?, ?, ?)", [Cod_detalle_pedido[0], Cod_producto, Unidades_vendidas, Precio, Cod_usuario, Estado]);
        connection.release();
        console.log('Nuevo detalle pedido:', result);
        console.log('Nuevo result pedido: ',result_pedido)
        return res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar nuevo producto: ' + error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
// hacer select a la tabla donde esta stock, seleccionar cantidad y restarle con un update lo solicitado
//UPDATE Inventario
//SET Cantidad_disponible_producto = Cantidad_disponible_producto - 5
//WHERE Cod_producto = 1;


//mostrar producto en pedidos activos
app.get('/pedido', async (req, res) => {
    try {
        const {Cod_usuario} = req.query;
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT P.Nombre AS Nombre_Producto, P.Precio AS Precio, Ped.Unidades_vendidas AS Unidades_Vendidas FROM Pedido Ped JOIN Producto P ON Ped.Cod_producto = P.Cod_producto WHERE Estado = 'Activo' AND Ped.Cod_usuario=?", [Cod_usuario]);
        connection.release();
        //console.log('Datos de los clientes:', rows);
        return res.json(rows);
    } catch (error) {
        console.error('Error consultando la base de datos: ' + error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});
//hacer un update para cambiar el estado el pedido
app.put('/pedido_realizado', async (req, res) => {
    try {
      const {Cod_usuario} = req.body;
      const connection = await pool.getConnection();
      const [rows] = await connection.query("UPDATE pedido SET Estado = 'Realizado' WHERE Estado = 'Activo' AND Cod_usuario = ?",[Cod_usuario]);
      connection.release();
      //console.log(Estado);
      return res.json(rows);
    } catch (error) {
      console.error('Error consultando la base de datos: ' + error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
//mostrar productos realizados en historial
app.get('/pedido_historial', async (req, res) => {
    try {
        const {Cod_usuario} = req.query;
        const connection = await pool.getConnection();
        const consultaSQL = "SELECT pedido.Cod_producto, producto.Nombre, pedido.Unidades_vendidas, pedido.Precio, pedido.Cod_usuario, pedido.Estado, detalle_pedido.fecha FROM pedido INNER JOIN detalle_pedido ON pedido.Cod_usuario = detalle_pedido.Cod_usuario INNER JOIN producto ON pedido.Cod_producto = producto.Cod_producto WHERE Estado = 'Realizado' AND pedido.Cod_usuario = ? ORDER BY detalle_pedido.fecha DESC";
        const [resultados] = await connection.query(consultaSQL, [Cod_usuario]);
        return res.json(resultados);
        } catch (error) {
        console.error('Error consultando la base de datos: ' + error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
 });
  
app.get('/', (req, res) => {
    return res.json("from Backend Side");
});

app.listen(8081, () => {
    console.log("listening");
});
