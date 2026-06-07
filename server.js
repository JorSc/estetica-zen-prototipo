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

// ⚙️ INICIALIZACIÓN MÁGICA: Sincroniza la estructura relacional con tabla intermedia
async function inicializarEstructuraBaseDatos() {
    try {
        // 1. Tabla de Servicios
        await sql`
            CREATE TABLE IF NOT EXISTS servicios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                duracion INT NOT NULL,
                precio NUMERIC(10,2) NOT NULL,
                descripcion TEXT
            );
        `;
        
        // 2. Tabla de Usuarios
        await sql`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT DEFAULT '23456',
                rol VARCHAR(30) DEFAULT 'cliente'
            );
        `;

        // 3. 🔗 TABLA INTERMEDIA: Relación Muchos a Muchos (Especialidades reales)
        await sql`
            CREATE TABLE IF NOT EXISTS profesionales_servicios (
                profesional_id INT NOT NULL,
                servicio_id INT NOT NULL,
                PRIMARY KEY (profesional_id, servicio_id)
            );
        `;

        // 4. Tabla de Turnos
        await sql`
            CREATE TABLE IF NOT EXISTS turnos (
                id SERIAL PRIMARY KEY,
                cliente_id INT NOT NULL,
                profesional_id INT NOT NULL,
                servicio_id INT NOT NULL,
                fecha_hora VARCHAR(60) NOT NULL
            );
        `;
        
        console.log("🚀 [NEON SQL] ¡Ecosistema relacional Muchos a Muchos validado en la nube!");
    } catch (e) {
        console.error("❌ Error crítico estructurando Neon Postgres:", e);
    }
}
inicializarEstructuraBaseDatos();

// =========================================================================
// 🚀 ENDPOINTS DE LA API SINCRO REAL
// =========================================================================

// USUARIOS & ASIGNACIONES
app.get('/api/usuarios', async (req, res) => {
    try {
        const filas = await sql`SELECT * FROM usuarios ORDER BY id ASC`;
        res.status(200).json(filas);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/usuarios', async (req, res) => {
    const { nombre, email, password, rol, serviciosAsignados } = req.body;
    try {
        const rSeguro = rol || 'cliente';
        const pSegura = password || '23456';
        
        // 1. Insertamos o actualizamos el usuario
        const resultado = await sql`
            INSERT INTO usuarios (nombre, email, password, rol) 
            VALUES (${nombre}, ${email}, ${pSegura}, ${rSeguro})
            ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, rol = EXCLUDED.rol
            RETURNING id
        `;
        
        const proId = resultado[0].id;

        // 2. Si es profesional y mandó tratamientos asociados, guardamos las relaciones Muchos a Muchos
        if (rSeguro === 'pro' && serviciosAsignados && serviciosAsignados.length > 0) {
            // Limpiamos asignaciones viejas por si es una edición
            await sql`DELETE FROM profesionales_servicios WHERE profesional_id = ${proId}`;
            
            // Inyectamos cada mapeo relacional en Postgres
            for (let servId of serviciosAsignados) {
                await sql`
                    INSERT INTO profesionales_servicios (profesional_id, servicio_id) 
                    VALUES (${proId}, ${parseInt(servId)})
                    ON CONFLICT DO NOTHING
                `;
            }
        }
        res.status(201).json({ mensaje: "Usuario y especialidades sincronizados correctamente." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const idInt = parseInt(req.params.id);
        await sql`DELETE FROM profesionales_servicios WHERE profesional_id = ${idInt}`;
        await sql`DELETE FROM usuarios WHERE id = ${idInt}`;
        res.status(200).json({ mensaje: "Removido." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Obtiene los profesionales asignados a un servicio específico (Filtro del cliente)
app.get('/api/servicios/:id/profesionales', async (req, res) => {
    try {
        const pros = await sql`
            SELECT u.id, u.nombre, u.email 
            FROM profesionales_servicios ps
            JOIN usuarios u ON ps.profesional_id = u.id
            WHERE ps.servicio_id = ${parseInt(req.params.id)}
        `;
        res.status(200).json(pros);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// SERVICIOS (Con Join Relacional y STRING_AGG para mostrar en la grilla del Admin)
app.get('/api/servicios', async (req, res) => {
    try {
        const filas = await sql`
            SELECT 
                s.id, s.nombre, s.duracion, s.precio, s.descripcion,
                COALESCE(STRING_AGG(u.nombre, ' | '), 'Sin asignar') AS profesionales_asignados
            FROM servicios s
            LEFT JOIN profesionales_servicios ps ON s.id = ps.servicio_id
            LEFT JOIN usuarios u ON ps.profesional_id = u.id
            GROUP BY s.id, s.nombre, s.duracion, s.precio, s.descripcion
            ORDER BY s.id ASC
        `;
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
    } catch (e) { res.status(500).json({ error: e.message }); }
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
        const idInt = parseInt(req.params.id);
        await sql`DELETE FROM profesionales_servicios WHERE servicio_id = ${idInt}`;
        await sql`DELETE FROM servicios WHERE id = ${idInt}`;
        res.status(200).json({ mensaje: "Eliminado." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// TURNOS (Auditoría cruzada para Admin y Profesionales)
app.get('/api/turnos/detallado', async (req, res) => {
    try {
        const filas = await sql`
            SELECT 
                t.id, t.fecha_hora, t.cliente_id, t.profesional_id, t.servicio_id,
                u1.nombre as cliente_nombre, u2.nombre as profesional_nombre, s.nombre as servicio_nombre
            FROM turnos t
            LEFT JOIN usuarios u1 ON t.cliente_id = u1.id
            LEFT JOIN usuarios u2 ON t.profesional_id = u2.id
            LEFT JOIN servicios s ON t.servicio_id = s.id
            ORDER BY t.fecha_hora ASC
        `;
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
    } catch (e) { res.status(500).json({ error: e.message }); }
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
        await sql`UPDATE turnos SET fecha_hora = ${fecha_hora} WHERE id = ${parseInt(req.params.id)}`;
        res.status(200).json({ mensaje: "Estado/Reprogramación Procesada." });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = 3000;
app.listen(PORT, () => { console.log(`🚀 Servidor Muchos a Muchos activo en puerto ${PORT}`); });
