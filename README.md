# ZenShift

A progressive web application for employee and company management, built with Nuxt 3 (frontend) and ASP.NET Core + Entity Framework (backend).

Features

🔐 Authentication & Roles: Secure login/registration with JWT, role-based access (Admin / Employee).

🕒 Arbeitszeiten: Employees can log work hours; admins can view, filter, and export reports.

🌴 Urlaub Management: Employees submit vacation requests; admins approve/deny and track status.

🚗 Car-Sharing Map: Employees with cars can share approximate home locations on a map (Leaflet + OpenStreetMap) to organize rides with colleagues nearby.

📱 PWA Ready: Installable, responsive design.

## Tech Stack:

Frontend: Nuxt 3 + TypeScript, Pinia, VueUse, Vite, TailwindCSS

Backend: ASP.NET Core 9 Web API,C# Entity Framework Core

Auth: JWT access + refresh tokens, role-based (Admin, Employee), password hashing.

## Setup

### BackEnd

cd backend
dotnet restore
dotnet ef database update
dotnet run

### frontEnd

Make sure to install the dependencies:

```bash
# npm
npm install
npm run dev
```
