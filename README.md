# 🌸 Estética Zen - Prototipo de Gestión de Turnos

Prototipo académico y funcional desarrollado para la validación de Historias de Usuario (HUs) aplicadas a la administración de un centro de estética y bienestar. La plataforma cuenta con una arquitectura unificada que conecta interfaces cliente/administrador con un servidor Backend y persistencia de datos real en la nube.

---

## 🚀 Arquitectura Tecnológica
* **Frontend:** Interfaces de usuario limpias y responsivas diseñadas con HTML5, CSS3 y maquetación interactiva mediante **Bootstrap 5.3**.
* **Backend:** Servidor REST API robusto desarrollado sobre **Node.js** con el framework **Express**.
* **Base de Datos:** Motor relacional **PostgreSQL** hospedado de forma serverless en la nube de **Neon (AWS)**.
* **Sesión Local:** Control transparente de persistencia de usuario mediante `localStorage` para el flujo dinámico de reservas y control de accesos.

---

## 📋 Historias de Usuario Implementadas (Mapeo de Cobertura)

* **HU#1 - Portal de Acceso Diferenciado (Login Simulado):** Interfaz limpia de inicio de sesión con técnicas avanzadas anti-autocompletado para garantizar una presentación en vivo transparente. Redirección inteligente según el perfil de correo:
  * `admin@zen.com` ➔ Panel de Control General.
  * `pro@zen.com` ➔ Agenda del Profesional Técnico.
  * *Cualquier otro correo* ➔ Portal de Reservas para Clientes.
* **HU#2 - Catálogo Detallado de Tratamientos:** Despliegue dinámico de servicios, duraciones y precios consultados en tiempo real directamente desde las tablas de Postgres en Neon.
* **HU#3 - Reserva Automatizada de Citas (Cliente):** Selector interactivo que captura la memoria de sesión de forma invisible. Cuenta con un bloqueo nativo de días domingos por políticas operativas del negocio.
* **HU#4 - Cancelación de Citas por el Cliente:** Módulo interactivo que permite al paciente revisar su historial y remover sus reservas vigentes en caliente desde su portal.
* **HU#5 y HU#8 - Vista Profesional y Control de Asistencia:** Agenda unificada para especialistas técnicos que permite visualizar su cronograma diario y registrar de forma interactiva el estado del paciente (*Completado* / *Ausente*).
* **HU#6 - Catálogo de Especialistas:** Panel administrativo para la supervisión del staff activo, permitiendo la visualización de agendas asignadas y corrección de roles técnicos.
* **HU#7 - Panel de Control General (Admin):** 
  * Sistema ABM (Alta, Baja, Modificación) real de servicios e inyección directa en la base de datos cloud.
  * **Calendario Maestro Interactivo:** Visualización mensual en cuadrícula compacta con CSS Grid e indicadores visuales de citas. Permite el filtrado dinámico de la agenda diaria mediante clics sobre los días del mes.
  * **Exportador de Datos:** Generador de reportes en caliente a formato `.csv` (compatible con Microsoft Excel) con lógica tolerante a formatos, permitiendo descargar el día seleccionado o la bitácora completa del sistema.

---

## 🛡️ Reglas de Negocio Específicas y Control de Colisiones
1. **Control de Superposiciones (Anti-Colisión):** Tanto el módulo de reservas del cliente como el modal de reprogramación del administrador bloquean la inserción de datos si el especialista ya cuenta con un turno reservado exactamente en la misma fecha y bloque horario.
2. **Restricción de Jornada No Laboral:** El sistema computa dinámicamente el calendario e inhabilita las reservas los días domingos.

---

## 💻 Instrucciones para Ejecución Local

1. Instalar las dependencias necesarias declaradas en el archivo `package.json`:
```bash
   npm install


