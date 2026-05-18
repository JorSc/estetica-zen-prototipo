# 🌸 Sistema de Gestión - Centro de Estética Zen

Prototipo funcional para la gestión de turnos, catálogo de servicios y usuarios de un centro de estética. Diseñado con un enfoque moderno, minimalista y colaborativo.

## 👥 Integrantes del Equipo
* [Nombre Integrante 1]
* [Nombre Integrante 2]

## 🛠️ Tecnologías Utilizadas
* **Backend:** Node.js, Express.js
* **Frontend:** HTML5, CSS3 (Bootstrap 5), JavaScript Vanilla (Fetch API)
* **Entorno de Desarrollo:** StackBlitz / CodeSandbox
* **Control de Versiones:** Git & GitHub

## 📋 Funcionalidades Implementadas (Trazabilidad)

El prototipo cuenta con el núcleo funcional del sistema (MVP) conectado al servidor, cumpliendo con las siguientes historias de usuario:

1. **Visualización de Servicios (HU#2):** Al cargar la pantalla de reservas (`reserva.html`), el frontend realiza una petición dinámica al servidor (`/api/servicios`) para renderizar el catálogo de tratamientos vigentes con sus respectivos precios y duraciones desde el Backend.
2. **Reserva de Citas (HU#3):** Motor de reservas que permite seleccionar fecha, profesional y horario. Envía los datos mediante un método POST al servidor para agendar la cita.
3. **Validación de Colisiones (HU#3 / Regla de Negocio):** El backend procesa la reserva e impide que se dupliquen turnos; si un profesional ya está ocupado en esa fecha y hora exacta, el sistema rechaza la solicitud devolviendo un mensaje de error.

*Nota: Las pantallas de Login (`login.html`), Vista del Profesional (`profesional.html`) y Administración (`admin.html`) se encuentran maquetadas a nivel de Frontend de alta fidelidad para validar la experiencia de usuario (UX) de las HUs restantes (#1, #4, #5, #6, #7, #8) de cara al próximo Sprint.*

## 🚀 Cómo Ejecutar el Proyecto

Al estar desarrollado en un entorno 100% web, puedes ejecutarlo directamente desde StackBlitz o de forma local siguiendo estos pasos:

1. Clonar el repositorio:
   ```bash
   git clone [PEGAR_AQUÍ_LA_URL_DE_TU_REPOSITORIO]