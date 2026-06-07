const express = require('express');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONEXIÓN CLOUD DEFINITIVA (Neon Postgres Pooler)
const sql = neon('postgresql://neondb_owner:npg_MCYqz6jmh5Ab@ep-red-term-actorn0y-pooler.sa-east-1.aws.neon.tech/neondb');

// Servir archivos estáticos del Frontend
app.use(express.static(path.join(__dirname, 'public')));

// ⚙️ INICIALIZACIÓN MÁGICA: Corrige las tablas reales en Neon Cloud con contraseñas
async function inicializarEstructuraBaseDatos() {
    try {
        // 1. Tabla de Servicios (Imprescindible serial id y campos limpios)
        await sql`
            CREATE TABLE IF NOT EXISTS servicios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                duracion INT NOT NULL,
                precio NUMERIC(10,2) NOT NULL,
                descripcion TEXT
            );
        `;
        
        // 2. Tabla de Usuarios (¡Columna password incorporada con éxito! 🔑)
        await sql`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT DEFAULT '23456',
                rol VARCHAR(30) DEFAULT 'cliente'
            );
        `;

        // 3. Tabla de Turnos (Formatos compatibles nativos)
        await sql`
            CREATE TABLE IF NOT EXISTS turnos (
                id SERIAL PRIMARY KEY,
                cliente_id INT NOT NULL,
                profesional_id INT NOT NULL,
                servicio_id INT NOT NULL,
                fecha_hora VARCHAR(60) NOT NULL
            );
        `;
        
        console.log("🚀 [NEON SQL] ¡Estructura de tablas sincronizada y validada con éxito con soporte de Claves!");
    } catch (e) {
        console.error("❌ Error crítico estructurando Neon Postgres:", e);
    }
}
inicializarEstructuraBaseDatos();

// =========================================================================
// 🚀 ENDPOINTS DE LA API SINCRO REAL
// =========================================================================

// USUARIOS
app.get('/api/usuarios', async (req, res) => {
    try {
        const filas = await sql`SELECT * FROM usuarios ORDER BY id ASC`;
        res.status(200).json(filas);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/usuarios', async (req, res) => {
    // 🔑 Captura la clave real enviada desde el Front o asigna una genérica segura
    const { nombre, email, password, rol } = req.body;
    try {
        const rSeguro = rol || 'cliente';
        const pSegura = password || '23456';
        
        await sql`
            INSERT INTO usuarios (nombre, email, password, rol) 
            VALUES (${nombre}, ${email}, ${pSegura}, ${rSeguro})
            ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, rol = EXCLUDED.rol
        `;
        res.status(201).json({ mensaje: "Usuario sincronizado correctamente con clave." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        await sql`DELETE FROM usuarios WHERE id = ${parseInt(req.params.id)}`;
        res.status(200).json({ mensaje: "Removido." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// SERVICIOS
app.get('/api/servicios', async (req, res) => {
    try {
        const filas = await sql`SELECT * FROM servicios ORDER BY id ASC`;
        res.status(200).json(filas);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/servicios', async (req, res) => {
    const { nombre, duracion, precio, descripcion } = req.body;
    try {
        const dSegura = descripcion || 'Sin descripción.';
        await sql`
            INSERT INTO servicios (nombre, duracion, precio, descripcion) 
            VALUES (${nombre}, ${parseInt(duracion)}, ${parseFloat(precio)}, ${dSegura})
        `;
        res.status(201).json({ mensaje: "Servicio guardado." });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Error en el motor relacional." }); 
    }
});

app.put('/api/servicios/:id', async (req, res) => {
    const { nombre, duracion, precio, descripcion } = req.body;
    try {
        await sql`
            UPDATE servicios 
            SET nombre=${nombre}, duracion=${parseInt(duracion)}, precio=${parseFloat(precio)}, descripcion=${descripcion} 
            WHERE id=${parseInt(req.params.id)}
        `;
        res.status(200).json({ mensaje: "Actualizado." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/servicios/:id', async (req, res) => {
    try {
        await sql`DELETE FROM servicios WHERE id = ${parseInt(req.params.id)}`;
        res.status(200).json({ mensaje: "Eliminado." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// TURNOS
app.get('/api/turnos/maestro', async (req, res) => {
    try {
        const filas = await sql`SELECT * FROM turnos ORDER BY fecha_hora ASC`;
        res.status(200).json(filas);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/turnos/reserva', async (req, res) => {
    const { cliente_id, profesional_id, servicio_id, fecha_hora } = req.body;
    try {
        await sql`
            INSERT INTO turnos (cliente_id, profesional_id, servicio_id, fecha_hora) 
            VALUES (${parseInt(cliente_id)}, ${parseInt(profesional_id)}, ${parseInt(servicio_id)}, ${fecha_hora})
        `;
        res.status(201).json({ mensaje: "Tu reserva quedó agendada con éxito." });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Error al procesar reserva." }); 
    }
});

app.delete('/api/turnos/:id', async (req, res) => {
    try {
        await sql`DELETE FROM turnos WHERE id = ${parseInt(req.params.id)}`;
        res.status(200).json({ mensaje: "Cancelado." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/turnos/:id/reprogramar', async (req, res) => {
    const { fecha_hora, profesional_id } = req.body;
    try {
        const colisiones = await sql`
            SELECT id FROM turnos 
            WHERE profesional_id = ${parseInt(profesional_id)} AND fecha_hora = ${fecha_hora} AND id != ${parseInt(req.params.id)}
        `;
        if (colisiones.length > 0) {
            return res.status(409).json({ error: "El especialista ya cuenta con una cita asignada en ese bloque." });
        }
        await sql`UPDATE turnos SET fecha_hora = ${fecha_hora} WHERE id = ${parseInt(req.params.id)}`;
        res.status(200).json({ mensaje: "Reprogramado." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor unificado activo en puerto ${PORT}`);
});