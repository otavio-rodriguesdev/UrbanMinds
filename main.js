document.addEventListener('DOMContentLoaded', function () {

    const map = L.map('map', { zoomControl: false }).setView([20, 0], 3);
    L.control.zoom({ position: 'topright' }).addTo(map);
    let markersLayer = new L.LayerGroup().addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: 'Mapa base &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd'
    }).addTo(map);

    const vegetationLayer = {
        name: 'MODIS_Terra_NDVI_8Day',
        endpoint: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi',
    };

    // --- BASE DE DADOS MASSIVA COM QUASE 50 CIDADES ---
    const citiesData = {
    // AMERICAS
    'São Paulo': [
        { name: 'Ibirapuera Park', coords: [-23.588, -46.658], type: 'park', info: { heat: { value: '25°C', label: 'Cool', analysis: 'Dense vegetation lowers the temperature, creating a "cool island."' }, air: { value: '15 µmol/m²', label: 'Low', analysis: 'Trees act as natural filters, improving air quality.' }, vegetation: { value: '0.78 NDVI', label: 'High', analysis: 'Healthy vegetation index.' } } },
        { name: 'Paulista Avenue', coords: [-23.561, -46.656], type: 'urban', info: { heat: { value: '33°C', label: 'Very Hot', analysis: 'Asphalt and buildings retain heat, intensifying the urban heat island.' }, air: { value: '150 µmol/m²', label: 'Very High', analysis: 'High concentration of pollutants due to intense vehicle traffic.' }, vegetation: { value: '0.12 NDVI', label: 'Very Low', analysis: 'Scarce vegetation, limited to flower beds.' } } }
    ],
    'Rio de Janeiro': [
        { name: 'Tijuca National Park', coords: [-22.95, -43.28], type: 'park', info: { heat: { value: '26°C', label: 'Cool', analysis: 'Extensive forest area that regulates the local temperature.' }, air: { value: '10 µmol/m²', label: 'Very Low', analysis: 'Pure air due to the enormous mass of vegetation.' }, vegetation: { value: '0.85 NDVI', label: 'Very High', analysis: 'One of the largest urban forests in the world.' } } },
        { name: 'Downtown', coords: [-22.90, -43.17], type: 'urban', info: { heat: { value: '33°C', label: 'Hot', analysis: 'Densely built-up area with poor ventilation.' }, air: { value: '130 µmol/m²', label: 'High', analysis: 'Pollution from traffic and the port area.' }, vegetation: { value: '0.10 NDVI', label: 'Low', analysis: 'Few green areas in the historic center.' } } }
    ],
    'Buenos Aires': [
        { name: 'Palermo Woods', coords: [-34.57, -58.41], type: 'park', info: { heat: { value: '23°C', label: 'Cool', analysis: 'Large urban park that functions as a lung for the city.' }, air: { value: '25 µmol/m²', label: 'Low', analysis: 'Air quality is visibly better inside the park.' }, vegetation: { value: '0.75 NDVI', label: 'High', analysis: 'Well-preserved vegetation with lakes.' } } },
        { name: 'Plaza de Mayo', coords: [-34.60, -58.37], type: 'urban', info: { heat: { value: '30°C', label: 'Hot', analysis: 'Historic and political heart, with many buildings and asphalt.' }, air: { value: '110 µmol/m²', label: 'High', analysis: 'Intense traffic of vehicles and tourist buses.' }, vegetation: { value: '0.08 NDVI', label: 'None', analysis: 'Almost no vegetation.' } } }
    ],
    'Mexico City': [
        { name: 'Chapultepec Forest', coords: [19.41, -99.18], type: 'park', info: { heat: { value: '21°C', label: 'Cool', analysis: 'One of the largest parks in Latin America, essential for the city.' }, air: { value: '80 µmol/m²', label: 'Moderate', analysis: 'Helps to mitigate the city\'s general pollution, but is still affected.' }, vegetation: { value: '0.80 NDVI', label: 'High', analysis: 'Extensive forest area.' } } },
        { name: 'Zócalo', coords: [19.43, -99.13], type: 'urban', info: { heat: { value: '27°C', label: 'Hot', analysis: 'Huge concrete square that absorbs a lot of heat.' }, air: { value: '180 µmol/m²', label: 'Very High', analysis: 'Location with a high concentration of traffic and people.' }, vegetation: { value: '0.02 NDVI', label: 'None', analysis: 'Total absence of vegetation.' } } }
    ],
    'Toronto': [
        { name: 'High Park', coords: [43.64, -79.46], type: 'park', info: { heat: { value: '19°C', label: 'Cool', analysis: 'Large park with natural habitat, lakes, and recreational areas.' }, air: { value: '20 µmol/m²', label: 'Low', analysis: 'Air quality significantly improved by vegetation.' }, vegetation: { value: '0.78 NDVI', label: 'High', analysis: 'Mixture of forest and well-maintained gardens.' } } },
        { name: 'Yonge-Dundas Square', coords: [43.65, -79.38], type: 'urban', info: { heat: { value: '26°C', label: 'Hot', analysis: 'Commercial heart with tall buildings and screens, creating a heat island.' }, air: { value: '95 µmol/m²', label: 'High', analysis: 'Peak pollution due to constant traffic.' }, vegetation: { value: '0.06 NDVI', label: 'None', analysis: 'Completely urbanized area.' } } }
    ],
      'New York': [
        { name: 'Central Park', coords: [40.782, -73.965], type: 'park', info: { heat: { value: '22°C', label: 'Cool', analysis: 'The large body of water and dense vegetation create a milder microclimate.' }, air: { value: '45 µmol/m²', label: 'Moderate', analysis: 'Pollution from the surrounding city affects the park.' }, vegetation: { value: '0.81 NDVI', label: 'Very High', analysis: 'One of the healthiest urban green areas in the world.' } } },
        { name: 'Times Square', coords: [40.758, -73.985], type: 'urban', info: { heat: { value: '29°C', label: 'Hot', analysis: 'Lack of vegetation and crowds contribute to the temperature increase.' }, air: { value: '120 µmol/m²', label: 'High', analysis: 'Point of high concentration of traffic and pollutants.' }, vegetation: { value: '0.05 NDVI', label: 'None', analysis: 'Virtually no vegetation present.' } } }
    ],
    'Los Angeles': [
        { name: 'Griffith Park', coords: [34.13, -118.29], type: 'park', info: { heat: { value: '28°C', label: 'Moderate', analysis: 'Large park with native vegetation, but in a hot and dry climate.' }, air: { value: '60 µmol/m²', label: 'Moderate', analysis: 'Located on a hill, it sits above some of the pollution in the LA basin.' }, vegetation: { value: '0.60 NDVI', label: 'Medium', analysis: 'Vegetation adapted to the semi-arid climate.' } } },
        { name: 'Downtown LA', coords: [34.05, -118.24], type: 'urban', info: { heat: { value: '35°C', label: 'Very Hot', analysis: 'Classic heat island due to skyscraper density.' }, air: { value: '140 µmol/m²', label: 'High', analysis: 'Concentration of pollution due to traffic and topography.' }, vegetation: { value: '0.11 NDVI', label: 'Low', analysis: 'Very few trees and green spaces.' } } }
    ],
    'Vancouver': [
        { name: 'Stanley Park', coords: [49.30, -123.14], type: 'park', info: { heat: { value: '18°C', label: 'Cool', analysis: 'Huge temperate rainforest surrounded by the ocean.' }, air: { value: '10 µmol/m²', label: 'Very Low', analysis: 'Extremely pure air, coming from the Pacific.' }, vegetation: { value: '0.88 NDVI', label: 'Very High', analysis: 'Mature and dense forest.' } } },
        { name: 'Gastown', coords: [49.28, -123.10], type: 'urban', info: { heat: { value: '22°C', label: 'Moderate', analysis: 'Historic district with brick buildings, but with a sea breeze.' }, air: { value: '40 µmol/m²', label: 'Low', analysis: 'Generally good air quality.' }, vegetation: { value: '0.15 NDVI', label: 'Low', analysis: 'Street trees and small planters.' } } }
    ],
    'Chicago': [
        { name: 'Millennium Park', coords: [41.88, -87.62], type: 'park', info: { heat: { value: '24°C', label: 'Moderate', analysis: 'Modern park with open spaces and gardens.' }, air: { value: '70 µmol/m²', label: 'Moderate', analysis: 'Located downtown, it suffers from surrounding pollution.' }, vegetation: { value: '0.65 NDVI', label: 'Medium', analysis: 'Combination of lawn and design gardens.' } } },
        { name: 'The Loop', coords: [41.87, -87.62], type: 'urban', info: { heat: { value: '29°C', label: 'Hot', analysis: 'Financial heart with skyscraper "canyons" that trap heat.' }, air: { value: '110 µmol/m²', label: 'High', analysis: 'Intense traffic and low air circulation.' }, vegetation: { value: '0.07 NDVI', label: 'Low', analysis: 'Rooftop gardens are the main form of vegetation.' } } }
    ],
    'Santiago': [
        { name: 'San Cristóbal Hill', coords: [-33.42, -70.62], type: 'park', info: { heat: { value: '25°C', label: 'Moderate', analysis: 'Large metropolitan park on a hill, with city views.' }, air: { value: '100 µmol/m²', label: 'High', analysis: 'Altitude helps, but Santiago\'s pollution gets trapped in the valley.' }, vegetation: { value: '0.55 NDVI', label: 'Medium', analysis: 'Native vegetation adapted to the dry climate.' } } },
        { name: 'Plaza de Armas', coords: [-33.43, -70.65], type: 'urban', info: { heat: { value: '31°C', label: 'Hot', analysis: 'Historic center with lots of pavement and buildings.' }, air: { value: '160 µmol/m²', label: 'Very High', analysis: 'One of the points with the worst air quality in the city.' }, vegetation: { value: '0.10 NDVI', label: 'Low', analysis: 'Only a few palm trees and flower beds.' } } }
    ],

    // EUROPE
    'Lisbon': [
        { name: 'Monsanto Forest Park', coords: [38.72, -9.18], type: 'park', info: { heat: { value: '24°C', label: 'Cool', analysis: 'Extensive forest area that functions as the "city\'s lung."' }, air: { value: '15 µmol/m²', label: 'Very Low', analysis: 'Excellent air quality.' }, vegetation: { value: '0.82 NDVI', label: 'High', analysis: 'Dense and well-established forest.' } } },
        { name: 'Baixa Pombalina', coords: [38.71, -9.13], type: 'urban', info: { heat: { value: '30°C', label: 'Hot', analysis: 'Historic area with narrow streets and high construction density.' }, air: { value: '85 µmol/m²', label: 'Moderate', analysis: 'Pollution from traffic and proximity to the Tagus River.' }, vegetation: { value: '0.09 NDVI', label: 'Low', analysis: 'Very little vegetation.' } } }
    ],
    'Madrid': [
        { name: 'Buen Retiro Park', coords: [40.41, -3.68], type: 'park', info: { heat: { value: '26°C', label: 'Cool', analysis: 'Large central park that offers a refuge from Madrid\'s intense heat.' }, air: { value: '40 µmol/m²', label: 'Low', analysis: 'Air quality is considerably better inside the park.' }, vegetation: { value: '0.77 NDVI', label: 'High', analysis: 'Well-maintained gardens, trees, and a large lake.' } } },
        { name: 'Puerta del Sol', coords: [40.41, -3.70], type: 'urban', info: { heat: { value: '34°C', label: 'Very Hot', analysis: 'Large paved square that becomes an oven in the summer.' }, air: { value: '130 µmol/m²', label: 'High', analysis: 'City\'s nerve center with a lot of traffic and people.' }, vegetation: { value: '0.01 NDVI', label: 'None', analysis: 'Fully paved.' } } }
    ],
    'London': [
        { name: 'Hyde Park', coords: [51.507, -0.165], type: 'park', info: { heat: { value: '18°C', label: 'Cool', analysis: 'Large green area that serves as a climate refuge in the city.' }, air: { value: '30 µmol/m²', label: 'Low', analysis: 'Notably better air quality.' }, vegetation: { value: '0.79 NDVI', label: 'High', analysis: 'Lush and well-maintained vegetation.' } } },
        { name: 'City of London', coords: [51.515, -0.091], type: 'urban', info: { heat: { value: '23°C', label: 'Hot', analysis: 'Financial district with high building density.' }, air: { value: '90 µmol/m²', label: 'Moderate', analysis: 'Congestion and urban "canyons" trap pollutants.' }, vegetation: { value: '0.15 NDVI', label: 'Low', analysis: 'Small squares and rooftop gardens.' } } }
    ],
    'Paris': [
        { name: 'Luxembourg Gardens', coords: [48.84, 2.33], type: 'park', info: { heat: { value: '20°C', label: 'Cool', analysis: 'Historic garden with many mature trees that provide shade.' }, air: { value: '50 µmol/m²', label: 'Moderate', analysis: 'An oasis of cleaner air in the center of Paris.' }, vegetation: { value: '0.76 NDVI', label: 'High', analysis: 'Formal garden design with lawns and forest.' } } },
        { name: 'La Défense', coords: [48.89, 2.24], type: 'urban', info: { heat: { value: '27°C', label: 'Very Hot', analysis: 'Modern business district with glass and concrete, creating a strong heat island.' }, air: { value: '100 µmol/m²', label: 'Moderate', analysis: 'Less direct traffic, but still affected by general pollution.' }, vegetation: { value: '0.09 NDVI', label: 'None', analysis: 'Almost entirely built environment.' } } }
    ],
    'Rome': [
        { name: 'Villa Borghese', coords: [41.91, 12.48], type: 'park', info: { heat: { value: '27°C', label: 'Moderate', analysis: 'Large landscaped park that offers shade and coolness.' }, air: { value: '75 µmol/m²', label: 'Moderate', analysis: 'Vegetation helps filter pollution from Roman traffic.' }, vegetation: { value: '0.72 NDVI', label: 'High', analysis: 'Wide green area with pine trees and fountains.' } } },
        { name: 'Colosseum', coords: [41.89, 12.49], type: 'urban', info: { heat: { value: '33°C', label: 'Hot', analysis: 'Tourist area with a lot of stone paving that retains heat.' }, air: { value: '115 µmol/m²', label: 'High', analysis: 'Constant pollution from intense traffic in the surrounding area.' }, vegetation: { value: '0.13 NDVI', label: 'Low', analysis: 'Little vegetation beyond a few scattered trees.' } } }
    ],
    'Berlin': [
        { name: 'Tiergarten', coords: [52.51, 13.35], type: 'park', info: { heat: { value: '19°C', label: 'Cool', analysis: 'Huge forest park in the heart of the city.' }, air: { value: '25 µmol/m²', label: 'Low', analysis: 'Excellent air quality, a refuge for residents.' }, vegetation: { value: '0.81 NDVI', label: 'Very High', analysis: 'Dense forest with canals and clearings.' } } },
        { name: 'Alexanderplatz', coords: [52.52, 13.41], type: 'urban', info: { heat: { value: '25°C', label: 'Hot', analysis: 'Vast public square with a lot of concrete surface.' }, air: { value: '80 µmol/m²', label: 'Moderate', analysis: 'Transportation hub with bus and tram emissions.' }, vegetation: { value: '0.05 NDVI', label: 'None', analysis: 'Fully urbanized.' } } }
    ],
    'Moscow': [
        { name: 'Gorky Park', coords: [55.72, 37.60], type: 'park', info: { heat: { value: '17°C', label: 'Cool', analysis: 'Large cultural park along the Moskva River.' }, air: { value: '35 µmol/m²', label: 'Low', analysis: 'Popular leisure area with cleaner air.' }, vegetation: { value: '0.75 NDVI', label: 'High', analysis: 'Combination of formal gardens and wooded areas.' } } },
        { name: 'Red Square', coords: [55.75, 37.62], type: 'urban', info: { heat: { value: '23°C', label: 'Moderate', analysis: 'Large paved area, but Moscow\'s cold climate moderates temperatures.' }, air: { value: '90 µmol/m²', label: 'Moderate', analysis: 'Intense traffic on the surrounding streets.' }, vegetation: { value: '0.01 NDVI', label: 'None', analysis: 'Completely paved.' } } }
    ],
    'Istanbul': [
        { name: 'Gülhane Park', coords: [41.01, 28.98], type: 'park', info: { heat: { value: '25°C', label: 'Cool', analysis: 'Historic park next to Topkapi Palace, with a Bosphorus breeze.' }, air: { value: '60 µmol/m²', label: 'Moderate', analysis: 'The air is better than in the rest of the old city.' }, vegetation: { value: '0.68 NDVI', label: 'Medium', analysis: 'Gardens and old trees.' } } },
        { name: 'Sultanahmet Square', coords: [41.00, 28.97], type: 'urban', info: { heat: { value: '31°C', label: 'Hot', analysis: 'Large tourist square between Hagia Sophia and the Blue Mosque.' }, air: { value: '110 µmol/m²', label: 'High', analysis: 'Pollution from tourist buses and crowds.' }, vegetation: { value: '0.10 NDVI', label: 'Low', analysis: 'Limited to flower beds.' } } }
    ],
    'Amsterdam': [
        { name: 'Vondelpark', coords: [52.35, 4.86], type: 'park', info: { heat: { value: '18°C', label: 'Cool', analysis: 'The city\'s most famous park, with lakes and trees.' }, air: { value: '30 µmol/m²', label: 'Low', analysis: 'Air quality benefiting from the car ban in many areas.' }, vegetation: { value: '0.77 NDVI', label: 'High', analysis: 'Well-maintained vegetation.' } } },
        { name: 'Dam Square', coords: [52.37, 4.89], type: 'urban', info: { heat: { value: '22°C', label: 'Moderate', analysis: 'Paved historic center, but the mild climate prevents extreme heat.' }, air: { value: '75 µmol/m²', label: 'Moderate', analysis: 'Pollution from trams, buses, and tourist crowds.' }, vegetation: { value: '0.04 NDVI', label: 'None', analysis: 'Fully built-up.' } } }
    ],

    // ASIA
    'Tokyo': [
        { name: 'Ueno Park', coords: [35.71, 139.77], type: 'park', info: { heat: { value: '26°C', label: 'Cool', analysis: 'Large cultural park that offers a refuge from the city\'s heat.' }, air: { value: '70 µmol/m²', label: 'Moderate', analysis: 'Air quality is better, but still influenced by the megalopolis.' }, vegetation: { value: '0.70 NDVI', label: 'High', analysis: 'Many trees, shrines, and a lake.' } } },
        { name: 'Shibuya Crossing', coords: [35.659, 139.700], type: 'urban', info: { heat: { value: '34°C', label: 'Very Hot', analysis: 'Extreme heat from asphalt, buildings, screens, and crowds.' }, air: { value: '160 µmol/m²', label: 'High', analysis: 'One of the world\'s busiest crossings.' }, vegetation: { value: '0.04 NDVI', label: 'None', analysis: 'An iconic example of a "concrete desert."' } } }
    ],
    'Seoul': [
        { name: 'Namsan Park', coords: [37.55, 126.98], type: 'park', info: { heat: { value: '23°C', label: 'Cool', analysis: 'Mountain in the city center, covered by forest.' }, air: { value: '55 µmol/m²', label: 'Moderate', analysis: 'Acts as a natural barrier to pollution.' }, vegetation: { value: '0.80 NDVI', label: 'High', analysis: 'Dense and native vegetation.' } } },
        { name: 'Myeongdong', coords: [37.56, 126.98], type: 'urban', info: { heat: { value: '30°C', label: 'Hot', analysis: 'Busy commercial area with narrow streets and many buildings.' }, air: { value: '125 µmol/m²', label: 'High', analysis: 'High density of people and traffic.' }, vegetation: { value: '0.07 NDVI', label: 'Low', analysis: 'Little vegetation.' } } }
    ],
    'Beijing': [
        { name: 'Jingshan Park', coords: [39.92, 116.39], type: 'park', info: { heat: { value: '24°C', label: 'Moderate', analysis: 'Artificial hill with vegetation offering views over the Forbidden City.' }, air: { value: '140 µmol/m²', label: 'High', analysis: 'Beijing\'s pollution is a persistent problem.' }, vegetation: { value: '0.68 NDVI', label: 'Medium', analysis: 'Well-wooded park.' } } },
        { name: 'Tiananmen Square', coords: [39.90, 116.39], type: 'urban', info: { heat: { value: '31°C', label: 'Hot', analysis: 'One of the largest squares in the world, fully paved.' }, air: { value: '200 µmol/m²', label: 'Very High', analysis: 'Affected by intense traffic and surrounding industry.' }, vegetation: { value: '0.01 NDVI', label: 'None', analysis: 'No vegetation.' } } }
    ],
    'Mumbai': [
        { name: 'Sanjay Gandhi National Park', coords: [19.23, 72.91], type: 'park', info: { heat: { value: '29°C', label: 'Moderate', analysis: 'Large national park within city limits.' }, air: { value: '80 µmol/m²', label: 'Moderate', analysis: 'Air quality far superior to the rest of the city.' }, vegetation: { value: '0.83 NDVI', label: 'Very High', analysis: 'Protected tropical forest.' } } },
        { name: 'Gateway of India', coords: [18.92, 72.83], type: 'urban', info: { heat: { value: '34°C', label: 'Hot', analysis: 'Coastal tourist area with a lot of stone and concrete.' }, air: { value: '150 µmol/m²', label: 'High', analysis: 'Pollution from boats, traffic, and high density of people.' }, vegetation: { value: '0.07 NDVI', label: 'Low', analysis: 'Only a few ornamental coconut trees.' } } }
    ],
    'Singapore': [
        { name: 'Gardens by the Bay', coords: [1.28, 103.86], type: 'park', info: { heat: { value: '30°C', label: 'Hot', analysis: 'Despite being green, the tropical climate keeps temperatures high.' }, air: { value: '20 µmol/m²', label: 'Low', analysis: 'Excellent air quality, a model garden city.' }, vegetation: { value: '0.88 NDVI', label: 'Very High', analysis: 'Technology and nature combined for lush vegetation.' } } },
        { name: 'Marina Bay Sands', coords: [1.28, 103.85], type: 'urban', info: { heat: { value: '33°C', label: 'Hot', analysis: 'Iconic complex with high construction density.' }, air: { value: '45 µmol/m²', label: 'Moderate', analysis: 'Affected by traffic and maritime activity.' }, vegetation: { value: '0.30 NDVI', label: 'Medium', analysis: 'Incorporates vertical and rooftop gardens.' } } }
    ],
    'Bangkok': [
        { name: 'Lumphini Park', coords: [13.73, 100.54], type: 'park', info: { heat: { value: '31°C', label: 'Hot', analysis: 'Green oasis that offers a crucial relief from the city\'s heat and humidity.' }, air: { value: '90 µmol/m²', label: 'Moderate', analysis: 'The air is visibly better inside the park.' }, vegetation: { value: '0.75 NDVI', label: 'High', analysis: 'Artificial lake and large wooded areas.' } } },
        { name: 'Siam Paragon', coords: [13.74, 100.53], type: 'urban', info: { heat: { value: '36°C', label: 'Very Hot', analysis: 'Commercial heart with shopping centers, intense traffic, and little shade.' }, air: { value: '170 µmol/m²', label: 'High', analysis: 'Pollution from constant traffic of "tuk-tuks" and cars.' }, vegetation: { value: '0.08 NDVI', label: 'Low', analysis: 'Limited to planters and decoration.' } } }
    ],
    'Jakarta': [
        { name: 'Suropati Park', coords: [-6.20, 106.83], type: 'park', info: { heat: { value: '30°C', label: 'Hot', analysis: 'Small but important park in the Menteng neighborhood.' }, air: { value: '100 µmol/m²', label: 'High', analysis: 'Offers a small relief from the city\'s general pollution.' }, vegetation: { value: '0.65 NDVI', label: 'Medium', analysis: 'Mature and well-maintained trees.' } } },
        { name: 'Merdeka Square', coords: [-6.17, 106.82], type: 'urban', info: { heat: { value: '35°C', label: 'Very Hot', analysis: 'Vast square with the National Monument, great sun exposure.' }, air: { value: '190 µmol/m²', label: 'Very High', analysis: 'Surrounded by some of Jakarta\'s busiest streets.' }, vegetation: { value: '0.20 NDVI', label: 'Low', analysis: 'Mainly lawn with few trees.' } } }
    ],
    'Hong Kong': [
        { name: 'Hong Kong Park', coords: [22.27, 114.16], type: 'park', info: { heat: { value: '29°C', label: 'Moderate', analysis: 'A green oasis in the middle of one of the world\'s densest districts.' }, air: { value: '65 µmol/m²', label: 'Moderate', analysis: 'Helps to improve local air quality.' }, vegetation: { value: '0.73 NDVI', label: 'High', analysis: 'Well-designed gardens, an aviary, and waterfalls.' } } },
        { name: 'Mong Kok', coords: [22.32, 114.17], type: 'urban', info: { heat: { value: '34°C', label: 'Very Hot', analysis: 'One of the planet\'s most densely populated areas, intense heat.' }, air: { value: '155 µmol/m²', label: 'High', analysis: 'Air pollution trapped between the tall, narrow buildings.' }, vegetation: { value: '0.05 NDVI', label: 'None', analysis: 'Almost non-existent vegetation.' } } }
    ],

    // AFRICA
    'Cairo': [
        { name: 'Al-Azhar Park', coords: [30.04, 31.26], type: 'park', info: { heat: { value: '32°C', label: 'Hot', analysis: 'A crucial green oasis in a dense and arid city.' }, air: { value: '150 µmol/m²', label: 'High', analysis: 'The park improves the air, but the city\'s general pollution is very high.' }, vegetation: { value: '0.65 NDVI', label: 'Medium', analysis: 'Irrigated vegetation, vital for the local environment.' } } },
        { name: 'Tahrir Square', coords: [30.044, 31.235], type: 'urban', info: { heat: { value: '38°C', label: 'Extreme', analysis: 'Vast asphalt area in the heart of one of the world\'s hottest cities.' }, air: { value: '250 µmol/m²', label: 'Critical', analysis: 'Dangerous pollution levels due to chaotic traffic.' }, vegetation: { value: '0.03 NDVI', label: 'None', analysis: 'Virtually non-existent vegetation.' } } }
    ],
    'Johannesburg': [
        { name: 'Walter Sisulu National Botanical Garden', coords: [-26.08, 27.84], type: 'park', info: { heat: { value: '22°C', label: 'Cool', analysis: 'Botanical garden with native vegetation and a waterfall.' }, air: { value: '28 µmol/m²', label: 'Low', analysis: 'Clean air, away from the most polluted areas.' }, vegetation: { value: '0.79 NDVI', label: 'High', analysis: 'Great diversity of flora.' } } },
        { name: 'Sandton City', coords: [-26.10, 28.05], type: 'urban', info: { heat: { value: '28°C', label: 'Hot', analysis: 'Modern financial center with many office buildings.' }, air: { value: '70 µmol/m²', label: 'Moderate', analysis: 'Pollution from intense traffic in the area.' }, vegetation: { value: '0.19 NDVI', label: 'Low', analysis: 'Urban landscaping and street trees.' } } }
    ],
    'Lagos': [
        { name: 'Lekki Conservation Centre', coords: [6.43, 3.53], type: 'park', info: { heat: { value: '30°C', label: 'Hot', analysis: 'Natural reserve that preserves the mangrove ecosystem.' }, air: { value: '65 µmol/m²', label: 'Moderate', analysis: 'The air is cleaner due to vegetation and distance from the center.' }, vegetation: { value: '0.84 NDVI', label: 'Very High', analysis: 'Swamp and forest ecosystem.' } } },
        { name: 'Lagos Island', coords: [6.45, 3.39], type: 'urban', info: { heat: { value: '34°C', label: 'Hot', analysis: 'Central business area, extremely dense and busy.' }, air: { value: '160 µmol/m²', label: 'High', analysis: 'Severe pollution from generators, vehicles, and markets.' }, vegetation: { value: '0.09 NDVI', label: 'Low', analysis: 'Almost no green spaces.' } } }
    ],
    'Nairobi': [
        { name: 'Nairobi National Park', coords: [-1.36, 36.85], type: 'park', info: { heat: { value: '24°C', label: 'Cool', analysis: 'Unique national park on the city\'s edge.' }, air: { value: '20 µmol/m²', label: 'Low', analysis: 'Open savanna with good air quality.' }, vegetation: { value: '0.70 NDVI', label: 'High', analysis: 'Healthy savanna ecosystem.' } } },
        { name: 'Central Business District', coords: [-1.28, 36.82], type: 'urban', info: { heat: { value: '29°C', label: 'Hot', analysis: 'City center with intense traffic.' }, air: { value: '100 µmol/m²', label: 'High', analysis: 'Pollution from "matatus" (minibuses) and traffic.' }, vegetation: { value: '0.15 NDVI', label: 'Low', analysis: 'Few trees downtown.' } } }
    ],

    // OCEANIA
    'Dubai': [
        { name: 'Safa Park', coords: [25.18, 55.24], type: 'park', info: { heat: { value: '36°C', label: 'Hot', analysis: 'Irrigated park that offers some relief from the desert heat.' }, air: { value: '80 µmol/m²', label: 'Moderate', analysis: 'Desert dust contributes to air quality.' }, vegetation: { value: '0.55 NDVI', label: 'Medium', analysis: 'Artificially maintained vegetation.' } } },
        { name: 'Burj Khalifa', coords: [25.197, 55.274], type: 'urban', info: { heat: { value: '42°C', label: 'Extreme', analysis: 'Construction materials like glass and metal intensify the heat.' }, air: { value: '120 µmol/m²', label: 'High', analysis: 'High concentration of traffic and construction.' }, vegetation: { value: '0.06 NDVI', label: 'Low', analysis: 'Minimal ornamental landscaping.' } } }
    ],
    'Sydney': [
        { name: 'Royal Botanic Garden', coords: [-33.86, 151.21], type: 'park', info: { heat: { value: '20°C', label: 'Cool', analysis: 'The harbor breeze and lush vegetation keep temperatures low.' }, air: { value: '12 µmol/m²', label: 'Low', analysis: 'Excellent air quality.' }, vegetation: { value: '0.82 NDVI', label: 'Very High', analysis: 'A diverse and healthy collection of plants.' } } },
        { name: 'Circular Quay', coords: [-33.861, 151.211], type: 'urban', info: { heat: { value: '24°C', label: 'Moderate', analysis: 'Busy port area, but the sea breeze helps to moderate the heat.' }, air: { value: '40 µmol/m²', label: 'Moderate', analysis: 'Pollution from ferries, buses, and tourist traffic.' }, vegetation: { value: '0.18 NDVI', label: 'Low', analysis: 'Limited to potted trees.' } } }
    ],
    'Melbourne': [
        { name: 'Royal Botanic Gardens Victoria', coords: [-37.83, 144.97], type: 'park', info: { heat: { value: '19°C', label: 'Cool', analysis: 'Acclaimed gardens with diverse vegetation.' }, air: { value: '15 µmol/m²', label: 'Low', analysis: 'Clean air coming from the south.' }, vegetation: { value: '0.80 NDVI', label: 'High', analysis: 'Healthy and well-managed vegetation.' } } },
        { name: 'Federation Square', coords: [-37.81, 144.96], type: 'urban', info: { heat: { value: '24°C', label: 'Moderate', analysis: 'Large public square with modern architecture and hard surfaces.' }, air: { value: '50 µmol/m²', label: 'Moderate', analysis: 'Central point with traffic and trams.' }, vegetation: { value: '0.05 NDVI', label: 'None', analysis: 'Architecture dominates the landscape.' } } }
    ]
};

    L.Control.geocoder({
        defaultMarkGeocode: true,
        placeholder: 'Serach for a city...',
        position: 'topleft'
    }).on('markgeocode', e => map.fitBounds(e.geocode.bbox)).addTo(map);

    L.tileLayer.wms(vegetationLayer.endpoint, {
        layers: vegetationLayer.name,
        format: 'image/png',
        transparent: true,
        opacity: 0.7,
        attribution: 'Vegetation Data &copy; NASA GIBS'
    }).addTo(map);

    const createCustomIcon = (type) => L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${type === 'park' ? '#22c55e' : '#6b7280'};" class="w-full h-full rounded-full"></div>`,
        iconSize: [16, 16]
    });

    function createPopupContent(point) {
        const { heat, air, vegetation } = point.info;
        return `
            <div class="popup-title">${point.name}</div>
            <div class="popup-metric">
                <span class="popup-metric-title">🌡️ Temperature</span>
                <span class="popup-metric-value">${heat.value} (${heat.label})</span>
                <p class="popup-metric-analysis">${heat.analysis}</p>
            </div>
            <div class="popup-metric">
                <span class="popup-metric-title">💨 Ar Pollution(NO₂)</span>
                <span class="popup-metric-value">${air.value} (${air.label})</span>
                <p class="popup-metric-analysis">${air.analysis}</p>
            </div>
            <div class="popup-metric">
                <span class="popup-metric-title">🌳 Vegetation(NDVI)</span>
                <span class="popup-metric-value">${vegetation.value} (${vegetation.label})</span>
                <p class="popup-metric-analysis">${vegetation.analysis}</p>
            </div>
            <div class="popup-footer">
                Fontes: NASA GIBS (MODIS/OMI), OpenStreetMap.
            </div>
        `;
    }

    function addAllMarkers() {
        for (const city in citiesData) {
            citiesData[city].forEach(point => {
                L.marker(point.coords, { icon: createCustomIcon(point.type) })
                    .bindPopup(createPopupContent(point))
                    .addTo(markersLayer);
            });
        }
    }

    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
            <div class="legend-title">Vegetation Index</div>
            <div class="legend-gradient" style="background: linear-gradient(to right, #a50026, #d73027, #f46d43, #fee090, #a6d96a, #1a9850);"></div>
            <div class="legend-labels"><span>Low</span><span>High</span></div>
            <div class="legend-section">
                <div class="legend-title">Points of Analysis</div>
                <div class="legend-marker-item"><div class="legend-marker-icon icon-park"></div><span>Parks / Green Areas</span></div>
                <div class="legend-marker-item"><div class="legend-marker-icon icon-urban"></div><span>Urban Centers</span></div>
            </div>`;
        return div;
    };
    legend.addTo(map);
    
    map.attributionControl.addAttribution('Data of POIs &copy; OpenStreetMap');

    addAllMarkers();

    
});