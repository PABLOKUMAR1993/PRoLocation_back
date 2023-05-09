/* Patrón para crear vehiculos

{
    "idDispositivo": "",
    "idConductor": "",
    "idMantenimiento": "",
    "tipoVehiculo": "",
    "marca": "Ford",
    "modelo": "Focus",
    "chasis": "987654321",
    "matricula": "1111BBB",
    "fechaAlta": "2020-01-01",
    "kmIniciales": "",
    "kmActuales": "",
    "estado": "operativo",
    "dispositivo": {},
    "conductor": [],
    "mantenimiento": []
}

*/
const vehicles = [
    {
        _id: 01,
        nombre: "Vehículo 01",
        datosVehiculo: {
            _idLocalizador: "555555555",
            idLocalizador: "987654321",
            chasis: "45682",
            matricula: "123ABC",
            marca: "Ford",
            modelo: "Focus",
            tipo: "Turismo",
            kmIniciales: "50.000",
            kmActuales: "50.000"
        },
        dispositivo: {
            _id: 01,
            idLocalizador: "987654321",
            idExterno: "78984564",
            longitud: "45646456",
            latitud: "654654321",
            velocidad: "100"
        },
        conductorAsignado: {
            _id: 01,
            idConductor: "001",
            nombre: "Pepe",
            apellido: "Garcia Perez",
            dni: "02546654p",
            caducidadPermisoConduccion: "02-09-2025",
        },
        mantenimiento: {
            mediaDiaria: 400,
            filtros: {
                aceite: [
                    { kilometros: 10000, fecha: "10/01/2019" },
                    { kilometros: 20000, fecha: "10/01/2020" },
                    { kilometros: 30000, fecha: "10/01/2021" },
                    { kilometros: 40000, fecha: "10/01/2022" },
                    { kilometros: 50000, fecha: "10/01/2023" },
                ],
                aire: [
                    { kilometros: 20000, fecha: "10/01/2019" },
                    { kilometros: 40000, fecha: "10/01/2022" },
                ],
                combustible: [
                    { kilometros: 20000, fecha: "10/01/2020" },
                    { kilometros: 40000, fecha: "10/01/2022" },
                ]
            }
        }

    }]