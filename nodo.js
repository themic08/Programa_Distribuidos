function captura(){
    var nombre=document.getElementById("txt_nombre").value;

    var registro="{'nombre':'"+nombre+"'}";
    alert(registro);

    escribirRegistro(registro);
}

const fs = require('fs');

function escribirRegistro(registro) {
  // Ruta y nombre del archivo de log
  const archivoLog = 'registro.log';
  
  // Fecha y hora actual para el registro
  const fechaHora = new Date().toISOString();
  
  // Mensaje a escribir en el registro
  const mensaje = `${fechaHora}: ${registro}\n`;
  
  // Escribir el mensaje en el archivo de log
  fs.appendFile(archivoLog, mensaje, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo de log:', err);
    }
  });
}
