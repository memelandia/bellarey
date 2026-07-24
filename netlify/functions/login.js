exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Manejar preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Solo aceptar métodos POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Método no permitido. Use POST.'
            })
        };
    }

    try {
        // Parsear el body de la petición
        const { username, password } = JSON.parse(event.body);

        // Validar que se enviaron ambos campos
        if (!username || !password) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Username y password son requeridos.'
                })
            };
        }

        // Obtener credenciales desde variables de entorno
        const validUsername = process.env.ADMIN_USER;
        const validPassword = process.env.ADMIN_PASS;

        // Verificar que las variables de entorno estén configuradas
        if (!validUsername || !validPassword) {
            console.error('Variables de entorno ADMIN_USER o ADMIN_PASS no configuradas');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Error de configuración del servidor.'
                })
            };
        }

        // Comparación tolerante a espacios de copiar/pegar: recorta ambos lados;
        // el usuario no distingue mayúsculas, la contraseña sigue siendo exacta.
        const isValidUsername = String(username).trim().toLowerCase() === String(validUsername).trim().toLowerCase();
        const isValidPassword = String(password).trim() === String(validPassword).trim();

        if (isValidUsername && isValidPassword) {
            // Login exitoso
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Login exitoso',
                    user: username
                })
            };
        } else {
            // Credenciales incorrectas
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Credenciales incorrectas'
                })
            };
        }

    } catch (error) {
        console.error('Error en función login:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Error interno del servidor'
            })
        };
    }
};
