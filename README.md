# geowe-gis
Librería de componentes Open Source en Javascript para el desarrollo de aplicaciones GIS en la web.

## Tabla de contenidos

- [Requerimientos](#Requerimientos)
- [Instalación](#Instalación)
- [Ejemplo básico de uso](#Ejemplo-básico-de-uso)
- [Ejemplo personalizado](#Ejemplo-personalizado)
- [Contributors](#Contributors)
- [Copyright and license](#copyright-and-license)

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

const mapRenderer = new MapRenderer();
mapRenderer.render();
```
Como se puede observar en el ejemplo anterior no se especifica ningún parámetro de mapa al renderizador, éste aplicará los valores establecidos por defecto:

```json
{
    "map": {
        "projection": "3857",        
        "initZoom": 1,
        "minZoom": 3,
        "unit": "m",
        "domId": "map",
        "defaultLayers": ["osm"]
    }
}
```
El mapa se define con la proyección **EPSG:3857**, como capa raster por defecto se usa **OpenStreetMap** y el mapa será renderizado en el DOM con id **map**.

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

Si se quisiera añadir otra capa, por ejemplo, una capa WMS de un servicio externo (PNOA), el fichero de configuración quedaría de la siguiente forma:

```json
{
    "map": {
        "projection": "EPSG:25830",
        "extent": [97805.10450538254, 3975325.5395915597, 624149.7135073378, 4290248.833085548],
        "centerPoint": [624149.7135073378, 4290248.833085548],
        "defaultLayers": ["raster.carto-dark", "vector.Medina-azahara", "raster.pnoa-mosaico"]
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
    },
    "raster": {
        "pnoa-mosaico": {
            "title": "PNOA Mosaico",
            "type": "wms",
            "attributions": "© <a target='_blank' href='http://www.scne.es'>Sistema Cartográfico Nacional</a>",
            "url": "http://www.ign.es/wms-inspire/pnoa-ma",
            "layers": "OI.MosaicElement"
        }
    }
}
```
Observe que tiene toda la libertad a la hora de definir las categorias y nombrado de las capas personalidas en el JSON de configuración (**raster.pnoa-mosaico**).

## Contributors

* Atanasio Muñoz <ata@geowe.org>
* Rafael López <rafa@geowe.org>
* José María Martínez <jose@geowe.org>

## Copyright and license

Código publicado bajo [MIT License](https://github.com/geowe2-ce/geowe-gis/blob/master/LICENSE).
