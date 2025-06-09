# 🌐 DIAPS - Disaster Information Aggregation and Prediction Software

**DIAPS** is a real-time disaster risk monitoring and visualization platform. It aggregates weather, elevation, and seismic data to calculate and present risk levels for natural disasters such as **floods**, **heavy rain**, **landslides**, and **tsunamis**. With an interactive map and detailed location analysis, DIAPS empowers communities, responders, and researchers with timely insights to stay prepared.

---

## 🚀 Features

- 📍 **Location-Based Analysis**  
  Get instant disaster risk data for any location using geolocation or manual map selection.

- 🌦️ **Real-Time Weather Forecasts**  
  Integrated with WeatherAPI for 3-day forecasts including temperature, wind, and precipitation.

- 🌊 **Disaster Risk Calculation**  
  Intelligent algorithms assess risk levels for:
  - Floods
  - Heavy Rain
  - Landslides
  - Tsunamis

- 📊 **Interactive Risk Visualization**  
  View risks in a clean and animated bar chart using Chart.js.

- 🌐 **Earthquake Monitoring**  
  Displays recent seismic events from the USGS within a selected region.

- 🗺️ **Interactive Leaflet Map**  
  Navigate, click, and explore disaster data for any point globally.

- 🎨 **Modern Responsive UI**  
  Built with glassmorphism, animated backgrounds, and mobile-friendly layouts.

---

## 📁 Project Structure

```bash
.
├── index.html            # Main page with interactive map and dashboard
├── details.html          # Location-specific weather and disaster analysis
├── index.js              # Core logic for homepage/map interaction
├── details.js            # Logic for fetching and rendering data in details view
├── script.js             # UI enhancements and control logic
├── style.css             # Modern responsive styles with animations
├── LICENSE               # License file
├── .gitattributes        # Git configuration
└── favicon.png           # Site favicon (recommended: 3D icon via Sora)

```
---

## ⚙️ Setup Instructions

### 1. **Clone or Download This Project**
```
git clone https://github.com/HussainRaza17/diaps.git
cd diaps

```

### 2. **Get Your API Keys**
| API              | Source                      | Free Tier  | Link                                      |
|------------------|-----------------------------|------------|-------------------------------------------|
| WeatherAPI       | https://www.weatherapi.com/ | ✅         | Get free key & upgrade for more requests  |


### 3. **Run locally**
Open index.html directly in a browser or use a local server:
```
# With Python 3
python -m http.server

```
---

## 🧠 Technologies Used
- **HTML5, CSS3** (Glassmorphism, Animations)
- **JavaScript** (Vanilla JS, Modern ES6+)
- **Leaflet.js** (Interactive Maps)
- **Chart.js** (Risk Visualizations)
- **WeatherAPI** (Forecast Data)
- **USGS Earthquake API**
- **Open Elevation API**

---

## 🛡️ License
This project is licensed under the MIT License.

---

## ✨ Credits
- Developed by **Mohammad Hussain Raza**
- Data sources: WeatherAPI, USGS, Open Elevation

---

## 🌍 Stay Prepared. Stay Safe.
DIAPS is built to empower decision-making and early response in the face of natural disasters.