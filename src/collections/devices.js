/* Patrón para crear dispositivos

{
    "idDispositivo": "350424069304218",
    "idPosicion": "",
    "marca": "Teltonika",
    "modelo": "FMT100",
    "estado": "instalado",
    "fechaInstalacion": "2023-03-01"
    "posiciones": [],
}

*/


const vehicles = [
    {
        _id: "123456789",
        nombre: "Vehículo 01",
        datosVehiculo: {
            idLocalizador: "",
            chasis: "",
            matricula: "123ABC",
            marca: "Ford",
            modelo: "Focus",
            tipo: "Turismo",
            
        },

        estadoVehiculo: {
            kilometrajeInicial: 10000,
            kilometrajeActual: 54000,
            mediaDiaria: 400,
            filtros: {
                aceite: [
                    {kilometros: 10000, fecha: "10/01/2019"},
                    {kilometros: 20000, fecha: "10/01/2019"},
                    {kilometros: 30000, fecha: "10/01/2019"},
                    {kilometros: 40000, fecha: "10/01/2019"},
                    {kilometros: 50000, fecha: "10/01/2019"},
                ],
                aire: [
                    {kilometros: 20000, fecha: "10/01/2019"},
                    {kilometros: 40000, fecha: "10/01/2019"},
                ],
                combustible: [
                    {kilometros: 20000, fecha: "10/01/2019"},
                    {kilometros: 40000, fecha: "10/01/2019"},
                ]


            }
        }


    },
    {
        _id: "123456789",
        nombre: "Vehículo 02",
        datosVehiculo: {
            idLocalizador: "987654321",
            chasis: "256454",
            matricula: "132CBA",
            marca: "Ford",
            modelo: "Focus",
            tipo: "Turismo",
        },

        estadoVehiculo: {
            kilometrajeInicial: 10000,
            kilometrajeActual: 54000,
            mediaDiaria: 400,
            filtros: {
                aceite: [
                    {kilometros: 10000, fecha: "10/01/2019"},
                    {kilometros: 20000, fecha: "10/01/2019"},
                    {kilometros: 30000, fecha: "10/01/2019"},
                    {kilometros: 40000, fecha: "10/01/2019"},
                    {kilometros: 50000, fecha: "10/01/2019"},
                ],
                aire: [
                    {kilometros: 20000, fecha: "10/01/2019"},
                    {kilometros: 40000, fecha: "10/01/2019"},
                ],
                combustible: [
                    {kilometros: 20000, fecha: "10/01/2019"},
                    {kilometros: 40000, fecha: "10/01/2019"},
                ]
            }
        }


    }];