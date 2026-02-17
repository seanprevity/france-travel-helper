### 🇫🇷 France Travel Explorer

A **full-stack France Travel** Guide built to explore and learn about towns across France — featuring interactive maps, AI-generated descriptions, local weather, and personalized bookmarks.

### Overview

France Travel Explorer lets you explore and filter through thousands of French cities with detailed descriptions, attractions, maps, and user bookmarks — all in an elegant bilingual interface.

---

### Stack

- **Frontend**: Next.js
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (hosted on Supabase/locally)
- **Authentication**: AWS Cognito via Amplify Auth
- **APIs Integrated**: Mapbox, OpenAI, Geocoding APIs, Wikipedia Images, WeatherAPI

## Setup

### Frontend (Next.js)

1. Navigate to frontend folder:

```shellscript
cd client
npm install
```


2. Create `.env` file inside frontend:

```plaintext
NEXT_PUBLIC_BASE_API_URL=http://localhost:3000
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your_aws_user_pool_id_here
NEXT_PUBLIC_AWS_COGNITO_USER_CLIENT_ID=your_aws_client_id_here
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```


3. To start the frontend dev server:

```shellscript
npm run dev
```

The frontend will run at http://localhost:3000  


### Backend (Node.js + Express + PostgreSQL)

1. Navigate to backend folder:

```shellscript
cd server
npm install
```


2. Create a `.env` file inside backend with these variables:

```plaintext
PORT=3001
DATABASE_URL=your_postgres_url_here
OPENAI_API_KEY=your_openai_api_key_here
WEATHER_API_KEY=your_weatherapi_api_key_here
```


3. Start the backend server:

```shellscript
npx ts-node ./src/index.ts
```




---

## 🛠 Database Setup

You'll need a local PostgreSQL database called `french_travel_db`.

### SQL Dump

1. Create the database in psql:

```shellscript
createdb french_travel_db
```


2. Import the SQL schema and data from the .sql dump:

```shellscript
psql french_travel_db < new_french_dump_2.sql
```

If you’re using Supabase, import the same SQL dump file through the Supabase dashboard. Make sure to connect to the database through the ipv4 compatible session pooler link.




---

## Tech Stack

- **NextJS** for the frontend
- **Node/Express + AWS Cognito/Amplify Auth** for backend + login/authentication
- **PostgreSQL** for structured city/department/region data
- **MapBox API** for map features
- **OpenAI API** for generating city descriptions
- **Google Geocoding API** for precise latitude and longitude coordinates
- **Wikipedia API** for fetching relevant city images
- **Weather API** for local weather forecasts


---

## Notes

- Make sure PostgreSQL is running via supabase or locally before starting the backend.
- Make sure your APIs (MapBox, OpenAI, Weather) are active.
- The backend Node.js + Express app will serve at [http://localhost:3001](http://localhost:3001).
- The frontend Next app will serve at [http://localhost:3000](http://localhost:3000).
