# geowe-gis
Librería de componentes Open Source en Javascript para el desarrollo de aplicaciones GIS en la web.

## Requerimientos

Para comenzar a trabajar con el proyecto necesitará tener Node.js instalado en su entorno. Para **geowe-gis** se han utilizado las siguientes versiones: 

    $ node --version
    v10.15.3

    $ npm --version
    6.4.1

## Instalación

Para usar la librería desde un proyecto Javascript basado en NodeJS, ejecute el siguiente comando:

    npm install --save geowe-gis 

## Ejemplo básico de uso

```javascript
import { MapRenderer } from 'geowe-gis/api/map/MapRenderer';
import 'geowe-gis/style/main.css';

const mapRenderer = new MapRenderer();
mapRenderer.render();
```

## Ejemplo personalizado

En este ejemplo se personaliza la configuración del mapa mediante un fichero externo. 

```javascript
import { MapRenderer } from 'geowe-gis/api/map/MapRenderer';
import settingsHolder from 'geowe-gis/api/conf/SettingsHolder';
import 'geowe-gis/style/main.css';

//Carga de la configuración del mapa vía URL
settingsHolder.loadURLSettings("https://raw.githubusercontent.com/jmmluna/geodata/master/appConfig.json", ()=>{
    //Mapas raster base soportadas por el catálogo por defecto de geowe-gis
    //"osm", "raster.carto-light", "raster.carto-dark", "raster.catastro", "raster.ign-base", "raster.ign-fondo", ""raster.ign-raster", "raster.pnoa-ortho", "raster.pnoa-mosaic"

    const mapRenderer = new MapRenderer();
    mapRenderer.render();
});
```

El fichero de configuración contiene las siguientes propiedades:

```json
{
    "map": {
        "projection": "EPSG:25830",
        "extent": [97805.10450538254, 3975325.5395915597, 624149.7135073378, 4290248.833085548],
        "centerPoint": [624149.7135073378, 4290248.833085548],
        "defaultLayers": ["raster.carto-dark", "vector.Medina-azahara"]
    },
    "raster": {
        "wms1": {
            "title": "PNOA Mosaico",
            "type": "wms",
            "attributions": "© <a target='_blank' href='http://www.scne.es'>Sistema Cartográfico Nacional</a>",
            "url": "http://www.ign.es/wms-inspire/pnoa-ma",
            "layers": "OI.MosaicElement"
        },
        "wmts1": {
            "title": "Argentina WMTS Example",
            "type": "wmts",
            "attributions": "© <a target='_blank' href='http://www.scne.es'>Sistema Cartográfico Nacional</a>",
            "url": "https://ide.ign.gob.ar/geoservicios/rest/services/sensores_remotos/mendoza/ImageServer/WMTS",
            "layer": "sensores_remotos_mendoza",
            "format": "image/jpgpng",
            "style": "default",
            "matrixSet": "default028mm"
        }
    },
    "vector": {
        "Medina-azahara": {
            "name": "mi-capa",
            "type": "vector",
            "source": "url",
            "uri": "https://raw.githubusercontent.com/jmmluna/geodata/master/medina_azahara/Mad%C3%ADnat%20al-Zahra.geojson",
            "format": "geojson",
            "srs": "EPSG:4326"
        }
    }
}
```
En este caso, se configura el mapa con proyección EPSG:25830, con la extensión de Andalucía(España) y, además, se indica que inicialmente el mapa cargue el raster **carto-dark** y una capa vectorial ubicada en una url externa.

## Contributors

* Atanasio Muñoz <ata@geowe.org>
* Rafael López <rafa@geowe.org>
* José María Martínez <jose@geowe.org>
