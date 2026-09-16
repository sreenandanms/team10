# Hostel Laundry Management System (HLMS)

A full-stack web application designed for hostel laundry operations, evolved from a console-based Java OOP mini project into a decoupled system with a **Java Spring Boot** REST backend, a **MySQL** relational database, and a **Next.js + React + Tailwind CSS** frontend.

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js Frontend (Port 3000)                │
│  - App Router, TypeScript, React, Tailwind CSS              │
│  - Lucide SVG icons (Light Mode, Zero Emojis)               │
│  - Student & Staff Dashboards, Order Placement, Tracking    │
└──────────────────────────────┬──────────────────────────────┘
                               │  REST JSON / CORS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Java Spring Boot Backend (Port 8080)            │
│  - Spring Boot 3.3.4 (Java 21)                              │
│  - Layered Architecture: Controller, Service, Repository    │
│  - Strict OOP Domain Model (Inheritance & Polymorphism)     │
│  - Server-Side Price & Subtotal Calculations                │
│  - Transactional Database Persistence                       │
└──────────────────────────────┬──────────────────────────────┘
                               │  JDBC / Hibernate JPA
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database (Port 3306)               │
│  - Database: laundry_db                                     │
│  - Tables: users, students, staff, laundry_prices,          │
│            laundry_orders, laundry_order_items              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Java OOP Domain Model

The Java backend preserves and demonstrates core OOP principles:

- **Inheritance (`@Inheritance(strategy = InheritanceType.JOINED)`)**:
  - `User.java`: Abstract base entity containing common fields (`id`, `name`, `phone`).
  - `Student.java extends User`: Specializes with `studentId`, `roomNumber`, `department`.
  - `Staff.java extends User`: Specializes with `staffType`.
- **Polymorphism & Method Overriding**:
  - Abstract methods `getRole()` and `getDisplayInfo()` declared in `User` are overridden by `Student` and `Staff` to provide specialized behavior at runtime.
- **Encapsulation**:
  - All domain fields are `private` with public accessors and business methods (`addItem()`, `recalculateTotal()`, `canTransitionTo()`, `calculateSubtotal()`).
- **Composition & Association**:
  - `LaundryOrder` has a 1-to-many composition with `LaundryOrderItem` (`CascadeType.ALL`, `orphanRemoval = true`).
  - `LaundryOrder` has a many-to-one association with `Student`.

---

## 3. Official Rates & Pricing Logic

| Clothing Type | Unit Price |
|---|---|
| **Shirt** | ₹10 / piece |
| **Pant** | ₹15 / piece |
| **Bedsheet** | ₹20 / piece |
| **Towel** | ₹8 / piece |

> **Server-Side Price Calculation**: When a student places an order, the frontend only supplies clothing types and quantities. The Java backend fetches current prices from MySQL, computes `quantity × unit_price` for each line item, validates amounts, and sets the total. The frontend is never the source of truth for billing.

---

## 4. Order Lifecycle Progression

Orders follow a strict linear progression:

$$\text{Pending} \longrightarrow \text{Washing} \longrightarrow \text{Ready} \longrightarrow \text{Delivered}$$

- **Pending**: Order registered and awaiting drop-off.
- **Washing**: Items are in the laundry cycle.
- **Ready**: Cleaned, folded, and ready for pickup.
- **Delivered**: Handed back to the student.

---

## 5. Seed Data (Project Group)

### Students
- `STU001`: Sai Krishna — Room A-101, CSE (Phone: 9876543210)
- `STU002`: Sanvin Sijo — Room A-102, CSE (Phone: 9876543211)
- `STU003`: Savio Aji — Room A-103, CSE (Phone: 9876543212)
- `STU004`: Shifa Sherin P — Room A-104, CSE (Phone: 9876543213)

### Staff
- Ramesh Kumar — Laundry Supervisor (Phone: 9876543220)
- Anand P — Laundry Staff (Phone: 9876543221)

---

## 6. How to Run Locally

### Prerequisites
- Java 21 (OpenJDK 21)
- Apache Maven 3.9+
- MySQL Server (Port 3306)
- Node.js 18+ & npm

### Step 1: Start MySQL Database
```bash
# Using Homebrew on macOS:
brew services start mysql

# Ensure the database exists:
mysql -u root -e "CREATE DATABASE IF NOT EXISTS laundry_db;"
```

### Step 2: Run Java Spring Boot Backend (Port 8080)
```bash
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
mvn clean package -DskipTests
java -jar target/laundry-backend-0.0.1-SNAPSHOT.jar
```
*The backend will automatically start Tomcat on `http://localhost:8080` and seed initial students, staff, and pricing tables.*

### Step 3: Run Next.js Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 7. REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prices` | Active clothing rates |
| `GET` | `/api/students` | List all students (`?search=` supported) |
| `GET` | `/api/students/{id}` | Single student details |
| `POST` | `/api/students` | Register new student |
| `GET` | `/api/orders` | List orders (filters: `studentId`, `status`, `search`) |
| `GET` | `/api/orders/{id}` | Order details with item breakdown |
| `POST` | `/api/orders` | Create order (server calculates total) |
| `PUT` | `/api/orders/{id}/status` | Advance status (`PENDING`, `WASHING`, `READY`, `DELIVERED`) |
| `GET` | `/api/dashboard/stats` | Operational metrics for staff |
| `GET` | `/api/auth/users` | List of demo users for session switcher |
