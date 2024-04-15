var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON

var app = express(); //Inicializo express
var port = process.env.PORT || 3000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const MySQL = require('./modulos/mysql.js')

//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
    console.log('   [GET] http://localhost:3000/');
    console.log('   [GET] http://localhost:3000/saludo');
    console.log('   [GET] http://localhost:3000/autos');
    console.log('   [GET] http://localhost:3000/pilotos');
    console.log('   [GET] http://localhost:3000/circuitos');
    console.log('   [GET] http://localhost:3000/PilotosPorAuto');
});

app.get('/saludo', function(req, res) {
    let query = req.query;
    console.log(query);
    res.send(`Hola ${query.nombre}, ¿qué tal?`);
});

app.get('/autos', async function(req, res) {
    let query = req.query;
    console.log(query);
    const respuesta = await MySQL.realizarQuery(`SELECT * FROM Autos`);
    res.send(respuesta);
});

app.get('/pilotos', async function(req, res) {
    let query = req.query;
    console.log(query);
    const respuesta = await MySQL.realizarQuery(`SELECT * FROM Pilotos`);
    res.send(respuesta);
});

app.get('/circuitos', async function(req, res) {
    let query = req.query;
    console.log(query);
    const respuesta = await MySQL.realizarQuery(`SELECT * FROM Circuitos`);
    res.send(respuesta);
});

app.get('/pilotos-por-auto', async function(req, res) {
    let query = req.query;
    console.log(query);
    const respuesta = await MySQL.realizarQuery(`SELECT * FROM PilotosPorAuto`);
    res.send(respuesta);
});

app.post('/autos', async function(req, res) {
    let body = req.body;
    console.log(body);
    modelo = await MySQL.realizarQuery(`SELECT * FROM Autos WHERE modelo = "${body.modelo}"`);
    if (modelo === undefined || modelo.length === 0) {
        const respuesta = MySQL.realizarQuery(`INSERT INTO Autos (marca, modelo, cant_pasajeros, kit_seguridad) VALUES ("${body.marca}", "${body.modelo}", "${body.cant_pasajeros}", "${body.kit_seguridad}");`);
        res.send(respuesta);
    } else {
        res.send("El modelo del auto se repite");
    }
});

app.post('/pilotos', async function(req, res) {
    let body = req.body;
    console.log(body);
    nombre = await MySQL.realizarQuery(`SELECT * FROM Pilotos WHERE nombre = "${body.nombre}"`);
    if (nombre === undefined || nombre.length === 0) {
        const respuesta = MySQL.realizarQuery(`INSERT INTO Pilotos (nombre, apellido, origen, residencia, id_circuito) VALUES ("${body.nombre}", "${body.apellido}", "${body.origen}", "${body.residencia}", "${body.id_circuito}");`);
        res.send(respuesta);
    } else {
        res.send("El nombre del piloto se repite");
    }
});

app.post('/circuitos', async function(req, res) {
    let body = req.body;
    console.log(body);
    nombre = await MySQL.realizarQuery(`SELECT * FROM Circuitos WHERE nombre = "${body.nombre}"`);
    if (nombre === undefined || nombre.length === 0) {
        const respuesta = MySQL.realizarQuery(`INSERT INTO Circuitos (nombre, pais, ciudad, km_totales, cant_espectadores, cant_autos) VALUES ("${body.nombre}", "${body.pais}", "${body.ciudad}", "${body.km_totales}", "${body.cant_espectadores}", "${body.cant_autos}");`);
        res.send("ok");
    } else {
        res.send("El nombre del circuito se repite");
    }
});

app.post('/pilotos-por-auto', async function(req, res) {
    let body = req.body;
    console.log(body);
    const respuesta = MySQL.realizarQuery(`SELECT * FROM PilotosPorAuto WHERE id_auto = "${body.id_auto}" AND id_piloto = "${body.id_piloto}"`);
    if (respuesta === undefined || respuesta.length === 0) {
        const respuesta = MySQL.realizarQuery(`INSERT INTO PilotosPorAuto (id_auto, id_piloto, cant_butacas) VALUES ("${body.id_auto}", "${body.id_piloto}", "${body.cant_butacas}");`);
        res.send("ok");
    } else {
        res.send("El piloto ya está asignado a este auto");
    }
});

app.put('/autos', async function(req, res) {
    let body = req.body;
    console.log(body);
    
    let claves = Object.keys(body);
    let valores = Object.values(body);
    
    let respuesta = null;
    for (let i = 1; i < body.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        UPDATE Autos
        SET ${claves[i]} = '${valores[i]}'
        WHERE ${claves[0]} = '${valores[0]}';`);
    }
    res.send(respuesta);
});

app.put('/pilotos', async function(req, res) {
    let body = req.body;
    console.log(body);
    let claves = Object.keys(body);
    let valores = Object.values(body);
    let respuesta = null;

    for (let i = 1; i < body.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        UPDATE Pilotos
        SET ${claves[i]} = '${valores[i]}'
        WHERE ${claves[0]} = '${valores[0]}';`);
    }

    res.send(respuesta);
});

