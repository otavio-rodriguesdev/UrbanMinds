🌍 UrbanMinds - Sustainable Urban Planning
🚀 NASA Space Apps Challenge 2024: Data Pathways to Healthy Cities and Human Settlements
UrbanMinds is a powerful, lightweight platform for geospatial data visualization that makes critical urban environmental indicators accessible to everyone. By consuming real-time data directly from the NASA GIBS (Global Imagery Browse Services), the project removes technical barriers, allowing urban planners and citizens to monitor their city's health instantly and efficiently.

✨ Analyzed Indicators (NASA Data)
We focus on three essential pillars for quality of life and urban resilience, using global and up-to-date NASA data:

Indicator	NASA Data (Product)	Urban Relevance
Heat Islands	Land Surface Temperature (LST)	Maps surface heat, essential for mitigating thermal stress in vulnerable neighborhoods.
Air Pollution	Nitrogen Dioxide (NO 2) Concentration	Assesses air quality, crucial for respiratory health and traffic planning.
Vegetation Health	Normalized Difference Vegetation Index (NDVI)	Indicates vegetation density and health, fundamental for green space planning and carbon absorption.

Exportar para as Planilhas
🏗️ Solution Architecture and Aurora AI
UrbanMinds adopts a Frontend-Driven architecture that ensures robustness and low operational cost, complemented by our intelligent analysis engine.

🤖 Aurora: The Heart of the Resolution
In addition to data visualization, the platform integrates a problem analysis module called Aurora.

Functionality: Aurora is our Artificial Intelligence designed to receive an infrastructure problem provided by the user and generate a resolution or sustainable development suggestion, connecting local issues to practical, eco-friendly solutions.

Core Technology Stack
Frontend (SPA): HTML, Vanilla JavaScript, and TailwindCSS for agile interface development.

Map Service: Leaflet.js for efficient interactive map rendering.

Location Search: Leaflet Control Geocoder (using Nominatim/OpenStreetMap) for global city searching.

Data Innovation: Real-Time Consumption (WMS)
The most robust feature of the architecture is that no NASA data is downloaded or permanently stored.

The project consumes data layers in real-time directly via the WMS (Web Map Service) protocol of the NASA GIBS service.

Advantage: This eliminates the need for complex download scripts, data processing, and permanently resolves issues with broken links or outdated data. The platform always displays the latest visualization available from NASA.

Minimalist Backend
Backend: A Flask (Python) micro-server.

Single Function: Its sole responsibility is to serve the main page (index.html) and static code, keeping the server's complexity and carbon footprint extremely low.

🔗 Links and Resources
Resource	Status	Link
Demonstration (Demo)	Online	[LINK DA DEMONSTRAÇÃO AQUI]
Presentation Slides	Available	[LINK PARA O SLIDESHARE / GOOGLE SLIDES AQUI]
Technical Documentation	In progress	[LINK PARA DOCUMENTAÇÃO / CONFLUENCE / WIKI AQUI]


🧑‍💻 Team
This project was developed by:

[Otávio Rodrigues] - Developer

[Emmily Vitória] - Designer

[Diego Stoque] - Developer

[Mateus Maciel] - Copywriter

[Fellipe Gabriel] - Designer
