# Ecommerce

Aplicación de ecommerce construida con una arquitectura simple de microservicios. El proyecto incluye un frontend en React, un API Gateway en Express, un servicio de productos y un servicio de órdenes conectados a PostgreSQL.

## Arquitectura

El sistema está dividido en 4 partes:

- `frontend/`: interfaz web en React + Vite.
- `gateway/`: punto de entrada del cliente, maneja autenticación y proxy hacia los microservicios.
- `porducts-service/`: servicio de productos.
- `orders-service/`: servicio de órdenes y checkout.

Flujo general:

1. El frontend consume `http://localhost:3000/api`.
2. El gateway expone autenticación en `/api/auth`.
3. Las consultas de productos se redirigen al servicio de productos.
4. Las órdenes autenticadas se redirigen al servicio de órdenes.
5. El servicio de órdenes consulta productos, valida stock, registra la compra y descuenta inventario.

## Tecnologías

- React 19
- Vite
- Tailwind CSS
- Node.js
- Express
- PostgreSQL
- JWT
- Axios

## Estructura del proyecto

```text
ecommerce/
├── frontend/
├── gateway/
├── orders-service/
├── porducts-service/
├── .env
├── package.json
└── README.md
```

## Requisitos

- Node.js 18 o superior
- npm
- PostgreSQL

## Variables de entorno

Actualmente el proyecto usa un archivo `.env` en la raíz con esta base:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopping_cart_db
DB_USER=postgres
DB_PASSWORD=root
```

Además, para el servicio de órdenes se requiere:

```env
PRODUCTS_SERVICE_URL=http://localhost:3001
```

Notas importantes:

- `porducts-service` y `orders-service` leen variables con `dotenv`.
- Ambos servicios usan `process.env.PORT`, por lo que deben ejecutarse con puertos distintos.
- El repositorio no tiene archivos `.env` separados por servicio; en el estado actual conviene iniciar cada servicio con su puerto correspondiente en la terminal.

## Base de datos

El proyecto espera una base de datos PostgreSQL llamada `shopping_cart_db`.

Tablas esperadas:

- `products`
- `orders`
- `order_items`

Campos usados por el código:

- `products`: `id`, `name`, `description`, `price`, `stock`, `image_url`
- `orders`: `id`, `user_id`, `status`, `total`, `created_at`
- `order_items`: `order_id`, `product_id`, `quantity`, `unit_price`

## Ejecución local

### 1. Instalar dependencias

En la raíz:

```bash
npm install
```

En el frontend:

```bash
cd frontend
npm install
```

En el gateway:

```bash
cd gateway
npm install
```

Nota: `orders-service` y `porducts-service` no tienen `package.json` propio en este momento, por lo que dependen de las dependencias instaladas en la raíz.

### 2. Levantar el servicio de productos

Desde la raíz:

```bash
$env:PORT=3001
node porducts-service/src/index.js
```

### 3. Levantar el servicio de órdenes

En otra terminal, desde la raíz:

```bash
$env:PORT=3002
$env:PRODUCTS_SERVICE_URL="http://localhost:3001"
node orders-service/src/index.js
```

### 4. Levantar el gateway

Desde `gateway/`:

```bash
npx nodemon src/index.js
```

El gateway queda disponible en:

```text
http://localhost:3000
```

### 5. Levantar el frontend

Desde `frontend/`:

```bash
npm run dev
```

El frontend normalmente queda disponible en:

```text
http://localhost:5173
```

## Autenticación demo

El login actual está simulado en el gateway con credenciales fijas:

- Email: `ana@demo.com`
- Contraseña: `123456`

Al autenticarse, el gateway devuelve un JWT que el frontend guarda en `localStorage`.

## Endpoints principales

### Gateway

- `POST /api/auth/login`: autenticación demo
- `GET /api/health`: estado del gateway
- `GET /api/products`: listado público de productos
- `POST /api/products`: crear producto, requiere token
- `PATCH /api/products/:id/stock`: actualizar stock, requiere token
- `DELETE /api/products/:id`: eliminar producto, requiere token
- `POST /api/orders`: crear orden, requiere token
- `GET /api/orders/user/:userId`: consultar órdenes por usuario, requiere token

### Products service

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PATCH /products/:id/stock`
- `DELETE /products/:id`
- `GET /health`

### Orders service

- `POST /orders`
- `GET /orders/user/:userId`
- `GET /health`

## Funcionalidades actuales

- Visualización de catálogo de productos
- Carrito de compras en memoria
- Inicio de sesión con JWT
- Checkout con validación de stock
- Descuento de inventario al confirmar una orden
- Consulta de órdenes por usuario

## Observaciones del proyecto

- El nombre de la carpeta `porducts-service` parece tener un typo, pero el código actual la usa así.
- Las credenciales JWT y de demo están hardcodeadas en el gateway.
- No hay tests automatizados configurados.
- No hay scripts unificados para levantar todos los servicios al mismo tiempo.
- El carrito vive en estado local del frontend; no persiste tras recargar la página.

## Posibles mejoras

- Separar variables de entorno por servicio
- Agregar `package.json` propios para cada microservicio
- Incorporar migraciones o script SQL de base de datos
- Persistir carrito en backend o `localStorage`
- Agregar validaciones de entrada y manejo de errores más robusto
- Incorporar tests de integración y end-to-end

