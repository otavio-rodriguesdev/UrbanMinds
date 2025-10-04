document.addEventListener('DOMContentLoaded', function () {

    // --- 1. CONFIGURAÇÃO GERAL ---
    const map = L.map('map').setView([20, 0], 3);
    const nasaWmsEndpoint = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
    
    let activeLayerKey = 'none';
    let activeWmsLayer = null;
    let legend = null;
    let markersLayer = new L.LayerGroup().addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
    }).addTo(map);

    // --- 2. DADOS E DEFINIÇÕES ---
    const nasaLayers = {
        heat: { name: 'MODIS_Terra_Land_Surface_Temperature_Day', legendUrl: 'https://gibs.earthdata.nasa.gov/colormaps/MODIS_Terra_Land_Surface_Temperature_Day_V6.png' },
        air: { name: 'OMNO2d_003_ColumnAmountTropNitrogenDioxide', legendUrl: 'https://gibs.earthdata.nasa.gov/colormaps/OMNO2d_003_ColumnAmountTropNitrogenDioxide.png' },
        vegetation: { name: 'MODIS_Terra_NDVI_8Day', legendUrl: 'https://gibs.earthdata.nasa.gov/colormaps/MODIS_Terra_NDVI_8Day_V6.png' }
    };

    // --- 3. LÓGICA DA APLICAÇÃO ---

    // Pesquisa de cidades
    L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: 'Pesquise uma cidade...'
    }).on('markgeocode', function (e) {
        const bbox = e.geocode.bbox;
        map.fitBounds(bbox);
        findPOIsInBbox(bbox);
    }).addTo(map);

    // Seletor de camadas
    document.getElementById('layer-selector').addEventListener('change', function () {
        activeLayerKey = this.value;
        updateWmsLayer();
    });

    // Função para buscar Pontos de Interesse (POIs) no OpenStreetMap
    async function findPOIsInBbox(bbox) {
        markersLayer.clearLayers();
        const boundsStr = `${bbox.getSouth()},${bbox.getWest()},${bbox.getNorth()},${bbox.getEast()}`;
        const overpassQuery = `[out:json];(
            node["leisure"="park"](${boundsStr});
            node["place"="city"](${boundsStr});
            node["place"="town"](${boundsStr});
        );out center;`;
        
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        try {
            const response = await fetch(overpassUrl);
            const data = await response.json();
            data.elements.forEach(element => {
                const name = element.tags.name || 'Ponto de Interesse';
                const marker = L.marker([element.lat, element.lon], { pointName: name })
                    .addTo(markersLayer)
                    .on('click', onMarkerClick);
            });
        } catch (error) {
            console.error("Erro ao buscar POIs:", error);
        }
    }

    // Função chamada ao clicar num marcador
    function onMarkerClick(e) {
        const marker = e.target;
        const lat = marker.getLatLng().lat;
        const lon = marker.getLatLng().lng;
        const pointName = marker.options.pointName;
        
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `<div class="popup-title">${pointName}</div>`;

        if (activeLayerKey !== 'none') {
            popupContent.innerHTML += `<div class="popup-loading" id="popup-data-${lat}-${lon}">A obter dados da NASA...</div>`;
            marker.bindPopup(popupContent).openPopup();
            
            // Pede os dados ao nosso backend
            const mapBounds = map.getBounds();
            const bboxStr = `${mapBounds.getSouth()},${mapBounds.getWest()},${mapBounds.getNorth()},${mapBounds.getEast()}`;
            const layerName = nasaLayers[activeLayerKey].name;

            fetch(`/api/query_nasa_data?lat=${lat}&lon=${lon}&layer=${layerName}&bbox=${bboxStr}`)
                .then(response => response.json())
                .then(data => {
                    const dataContainer = document.getElementById(`popup-data-${lat}-${lon}`);
                    if (dataContainer) {
                        if (data.error) {
                            dataContainer.innerHTML = `<span style="color: red;">Erro: ${data.error}</span>`;
                        } else {
                            dataContainer.innerHTML = `<b>Valor:</b> <span class="popup-data">${data.value}</span>`;
                        }
                    }
                })
                .catch(err => {
                    const dataContainer = document.getElementById(`popup-data-${lat}-${lon}`);
                    if (dataContainer) {
                         dataContainer.innerHTML = `<span style="color: red;">Falha na comunicação com o servidor.</span>`;
                    }
                });
        } else {
            popupContent.innerHTML += 'Selecione uma camada para ver a análise.';
            marker.bindPopup(popupContent).openPopup();
        }
    }

    // Função para atualizar a camada WMS visual
    function updateWmsLayer() {
        if (activeWmsLayer) map.removeLayer(activeWmsLayer);
        if (legend) map.removeControl(legend);

        if (activeLayerKey !== 'none' && nasaLayers[activeLayerKey]) {
            const layerInfo = nasaLayers[activeLayerKey];
            activeWmsLayer = L.tileLayer.wms(nasaWmsEndpoint, {
                layers: layerInfo.name, format: 'image/png', transparent: true, opacity: 0.7, attribution: 'NASA GIBS'
            }).addTo(map);

            legend = L.control({ position: 'bottomright' });
            legend.onAdd = () => L.DomUtil.create('div', 'info legend').innerHTML = `<img src="${layerInfo.legendUrl}" alt="legenda" style="width: 250px;">`;
            legend.addTo(map);
        }
    }
});