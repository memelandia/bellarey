exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-control-Allow-Origin': '*',
        'Access-control-Allow-Headers': 'Content-Type',
        'Access-control-Allow-Methods': 'POST, OPTIONS',
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
            console.error('ALERTA: Las variables de entorno ADMIN_USER o ADMIN_PASS no están configuradas en Netlify.');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Error de configuración del servidor. Faltan variables de entorno.'
                })
            };
        }

        //=========================================================//
        //       INICIO DE LA MODIFICACIÓN PARA DIAGNÓSTICO        //
        //=========================================================//

        // Forzamos el acceso si el NOMBRE DE USUARIO es correcto, ignorando la contraseña.
        // Esto nos permite verificar si al menos la variable ADMIN_USER se está leyendo correctamente.

        console.log(`[DIAGNÓSTICO] Intento de login recibido.`);
        console.log(`[DIAGNÓSTICO] Usuario esperado desde Netlify: '${validUsername}'`);
        console.log(`[DIAGNÓSTICO] Contraseña esperada tiene una longitud de: ${validPassword.length}`);
        console.log(`[DIAGNÓSTICO] Usuario recibido desde el navegador: '${username}'`);
        
        if (username === validUsername) {
            console.log(`[DIAGNÓSTICO] ¡ÉXITO! El usuario coincide. Forzando acceso.`);
            // Login forzado exitoso
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Login de diagnóstico exitoso',
                    user: username
                })
            };
        } else {
            console.log(`[DIAGNÓSTICO] ¡FALLO! El usuario no coincide.`);
            // Credenciales incorrectas porque el USUARIO no coincide
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: `Credenciales incorrectas. El usuario no coincide.`
                })
            };
        }
        
        //=========================================================//
        //         FIN DE LA MODIFICACIÓN PARA DIAGNÓSTICO         //
        //=========================================================//

    } catch (error) {
        console.error('Error catastrófico en la función login:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: `Error interno del servidor: ${error.message}`
            })
        };
    }
};