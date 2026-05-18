const express = require('express');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONEXIÓN CLOUD DEFINITIVA COMPATIBLE
const sql = neon('postgresql://neondb_owner:npg_MCYqz6jmh5Ab@ep-red-term-actorn0y-pooler.sa-east-1.aws.neon.tech/neondb');

// Servir archivos estáticos del Frontend
app.use(express.static(path.join(__dirname, 'public')));

// 1. OBTENER SERVICIOS (GET /api/servicios)
app.get('/api/servicios', async (req, res) => {
    try {
        const filas = await sql`SELECT * FROM servicios ORDER BY id ASC`;
        res.status(200).json(filas);
    } catch (error) {
        console.error("❌ Error SQL al leer catálogo:", error);
        res.status(500).json({ error: "Error en la base de datos al recuperar el catálogo." });
    }
});

// 2. CREAR RESERVA DE TURNO (POST /api/turnos/reserva)
app.post('/api/turnos/reserva', async (req, res) => {
    const { cliente_id, profesional_id, servicio_id, fecha_hora } = req.body;

    if (!cliente_id || !profesional_id || !servicio_id || !fecha_hora) {
        return res.status(400).json({ error: "Faltan parámetros relacionales para procesar la cita." });
    }

    try {
        const colision = await sql`
            SELECT id FROM turnos 
            WHERE profesional_id = ${parseInt(profesional_id)} AND fecha_hora = ${fecha_hora}
        `;

        if (colision.length > 0) {
            return res.status(409).json({ error: "El especialista seleccionado ya cuenta con una cita agendada en ese bloque horario." });
        }

        const nuevoTurno = await sql`
            INSERT INTO turnos (cliente_id, profesional_id, servicio_id, fecha_hora) 
            VALUES (${parseInt(cliente_id)}, ${parseInt(profesional_id)}, ${parseInt(servicio_id)}, ${fecha_hora}) 
            RETURNING *
        `;

        console.log(`📥 [SQL NEON] Turno guardado exitosamente con ID: ${nuevoTurno[0].id}`);
        res.status(201).json({ mensaje: "Tu cita ha sido guardada.", turno: nuevoTurno[0] });

    } catch (error) {
        console.error("❌ Error SQL al registrar turno:", error);
        res.status(500).json({ error: "Error interno en el servidor." });
    }
});

// 3. CALENDARIO MAESTRO GENERAL (GET /api/turnos/maestro)
app.get('/api/turnos/maestro', async (req, res) => {
    try {
        const filas = await sql`SELECT * FROM turnos ORDER BY fecha_hora ASC`;
        res.status(200).json(filas);
    } catch (error) {
        console.error("❌ Error SQL al consultar agenda maestra:", error);
        res.status(500).json({ error: "Error en la base de datos." });
    }
});

// Manejo de Error 404
app.use((req, res) => {
    res.status(404).send('<h2 style="font-family:sans-serif; text-align:center; margin-top:50px; color:#f06292;">🌸 Estética Zen - Endpoint inexistente</h2>');