# 🚀 User Management System (MERN Stack)

A full-stack **User Management System** built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).  
This application allows administrators to manage users efficiently with features like **adding, editing, deleting, searching, pagination, and profile image uploads**.

Profile images are securely stored on **Cloudinary Cloud Storage**.

---

## ✨ Features

### ✅ Backend
- Create User with Profile Image Upload  
- Update User Details  
- Delete User  
- Get All Users with Pagination  
- Search Users by Name  
- Get Single User Details  
- Export Users to CSV  
- Cloudinary Integration for Image Storage  

### ✅ Frontend
- Responsive UI (Desktop & Mobile)  
- Add / Edit User Form  
- Image Preview Before Upload  
- User Listing Table  
- View User Details Page  
- Pagination  
- Search Users  
- Form Validation  
- Toast Notifications  

---

## 🧰 Tech Stack

### Frontend
- React.js (Vite)  
- Tailwind CSS  
- Axios  
- React Router DOM  

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- Multer  
- Cloudinary  
- json2csv  
- dotenv  

---

## 📁 Project Structure

USER-MANAGEMENT-SYSTEM
│
├── backend
│ ├── src
│ │ ├── config
│ │ ├── controllers
│ │ ├── models
│ │ ├── routes
│ │ └── server.js
│ ├── .env
│ └── package.json
│
├── frontend
│ ├── src
│ │ ├── pages
│ │ ├── services
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env
│ └── package.json
│
└── README.md


---

## ☁️ Cloudinary Image Upload (How It Works)
Profile images are uploaded using:  
1. **Multer** → Handles file upload from frontend  
2. **Cloudinary SDK** → Uploads image to Cloudinary  
3. **MongoDB** → Stores the returned image URL  

### Libraries Used
```bash
 npm install cloudinary multer multer-storage-cloudinary 
```

## Supported Image Formats

JPG
JPEG
PNG
WEBP


## Backend Setup
- cd backend
- npm install
- npm run dev

## Frontend Setup
- cd frontend
- npm install
- npm run dev

-------