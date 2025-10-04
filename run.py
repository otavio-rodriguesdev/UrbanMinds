# run.py
from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__, template_folder="app/templates", static_folder="app/static")

@app.route("/")
def index():
    """Serve a página web principal."""
    return render_template("index.html")

@app.route("/api/query_nasa_data")
def query_nasa_data():
    """
    Atua como um proxy para fazer pedidos GetFeatureInfo à NASA,
    evitando problemas de CORS no navegador.
    """
    # Parâmetros recebidos do frontend
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    layer_name = request.args.get('layer')
    bbox_str = request.args.get('bbox')
    
    if not all([lat, lon, layer_name, bbox_str]):
        return jsonify({"error": "Parâmetros em falta."}), 400

    # O GetFeatureInfo precisa das coordenadas em píxeis (X, Y) dentro do BBOX.
    # Assumimos um tamanho de mapa fixo para o pedido (ex: 1024x1024).
    width, height = 1024, 1024
    bbox = [float(c) for c in bbox_str.split(',')] # south_lat, west_lon, north_lat, east_lon
    
    # Converte lat/lon para coordenadas de píxeis X, Y
    x_pixel = int(width * (float(lon) - bbox[1]) / (bbox[3] - bbox[1]))
    y_pixel = int(height * (bbox[2] - float(lat)) / (bbox[2] - bbox[0]))

    # Constrói a URL para o pedido GetFeatureInfo
    nasa_wms_url = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
    params = {
        'SERVICE': 'WMS',
        'VERSION': '1.1.1',
        'REQUEST': 'GetFeatureInfo',
        'LAYERS': layer_name,
        'QUERY_LAYERS': layer_name,
        'BBOX': f"{bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}",
        'WIDTH': width,
        'HEIGHT': height,
        'X': x_pixel,
        'Y': y_pixel,
        'INFO_FORMAT': 'text/html', # Pedimos HTML pois é mais fácil de extrair
    }

    try:
        response = requests.get(nasa_wms_url, params=params, timeout=15)
        response.raise_for_status()

        # Extrai o valor da tabela HTML retornada pela NASA
        soup = BeautifulSoup(response.text, 'html.parser')
        value_td = soup.find('td')
        value = value_td.text.strip() if value_td else "N/A"
        
        return jsonify({"value": value})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Erro ao contactar o servidor da NASA: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"Erro ao processar a resposta: {e}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)