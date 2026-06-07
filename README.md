# 🌸 Estética Zen - Sistema de Gestión de Citas y Turnos Online

Prototipo funcional de software desarrollado como proyecto académico para la validación de Historias de Usuario, Metodologías Ágiles e Ingeniería de Requisitos Relacionales. La plataforma automatiza el flujo de reservas de un centro de bienestar, administrando de forma digital los perfiles de clientes, las especialidades del personal técnico y el control de asistencia en cabina.

## 🚀 Arquitectura Tecnológica y Despliegue Cloud
El ecosistema implementa una arquitectura cliente-servidor desacoplada apoyada en las siguientes tecnologías:
* **Backend:** Node.js con el framework Express.
* **Frontend:** Interfaz de alta fidelidad y responsive maquetada con Bootstrap 5 y Vanilla JavaScript.
* **Base de Datos Cloud:** Motor relacional PostgreSQL administrado de forma remota en la nube a través de la infraestructura de **Neon Cloud**.

## 🛠️ Características Principales del MVP
1. **Autenticación Unificada y Ruteo por Roles:** Un único portal de acceso (`login.html`) lee los privilegios de la cuenta en Postgres y deriva dinámicamente al usuario a su panel correspondiente (`admin.html`, `profesional.html` o `reserva.html`).
2. **Filtrado Dinámico Muchos a Muchos ($N:M$):** Al seleccionar un tratamiento, el sistema consulta la tabla intermedia `profesionales_servicios` y habilita exclusivamente a los especialistas autorizados para esa camilla.
3. **Motor Anti-Colisiones Horarias:** El servidor inspecciona de forma asincrónica los registros previos en la nube, bloqueando y renderizando como no cliqueables (`occupied`) aquellos bloques horarios que ya registren una coincidencia exacta de fecha y hora para el especialista elegido.
4. **Control de Cabina Persistentemente Auditado:** Las profesionales marcan asistencia ("✓ Atendido" / "✗ Ausente") desde su agenda, inyectando un tag inmutable que el Administrador visualiza de forma pasiva en su Calendario Maestro mediante badges estéticos de lectura.
5. **Exportador Corporativo Inmune a Errores:** Compilación de hojas de cálculo (CSV) provistas de una firma digital universal BOM UTF-8 que fuerza la compatibilidad absoluta de fechas, tildes y eñes al ser abiertas en Microsoft Excel.

## 🔗 Links de Acceso y Auditoría del Proyecto
* **Repositorio en GitHub (Código Fuente):** [github.com/JorSc/estetica-zen-prototipo](https://github.com/JorSc/estetica-zen-prototipo)
* **Ejecución en Vivo (StackBlitz):** [Acceder al prototipo web](https://stackblitz.com/~/github.com/JorSc/estetica-zen-prototipo?file=package-lock.json&initialPath=/index.html&view=editor)
* **Consola Cloud (Neon Postgres):** [Consola de administración de base de datos](https://console.neon.tech/app/projects/steep-rice-21520548?database=neondb&branchId=br-lucky-surf-ac9earbm)

## 💻 Instrucciones para Ejecución Local

Si se desea replicar y correr el ecosistema de forma local en su terminal, ejecute los siguientes pasos de configuración:

### 1. Clonar el Repositorio
```bash
git clone [https://github.com/JorSc/estetica-zen-prototipo.git](https://github.com/JorSc/estetica-zen-prototipo.git)
cd estetica-zen-prototipo