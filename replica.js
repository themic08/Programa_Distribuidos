const mysql = require('mysql');

// Configuración de la conexión a la base de datos de origen
const sourceDbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'basedatos1',
  port:3306
};

// Configuración de la conexión a la base de datos de destino
const destinationDbConfig = {
  host: 'localhost',
  user: 'userdatos2',
  password: 'passdatos2',
  database: 'basedatos2',
  port:33060
};

// Crear la conexión a la base de datos de origen
const sourceConnection = mysql.createConnection(sourceDbConfig);

// Crear la conexión a la base de datos de destino
const destinationConnection = mysql.createConnection(destinationDbConfig);

// Conectar a la base de datos de origen
sourceConnection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos de origen:', err);
    return;
  }

  console.log('Conexión establecida con la base de datos de origen');

  // Consultar los datos de la tabla "datos" en la base de datos de origen
  sourceConnection.query('SELECT * FROM datos', (err, results) => {
    if (err) {
      console.error('Error al obtener los datos de la tabla "datos":', err);
      return;
    }

    // Insertar los datos en la tabla "datos" de la base de datos de destino
    insertDataIntoDestination(results);
  });
});

// Insertar los datos en la tabla "datos" de la base de datos de destino
function insertDataIntoDestination(data) {
  // Conectar a la base de datos de destino
  destinationConnection.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos de destino:', err);
      return;
    }

    console.log('Conexión establecida con la base de datos de destino');

    // Generar los valores a insertar en la consulta
    const values = data.map((row) => {
      return [
        row.id,
        row.nombre,
        row.nacionalidad,
        row.cedula,
        row.direccion,
        row.telefono,
        row.correo
      ];
    });

    // Consulta SQL para insertar los datos en la tabla "datos" de la base de datos de destino
    const insertQuery = 'INSERT INTO datos (id, nombre, nacionalidad, cedula, direccion, telefono, correo) VALUES ?';

    // Ejecutar la consulta para insertar los datos
    destinationConnection.query(insertQuery, [values], (err, results) => {
      if (err) {
        console.error('Error al insertar los datos en la tabla "datos" de la base de datos de destino:', err);
        return;
      }

      console.log('Datos insertados en la tabla "datos" de la base de datos de destino');
      
      // Cerrar las conexiones a las bases de datos
      sourceConnection.end();
      destinationConnection.end();
    });
  });
}
