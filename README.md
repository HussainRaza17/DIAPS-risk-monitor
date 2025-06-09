# 🌍 Disaster Risk Dashboard

This project provides a **real-time disaster risk monitoring dashboard**. It calculates potential risks for **Floods**, **Heavy Rain**, **Landslides**, and **Tsunamis**, based on live weather, elevation, and earthquake data.

---

## 🚀 Features
- 📍 **Location-Based Analysis**: Enter your coordinates (latitude, longitude) or use geolocation.
- 🌦️ **Real-Time Weather Data** (WeatherAPI)
- 🔔 **Disaster Risk Calculations**: Flood, Heavy Rain, Landslide, Tsunami
- 📊 **Risk Visualization Chart** (Chart.js)
- 🌐 **Responsive UI**

---

## 📁 Project Structure
```
/ (root)
├── index.html        # Home page
├── details.html      # Details & risk calculation page
├── index.js          # Logic for index.html
├── details.js        # Logic for details.html (Disaster risks)
├── style.css         # Styling
├── favicon.ico/png   # Favicon 
└── README.md         # Project information
```

---

## ⚙️ Setup Instructions

### 1. **Clone or Download This Project**
```
git clone <your-repo-url>
```

### 2. **Get Your API Keys**
| API              | Source                      | Free Tier  | Link                                      |
|------------------|-----------------------------|------------|-------------------------------------------|
| WeatherAPI       | https://www.weatherapi.com/ | ✅         | Get free key & upgrade for more requests  |

#### 🔑 Add your WeatherAPI Key:
In `details.js` (near the top):
```javascript
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';
```

### 3. **Run the Project**
Simply open `index.html` in a browser:
```
file:///path-to-your-project/index.html
```

Or serve with a local development server:
```
Live Server (VSCode Extension)
python -m http.server (Python)
```
---

## 🛠️ Built With
- **HTML, CSS, JS**
- **Chart.js** (risk chart visualization)
- **WeatherAPI** (weather + forecast)

---

## 📜 License
This project is open-source for educational purposes. Feel free to fork and customize!

