UrbanMinds Project - NASA Space Apps Challenge
Challenge: Data Pathways to Healthy Cities and Human Settlements

UrbanMinds is a geospatial data visualization platform designed to allow anyone—from urban planners to curious citizens—to explore environmental indicators in any city around the world. Utilizing real-time data from the NASA GIBS (Global Imagery Browse Services) service, the tool offers a clear view of urban health without the need to download or process complex data.

Analyzed Indicators
The platform focuses on three critical issues for urban quality of life, using global and up-to-date NASA data:

 Heat Islands: Visualization of Land Surface Temperature (LST).

 Air Pollution: Analysis of Nitrogen Dioxide (NO₂) concentration.

 Vegetation Health: Exploration of the Normalized Difference Vegetation Index (NDVI).

Solution Architecture (Frontend-Driven)
The new architecture is extremely lightweight and robust:

Backend: A Flask (Python) micro-server with a single function: serving the main webpage (index.html).

Frontend: The heart of the application. A single page application (SPA) built with HTML, TailwindCSS, and JavaScript.

Interactive Map: Leaflet.js is used for visualization.

City Search: The Leaflet Control Geocoder library with the Nominatim provider (based on OpenStreetMap) allows searching for any location.

NASA Data: The data is not downloaded. It is consumed in real-time through the WMS (Web Map Service) protocol of the NASA GIBS service. This eliminates the need for download scripts, data processing, and permanently resolves broken link errors.