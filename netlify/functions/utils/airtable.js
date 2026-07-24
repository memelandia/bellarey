// Cargar variables de entorno para desarrollo local
require('dotenv').config();

const Airtable = require('airtable');

// Configurar conexión a Airtable usando las variables de entorno
const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

// Función para obtener una tabla específica
function getTable(tableName) {
    return base(tableName);
}

// Tablas principales
const table = base('Configuraciones'); // Tabla de configuración
const codesTable = base('Códigos'); // Tabla de códigos

// Funciones auxiliares para manejo de premios (estandarizadas)
function premiosStringToArray(premiosString) {
    if (!premiosString || typeof premiosString !== 'string') {
        return [];
    }
    return premiosString.split(',').map(p => p.trim()).filter(p => p.length > 0);
}

function premiosArrayToString(premiosArray) {
    if (!premiosArray || !Array.isArray(premiosArray)) {
        return '';
    }
    return premiosArray.map(p => p.trim()).filter(p => p.length > 0).join(',');
}

// Headers CORS estándar para todas las funciones
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

module.exports = { 
    table,
    codesTable,
    getTable,
    premiosStringToArray, 
    premiosArrayToString,
    corsHeaders
};