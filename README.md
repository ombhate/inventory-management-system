# Inventory Management System 📦

A full-stack enterprise web application engineered to streamline stock control, enhance product categorization, and provide real-time inventory monitoring. Built with a high-performance Java Spring Boot REST API backend, a relational MySQL database layer, and an interactive Angular frontend.

---

## 🚀 Tech Stack

- **Frontend:** Angular 22, TypeScript, RxJS, Bootstrap 5, Bootstrap Icons
- **Backend:** Java, Spring Boot (REST API running on port `8088`), Spring Data JPA
- **Database:** MySQL
- **Tooling & Build:** Node.js, npm, Maven / Gradle, Git & GitHub

---

## ✨ Key Features & Functionality

- **Full Product Lifecycle (CRUD):** Add, update, and monitor inventory items seamlessly. Employs soft-status toggles (active/inactive) to maintain database historical integrity.
- **Strict Input Validation:** Enforces custom regex validation patterns (`^[a-zA-Z\s]+$`) on product names to block numbers and special characters.
- **Real-Time Search & Filtering:** Features debounced real-time search (by product name or SKU), dynamic category dropdown filtering, and dedicated views for low-stock items.
- **Automated Stock Monitoring:** Visual stock badges categorizing items into **In Stock**, **Low Stock** (<= 10 items), and **Out of Stock**, alongside a quick-adjustment stock update modal.
- **Dynamic Category Management:** Create and manage product categories dynamically on the fly without page refreshes.
- **Session Safeguards:** Includes route protections and interactive confirmation alerts on logout to prevent accidental session termination.

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
- Node.js & npm installed
- Java JDK 17+
- MySQL Server running locally

### 1. Database Setup
1. Create a local MySQL database (e.g., `inventory_db`).
2. Update your Spring Boot `application.properties` with your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
   spring.datasource.username=YOUR_MYSQL_USER
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   server.port=8088
2. Backend Setup (Spring Boot)

# Navigate to backend directory
cd inventory-backend

# Run the application
mvn spring-boot:run
The REST API will start on http://localhost:8088.

3. Frontend Setup (Angular)

# Navigate to frontend directory
cd inventory-ui

# Install dependencies
npm install

# Start the Angular development server
ng serve
Navigate to http://localhost:4200/ in your browser.

📜 License & Acknowledgments
Developed as a full-stack engineering assignment demonstrating robust API design, database persistence, and modular client architecture.


---

### How to Add This to GitHub:

1. Go to your repository page on **GitHub**.
2. Click **Add a README** (or click **Add file** $\rightarrow$ **Create new file** and name it `README.md`).
3. Copy and paste the markdown block above into the file editor.
4. Click **Commit changes...** at the top right.
