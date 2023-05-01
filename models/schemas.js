"use strict";
// Importamos el paquete mongoose
const mongoose = require('mongoose');

// Definimos el esquema de Usuario
const userSchema = new mongoose.Schema({
  idUser: { type: Number, required: true },
  nombre: { type: String},
  apellido: { type: String },
  email: { type: String, required: true },
  dni: { type: String },
  fechaNacimiento: { type: Number },
  fechaAlta: { type: Date },
  estado: { type: Boolean },
  idVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
});

// Definimos el esquema de Conductor
const driverSchema = new mongoose.Schema({
  idDriver: { type: Number, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String},
  dni: { type: String, required: true },
  fechaAlta: { type: Date },
  estado: { type: Boolean },
  idVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  }
});

// Definimos el esquema de Vehiculo
const vehicleSchema = new mongoose.Schema({
  idVehicle: { type: Number, required: true },
  chasis: { type: String },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  anyo: { type: Number, required: true },
  tipo: { type: Number, required: true },
  fechaAlta: { type: Date },
  estado: { type: Boolean },
  maintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maintenance'
  },
  idDevice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Definimos el esquema de Dispositivo
const deviceSchema = new mongoose.Schema({
  idDevice: { type: Number, required: true },
  nombre: { type: String, required: true },
  idPosition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
});

// Definimos el esquema de Posicion
const positionSchema = new mongoose.Schema({
  idPosition: { type: Number, required: true },
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true },
  velocidad: { type: Number, required: true },
  fecha: { type: Date, required: true },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  }
});


// Definimos el esquema de Mantenimiento
const maintenanceSchema = new mongoose.Schema({
  idMaintenace: { type: Number, required: true },

  idOilChange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OilChange', // referencia al modelo de Cambio de aceite
  },
  idOilFilterChange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OilFilterChange', // referencia al modelo de Cambio filtro de aceite
  },
  idAirFilterChange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirFilterChange', // referencia al modelo de Cambio filtro de aire
  },
  idFuelFilterChange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FuelFilterChange', // referencia al modelo de Cambio filtro de combustible
  },
  idPollenFilterChange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PollenFilterChange', // referencia al modelo de Cambio filtro de polen
  },
  idDistributionChange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DistributionChange', // referencia al modelo de Cambio de distribución
  }

});

// Definimos el esquema de CambioAceite
const oilChangeSchema = new mongoose.Schema({
  idOilChange: { type: Number, required: true },
  km: { type: Number },
  fecha: { type: Date},
  idMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maintenance', // referencia al modelo de Maintenance
  }
});

// Definimos el esquema de CambioFiltroAceite
const oilFilterChangeSchema = new mongoose.Schema({
  idOilFilterChange: { type: Number, required: true },
  idMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maintenance', // referencia al modelo de Maintenance
  }
});

// Definimos el esquema de CambioFiltroAire
const airFilterChangeSchema = new mongoose.Schema({
  idAirFilterChange: { type: Number, required: true },
  idMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maintenance', // referencia al modelo de Maintenance
  }
});

// Definimos el esquema de CambioFiltroCombustible
const fuelFilterChangeSchema = new mongoose.Schema({
  idFuelFilterChange: { type: Number, required: true },
  idMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maintenance', // referencia al modelo de Maintenance
  }
});

// Definimos el esquema de CambioFiltroPolen
const pollenFilterChangeSchema = new mongoose.Schema({
  idPollenFilterChange: { type: Number, required: true },
  idMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maintenance', // referencia al modelo de Maintenance
  }
});

// Definimos el esquema de CambioDistribucion
const distributionChangeSchema = new mongoose.Schema({
  idDistributionChange: { type: Number, required: true },
  idMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maintenance', // referencia al modelo de Maintenance
  }
});


// Creamos los modelos a partir de sus respectivos esquemas
const User = mongoose.model('User', userSchema);
const Vehicle = mongoose.model('Vehicle', vehicleSchema);
const Device = mongoose.model('Device', deviceSchema);
const Driver = mongoose.model('Driver', driverSchema);
const Position = mongoose.model('Position', positionSchema);
const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
const OilChange = mongoose.model('OilChange', oilChangeSchema);
const OilFilterChange = mongoose.model('OilFilterChange', oilFilterChangeSchema);
const AirFilterChange = mongoose.model('AirFilterChange', airFilterChangeSchema);
const FuelFilterChange = mongoose.model('FuelFilterChange', fuelFilterChangeSchema);
const PollenFilterChange = mongoose.model('PollenFilterChange', pollenFilterChangeSchema);
const DistributionChange = mongoose.model('DistributionChange', distributionChangeSchema);

// Exportamos los modelos
module.exports = {
  User,
  Vehicle,
  Device,
  Driver,
  Position,
  Maintenance,
  OilChange,
  OilFilterChange,
  AirFilterChange,
  FuelFilterChange,
  PollenFilterChange,
  DistributionChange

};