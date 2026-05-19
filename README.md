# 🌸 Estética Zen - Prototipo de Gestión de Turnos

Prototipo académico y funcional desarrollado para la validación de Historias de Usuario (HUs) aplicadas a un centro de estética y bienestar. La plataforma cuenta con una arquitectura unificada que conecta el Frontend con un servidor Backend y persistencia de datos real en la nube.

---

## 🚀 Arquitectura Tecnológica
* **Frontend:** Interfaces de usuario diseñadas con HTML5, CSS3, animaciones y maquetación interactiva con **Bootstrap 5.3**.
* **Backend:** Servidor REST API desarrollado sobre **Node.js** con el framework **Express**.
* **Base de Datos:** Motor relacional **PostgreSQL** hospedado de forma serverless en la nube de **Neon (AWS)**.
* **Sesión Local:** Control transparente de persistencia de usuario mediante `localStorage` para optimizar la experiencia de reserva.

---

## 📋 Historias de Usuario Implementadas (Mapeo de Cobertura)

* **HU#1 - Portal de Acceso Diferenciado (Login):** Redirección inteligente y segura según el correo ingresado. Limpieza automática de credenciales al cargar para máxima fidelidad.
  * *admin@zen.com* ➔ Panel General del Administrador.
  * *pro@zen.com* ➔ Agenda del Profesional Técnico.
  * *Cualquier otro email* ➔ Portal de Reservas para Clientes.
* **HU#2 - Catálogo Detallado de Tratamientos:** Despliegue dinámico de servicios, duraciones y precios consultados en tiempo real desde las tablas de Neon.
* **HU#3 - Reserva Automatizada de Citas (User):** Selector interactivo que bloquea automáticamente domingos por políticas de negocio. Envío invisible del ID del cliente utilizando la memoria de sesión.
* **HU#5 y HU#8 - Vista Profesional y Control de Asistencia:** Agenda sincronizada para especialistas (Dra. Ana Valenzuela). Permite registrar de forma interactiva la asistencia de pacientes (*Completado* / *Ausente*).
* **HU#7 - Panel de Control General (Admin):** * ABM (Alta, Baja, Modificación) real de servicios directo en Postgres.
  * Gestión segmentada en pestañas independientes para **Fichero de Clientes** y **Personal Técnico** (con opción de edición).
  * **Calendario Maestro Interactivo:** Visualización mensual cuadriculada (Mayo 2026) con filtros dinámicos diarios por clic.
  * **Auditoría Financiera:** Caja contable automática que calcula la facturación estimada según las citas activas agendadas.
  * **Exportador de Datos:** Generador de reportes en caliente a formato `.csv` (compatible con Excel) filtrado por día o mes completo.

---

## 🛡️ Reglas de Negocio Específicas y Control de Colisiones
1. **Control de Superposiciones (Anti-Colisión):** Tanto el módulo de clientes como el modal de reprogramación del administrador bloquean la inserción de datos si el especialista ya cuenta con un turno reservado exactamente en la misma fecha y bloque horario.
2. **Restricción de Días No Laborales:** El sistema computa dinámicamente el calendario e inhabilita las reservas los días domingos.

---

## 💻 Instrucciones para Ejecución Local

1. Instalar las dependencias necesarias declaradas en el `package.json`:
   ```bash
   npm install