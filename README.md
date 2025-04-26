🇫🇷 France Travel Explorer
A full-stack France Travel Guide website built with:

Frontend: React + Vite

Backend: Flask + PostgreSQL

Authentication: JWT Cookies

APIs Integrated: Google Maps, OpenAI, Geocoding APIs, Wikipedia Images

Explore towns across France with descriptions, attractions, map navigation, and personal bookmarks!

🚀 Project Setup
Frontend (React + Vite)
Navigate to frontend folder:
cd frontend
npm install

Create .env file inside frontend:
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

To start the frontend server:
npm run dev

Backend (Flask + PostgreSQL)
Navigate to backend folder:
cd backend

Create and activate a Python virtual environment:
python3 -m venv venv
source venv/bin/activate   # On Mac/Linux
# OR
venv\Scripts\activate      # On Windows

Install Python dependencies inside of the virtual machine:
pip install -r requirements.txt

Now create a .env file inside backend with these variables:
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://travel_admin:Password@localhost:5432/french_travel_db
JWT_SECRET_KEY=your_jwt_secret_key_here
GEOCODING_API_KEY=your_google_geocoding_api_key_here

Start the backend server inside of venv:
python3 app.py

🛠 Database Setup
You need a local PostgreSQL database called french_travel_db.
You have two main options:

Option 1: SQL Dump (Recommended)
If you provide a .sql dump file (easy for others):

Create the database in psql:
createdb french_travel_db

Import the SQL schema and data:
psql french_travel_db < french_travel_dump.sql

🌐 Tech Stack
React + Vite for the frontend

Flask with Flask-JWT-Extended for backend + auth

PostgreSQL for structured town/department/region data

Google Maps API for map features

OpenAI API for generating town descriptions

Google Geocoding API for lat/lon corrections

Wikipedia API for fetching relevant town images

JWT Auth using secure cookies (12-hour inactivity expiration)

✨ Features
🔎 Search towns with autocomplete

🗺 Interactive Google Map navigation

📝 AI-generated town descriptions, histories, attractions

📌 Save bookmarks to your profile

⭐ Rate towns

🛡 Secure login and JWT-based session management

🌎 Bilingual ready (English/French toggleable)

Final Notes:
Make sure PostgreSQL is running locally.

The backend Flask app will serve at http://localhost:5000.

The frontend Vite app will serve at http://localhost:5173.

Make sure your APIs (Google, OpenAI) are active.
