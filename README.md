# assignment-workflow-backend
A role-based web application for managing assignments between teachers and students.

# Assignment Workflow Project

A workflow portal for teachers and students to manage and submit assignments.

## Tech Stack
- **Backend**: Node.js, Express js, Prisma, PostgreSQL   

---

## Local Setup

Follow these steps to run the project locally:

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the root directory and add your PostgreSQL connection URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"
```
Replace `username`, `password`, and `dbname` with your local PostgreSQL credentials.

### 4. Run database migrations
```bash
npx prisma migrate dev --name init
```

### 5. Seed the database (optional: adds default user details)
```bash
npm run seed
```

### 6. Start the application
```bash
npm start
```

---

## Features

- **Single login** page for both teachers and students.  
- **Role-based dashboards**:  
  - Teacher → Create, publish, and review assignments.  
  - Student → View assignments and submit answers.  
- **Assignment lifecycle**: Draft → Published → Completed.  
- **Teacher actions**: Review student submissions and mark them as reviewed.  
- **Student actions**: Submit one answer per assignment.  

---

## Notes
- Ensure **PostgreSQL** is running locally before running migrations.  
- Keep your `.env` file private and **do not commit it** to GitHub.  