app.put('/circuitos', async function(req, res) {
    let body = req.body;
    console.log(body);
    let claves = Object.keys(body);
    let valores = Object.values(body);
    let respuesta = null;

    for (let i = 1; i < body.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        UPDATE Circuitos
        SET ${claves[i]} = '${valores[i]}'
        WHERE ${claves[0]} = '${valores[0]}';`);
    }

    res.send(respuesta);
});

app.put('/pilotos-por-auto', async function(req, res) {
    let body = req.body;
    console.log(body);
    
    let claves = Object.keys(body);
    let valores = Object.values(body);
    
    let respuesta = null;

    for (let i = 1; i < body.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        UPDATE PilotosPorAuto
        SET ${claves[i]} = '${valores[i]}'
        WHERE ${claves[0]} = '${valores[0]}';`);
    }

    res.send(respuesta);
});

app.delete('/autos', async function(req, res) {
    let body = req.body;
    console.log(body);
    
    let claves = Object.keys(body);
    let valores = Object.values(body);

    let respuesta = null;
    const ids = []

    // Bucle para saber los ids que cumplen con una/varias caracteristicas
    for (let i = 0; i < claves.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        SELECT id_auto FROM Autos
        WHERE ${claves[i]} = "${valores[i]}";`);
        
        console.log(respuesta)
        if (respuesta.length !== 0 && respuesta !== undefined) {
            ids.push(respuesta[0].id_auto)
        }
    }

    if (ids.length === 0 || ids === undefined) {
        return res.send("No hay autos con esa caracteristica")
    } 

    // Borro id por id
    for (let i = 0; i < ids.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        DELETE FROM PilotosPorAuto 
        WHERE id_auto = "${ids[i]}";`);

        respuesta = await MySQL.realizarQuery(`
        DELETE FROM Autos 
        WHERE id_auto = "${ids[i]}";`);
    }

    res.send(respuesta);
});

app.delete('/pilotos', async function(req, res) {
    let body = req.body;
    console.log(body);
    
    let claves = Object.keys(body);
    let valores = Object.values(body);

    let respuesta = null;
    const ids = []

    // Bucle para saber los ids que cumplen con una/varias características
    for (let i = 0; i < claves.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        SELECT id_piloto FROM Pilotos
        WHERE ${claves[i]} = "${valores[i]}";`);
        
        if (respuesta !== undefined && respuesta.length !== 0) {
            ids.push(respuesta[0].id_piloto)
        }
    }

    if (ids.length === 0 || ids === undefined) {
        return res.send("No hay pilotos con esa característica")
    } 

    // Borro id por id
    for (let i = 0; i < ids.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        DELETE FROM Pilotos 
        WHERE id_piloto = "${ids[i]}";`);
    }

    res.send(respuesta);
});

app.delete('/circuitos', async function(req, res) {
    let body = req.body;
    console.log(body);
    
    let claves = Object.keys(body);
    let valores = Object.values(body);

    let respuesta = null;
    const ids = []

    // Bucle para saber los ids que cumplen con una/varias características
    for (let i = 0; i < claves.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        SELECT id_circuito FROM Circuitos
        WHERE ${claves[i]} = "${valores[i]}";`);
        
        if (respuesta !== undefined && respuesta.length !== 0) {
            ids.push(respuesta[0].id_circuito)
        }
    }

    if (ids.length === 0 || ids === undefined) {
        return res.send("No hay circuitos con esa característica")
    } 

    // Borro id por id
    for (let i = 0; i < ids.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        DELETE FROM Circuitos 
        WHERE id_circuito = "${ids[i]}";`);
    }

    res.send(respuesta);
});

app.delete('/pilotos-por-auto', async function(req, res) {
    let body = req.body;
    console.log(body);
    
    let claves = Object.keys(body);
    let valores = Object.values(body);

    let respuesta = null;
    const ids = []

    // Bucle para saber los ids que cumplen con una/varias características
    for (let i = 0; i < claves.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        SELECT id_auto FROM PilotosPorAuto
        WHERE ${claves[i]} = "${valores[i]}";`);
        
        if (respuesta !== undefined && respuesta.length !== 0) {
            ids.push(respuesta[0].id_auto)
        }
    }

    if (ids.length === 0 || ids === undefined) {
        return res.send("No hay pilotos por auto con esa característica")
    } 

    // Borro id por id
    for (let i = 0; i < ids.length; i++) {
        respuesta = await MySQL.realizarQuery(`
        DELETE FROM PilotosPorAuto 
        WHERE id_auto = "${ids[i]}";`);
    }

    res.send(respuesta);
});
