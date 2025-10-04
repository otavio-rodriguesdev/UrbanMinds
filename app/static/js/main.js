document.addEventListener('DOMContentLoaded', function () {

    // --- 1. CONFIGURAÇÃO INICIAL DO MAPA ---
    const map = L.map('map').setView([20, 0], 3); // Visão global inicial

    // Camada base do mapa (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // --- 2. PESQUISA DE CIDADES (GEOCODER) ---
    // Adiciona uma barra de pesquisa que encontra cidades em qualquer lugar do mundo
    const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: 'Pesquise uma cidade...'
    }).on('markgeocode', function (e) {
        // Quando uma cidade é encontrada, o mapa foca nela
        map.fitBounds(e.geocode.bbox);
    }).addTo(map);

    // --- 3. LÓGICA DAS CAMADAS DE DADOS DA NASA (WMS) ---
    const nasaWmsEndpoint = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
    let activeLayer = null;
    let legend = null;

    // Mapeamento das camadas da NASA que queremos usar
    const nasaLayers = {
        heat: {
            name: 'MODIS_Terra_Land_Surface_Temperature_Day',
            legendUrl: 'https://gibs.earthdata.nasa.gov/colormaps/MODIS_Terra_Land_Surface_Temperature_Day_V6.png'
        },
        air: {
            name: 'OMNO2d_003_ColumnAmountTropNitrogenDioxide',
            legendUrl: 'https://gibs.earthdata.nasa.gov/colormaps/OMNO2d_003_ColumnAmountTropNitrogenDioxide.png'
        },
        vegetation: {
            name: 'MODIS_Terra_NDVI_8Day',
            legendUrl: 'https://gibs.earthdata.nasa.gov/colormaps/MODIS_Terra_NDVI_8Day_V6.png'
        }
    };

    // Evento para o seletor de camadas
    const layerSelector = document.getElementById('layer-selector');
    layerSelector.addEventListener('change', function () {
        const selectedLayerKey = this.value;
        updateMapLayer(selectedLayerKey);
    });

    function updateMapLayer(key) {
        // Remove a camada e a legenda ativas
        if (activeLayer) {
            map.removeLayer(activeLayer);
            activeLayer = null;
        }
        if (legend) {
            map.removeControl(legend);
            legend = null;
        }

        // Se uma nova camada foi selecionada, adiciona-a
        if (key && nasaLayers[key]) {
            const layerInfo = nasaLayers[key];
            
            // Cria a camada WMS
            activeLayer = L.tileLayer.wms(nasaWmsEndpoint, {
                layers: layerInfo.name,
                format: 'image/png',
                transparent: true,
                opacity: 0.7,
                attribution: 'NASA GIBS'
            }).addTo(map);

            // Adiciona a legenda correspondente
            legend = L.control({ position: 'bottomright' });
            legend.onAdd = function () {
                const div = L.DomUtil.create('div', 'info legend');
                div.innerHTML = `<img src="${layerInfo.legendUrl}" alt="legenda" style="width: 250px;">`;
                return div;
            };
            legend.addTo(map);
        }
    }
});