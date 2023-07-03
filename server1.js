const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const { timeStamp } = require('console');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Servir el archivo index.html cuando se solicita la página de inicio
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error interno del servidor');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && req.url === '/submit') {
    // Manejar la solicitud POST del formulario
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      // Realiza cualquier acción necesaria con los datos recibidos
      const formData = querystring.parse(body);
      const name = formData.txt_nombre;
      const nacionalidad = formData.txt_nacionalidad;
      const cedula = formData.txt_cedula;
      const direccion = formData.txt_direccion;
      const telefono = formData.txt_telefono;
      const correo = formData.txt_correo;

      // Obtener la marca de tiempo actual
      const timestamp = new Date().toISOString();

      console.log('Nombre:', name);

      // Redirige al usuario de vuelta a la página del formulario
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<meta http-equiv="refresh" content="0;URL=\'/\'" />');
      res.end();

      // Crear archivo con los datos recibidos
      const fileContent = `{
      "id":"${timestamp}_${cedula}",
      "Nombre":"${name}",
      "Nacionalidad":"${nacionalidad}",
      "Cedula":"${cedula}",
      "Direccion":"${direccion}",
      "Telefono":"${telefono}",
      "Correo":"${correo}"
    },`;

      fs.appendFile('pasar.json', fileContent, err => {
        if (err) {
          console.error('Error al crear el archivo:', err);
          res.writeHead(500);
          res.end('Error interno del servidor');
        } else {
          console.log('Archivo creado correctamente');
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Archivo creado correctamente');
        }
      });

    });
  } else {
    res.writeHead(404);
    res.end('Página no encontrada');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
