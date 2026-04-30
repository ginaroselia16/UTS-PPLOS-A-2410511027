# UTS PPLOS - Sistem Kepegawaian & Absensi

## Identitas
Nama  : Gina Roselia  
NIM   : 2410511027  
Kelas : A_Informatika

## Arsitektur
- API Gateway (Node.js - Express)
- Auth Service (JWT Authentication)
- Employee Service (Laravel API)

## Alur Sistem
Client → API Gateway → Auth Service → Employee Service

## Cara Menjalankan

### 1. Auth Service
cd services/auth-service  
node index.js  

### 2. Employee Service
cd services/employee-service  
php artisan serve  

### 3. API Gateway
cd gateway  
node index.js  

## Authentication
Menggunakan JWT (JSON Web Token)

## Endpoint

### Auth
- POST /auth/login  
- POST /auth/register  

### Employee
- GET /employees  
- POST /employees  
- PUT /employees/{id}  
- DELETE /employees/{id}  

## Testing
Gunakan Postman (folder sudah disediakan)

## Keterangan
API Gateway digunakan sebagai single entry point untuk mengatur routing dan authentication ke setiap service.