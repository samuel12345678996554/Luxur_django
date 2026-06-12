# 🏢 LUXUR - Sistema de Gestión Inmobiliaria

LUXUR es una plataforma web desarrollada para la administración integral de procesos inmobiliarios. Permite gestionar clientes, propietarios, propiedades, contratos, pagos y visitas mediante una arquitectura moderna basada en Angular y Django REST Framework.

---

# ✨ Funcionalidades

## 👥 Clientes
- Registrar clientes.
- Actualizar información.
- Eliminar registros.
- Buscar clientes por nombre o cédula.

## 🏠 Propiedades
- Crear propiedades.
- Gestionar tipos de propiedad.
- Gestionar amenidades.
- Estados de propiedades:
  - Disponible
  - Alquilada
  - Vendida
  - En mantenimiento

## 👤 Propietarios
- Registro y administración de propietarios.
- Asociación de propiedades.

## 📄 Contratos
- Contratos de alquiler.
- Contratos de venta.
- Relación entre clientes y propiedades.
- Actualización automática del estado de las propiedades.

## 💰 Pagos
- Registro de pagos.
- Métodos de pago.
- Historial de pagos.

## 📅 Visitas
- Programación de visitas.
- Seguimiento de clientes interesados.
- Estados:
  - Pendiente
  - Realizada
  - Interesado
  - No interesado

## 📊 Dashboard
Indicadores automáticos:

- Clientes registrados
- Propiedades registradas
- Contratos registrados
- Pagos realizados
- Visitas registradas
- Propiedades disponibles
- Propiedades alquiladas
- Propiedades vendidas
- Visitas pendientes
- Ingresos generados

## 🔐 Seguridad
- JWT Authentication
- Angular Guards
- HTTP Interceptor
- Protección de rutas privadas

---

# 🛠 Tecnologías Utilizadas

## Frontend

- Angular
- TypeScript
- PrimeNG
- Tailwind CSS
- RxJS

## Backend

- Python
- Django 4.2
- Django REST Framework
- Simple JWT
- Django CORS Headers

## Base de Datos

- MySQL

---

# 📦 Dependencias Backend

```txt
Django==4.2.23
django-cors-headers==4.9.0
django-extensions==4.1
djangorestframework==3.17.1
djangorestframework_simplejwt==5.5.1
python-decouple==3.8
PyMySQL==1.2.0
Pillow==12.2.0
```

---

# 📂 Estructura del Proyecto

```
luxur/
│
├── myapps/
│   ├── clients/
│   ├── owners/
│   ├── properties/
│   ├── contracts/
│   ├── payments/
│   └── visits/
│
├── settings.py
├── urls.py
├── wsgi.py
└── asgi.py
```

---

# 🚀 Instalación Backend

## Clonar repositorio

```bash
git clone https://github.com/samuel12345678996554/Luxur_django.git
cd Luxur_django
```

## Crear entorno virtual

```bash
python -m venv venv
```

## Activar entorno virtual

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

## Instalar dependencias

```bash
pip install -r requirements.txt
```

## Configurar variables de entorno

Crear archivo:

```env
.env
```

Ejemplo:

```env
SECRET_KEY=tu_clave

DB_NAME=luxur
DB_USER=root
DB_PASSWORD=123456
DB_HOST=localhost
DB_PORT=3306
```

## Migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

## Crear superusuario

```bash
python manage.py createsuperuser
```

## Ejecutar servidor

```bash
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000
```

---

# 🌐 Frontend

## Instalar dependencias

```bash
npm install
```

## Ejecutar aplicación

```bash
ng serve
```

Frontend:

```text
http://localhost:4200
```

---

# 🔑 API REST

### Clientes

```http
/api/clients/
```

### Propiedades

```http
/api/properties/
```

### Propietarios

```http
/api/owners/
```

### Contratos

```http
/api/contracts/
```

### Pagos

```http
/api/payments/
```

### Visitas

```http
/api/visits/
```

---

# 📈 Dashboard Inteligente

El dashboard actualiza automáticamente:

- Disponibles
- Alquiladas
- Vendidas
- Visitas pendientes
- Ingresos
- Totales generales

según la información almacenada en la base de datos.

---

# 👨‍💻 Desarrolladores

### Samuel Prada
Desarrollador Full Stack

### Andrés Contreras
Estudiante de Ingeniería de Sistemas

---

# 📄 Licencia

Proyecto académico desarrollado con fines educativos y de aprendizaje.