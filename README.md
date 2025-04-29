### 🇫🇷 France Travel Explorer

A full-stack France Travel Guide website built with:

- **Frontend**: React + Vite
- **Backend**: Flask + PostgreSQL
- **Authentication**: JWT Cookies
- **APIs Integrated**: Google Maps, OpenAI, Geocoding APIs, Wikipedia Images


Explore towns across France with descriptions, attractions, map navigation, and personal bookmarks!

---

## 🚀 Project Setup

### Frontend (React + Vite)

1. Navigate to frontend folder:

```shellscript
cd frontend
npm install
```


2. Create `.env` file inside frontend:

```plaintext
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```


3. To start the frontend server:

```shellscript
npm run dev
```




### Backend (Flask + PostgreSQL)

1. Navigate to backend folder:

```shellscript
cd backend
```


2. Create and activate a Python virtual environment:

```shellscript
python3 -m venv venv

# On Mac/Linux
source venv/bin/activate

# On Windows
venv\Scripts\activate
```


3. Install Python dependencies inside of the virtual machine:

```shellscript
pip install -r requirements.txt
```


4. Create a `.env` file inside backend with these variables:

```plaintext
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://travel_admin:Password@localhost:5432/french_travel_db
JWT_SECRET_KEY=your_jwt_secret_key_here
GEOCODING_API_KEY=your_google_geocoding_api_key_here
WEATHER_API_KEY=your_weatherapi_api_key_here
```


5. Start the backend server inside of venv:

```shellscript
python3 app.py
```




---

## 🛠 Database Setup

You need a local PostgreSQL database called `french_travel_db`.

### SQL Dump

1. Create the database in psql:

```shellscript
createdb french_travel_db
```


2. Import the SQL schema and data from the .sql dump:

```shellscript
psql french_travel_db < french_travel_dump.sql
```




---

## 🌐 Tech Stack

- **React + Vite** for the frontend
- **Flask with Flask-JWT-Extended** for backend + auth
- **PostgreSQL** for structured town/department/region data
- **Google Maps API** for map features
- **OpenAI API** for generating town descriptions
- **Google Geocoding API** for lat/lon corrections
- **Wikipedia API** for fetching relevant town images
- **Weather API** for pulling weather data on a town
- **JWT Auth** using secure cookies (12-hour inactivity expiration)


---

## ✨ Features

- 🔎 Search towns with autocomplete
- 🗺 Interactive Google Map navigation
- ☀️ Up-to-date weather statistics
- 📝 AI-generated town descriptions, histories, attractions
- 📌 Save bookmarks to your profile
- ⭐ Rate towns
- 🛡 Secure login and JWT-based session management
- 🌎 Bilingual ready (English/French toggleable)


---

## Final Notes

- Make sure PostgreSQL is running locally.
- The backend Flask app will serve at [http://localhost:5000](http://localhost:5000).
- The frontend Vite app will serve at [http://localhost:5173](http://localhost:5173).
- Make sure your APIs (Google, OpenAI) are active.