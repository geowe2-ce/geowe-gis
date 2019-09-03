[![GitHub version](https://badge.fury.io/gh/geowe2-ce%2Fgeowe-gis.svg)](https://badge.fury.io/gh/geowe2-ce%2Fgeowe-gis)
[![License](https://img.shields.io/github/license/geowe2-ce/geowe-gis.svg)](https://github.com/geowe2-ce/geowe-gis)

# geowe-gis
Librería de componentes Open Source en Javascript para el desarrollo de aplicaciones GIS en la web.

## ¿Por qué usar geowe-gis?
GeoWE-GIS surge con la premisa de maximizar la flexibilidad en la configuración de las aplicaciones GIS, permitiendo la personalización en tiempo de ejecución a través de ficheros de configuración en formato JSON. Esto aporta una gran versatilidad y sencillez en la definición de las aplicaciones.

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
Cualquier aplicación basada en esta librería deberá hacer uso de la clase **MapRenderer** para establecer la configuración y mostrar el mapa dentro de la misma. El siguiente código muestra el uso básico de esta clase:

```javascript
import { MapRenderer } from 'geowe-gis/api/map/MapRenderer';

const mapRenderer = new MapRenderer();
mapRenderer.render();
```
Como se puede observar, en el ejemplo anterior no se especifica ningún parámetro de mapa al renderizador, por lo que éste aplicará los valores establecidos por defecto.

## Fichero de configuración
Si se desea modificar la configuración por defecto, será necesario definir un fichero JSON que contenga los parámetros propios de la aplicación. Este fichero puede ubicarse en una ruta local del proyecto o bien en una URI accesible de manera remota, y para cargarlo se utilizará la clase **SettingsHolder**.

### Ejemplo de configuración mediante fichero local
```javascript
import appConfig from './appConfig.json';
import { MapRenderer } from 'geowe-gis/api/map/MapRenderer';
import settingsHolder from 'geowe-gis/api/conf/SettingsHolder';
import 'geowe-gis/style/main.css';

settingsHolder.loadSettings(appConfig);
const mapRenderer = new MapRenderer();
mapRenderer.render();
```

### Ejemplo de configuración mediante fichero remoto
```javascript
import { MapRenderer } from 'geowe-gis/api/map/MapRenderer';
import settingsHolder from 'geowe-gis/api/conf/SettingsHolder';
import 'geowe-gis/style/main.css';

settingsHolder.loadURLSettings("https://raw.githubusercontent.com/jmmluna/geodata/master/appConfig.json", ()=>{
    const mapRenderer = new MapRenderer();
    mapRenderer.render();
});
```

### Formato del fichero de configuración
Cuando se carga un fichero de configuración personalizado, GeoWE-GIS sobrescribe solamente aquellos parámetros especificados en el mismo, manteniendo aquellos que ya existan previamente. Si no se especifica ninguna configuración se aplicará la establecida por defecto:

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

El núcleo principal del fichero de configuración es el objeto **map**, que describe las propiedades principales del mapa:

| Nombre                  |   Desc.   |
| ----------------------- | --------- |
| projection              | Sistema de referencia      |
| initZoom                | Valor del zoom establecido en la carga de la aplicación      |
| minZoom                 | Valor mínimo permitido para el zoom          |
| unit                    | Unidad de medida base de distancia para el mapa          |
| domId                   | Identificador del elemento contenedor HTML donde se debe renderizar el mapa |     
| defaultLayers           | Array de identificadores de capas (vectoriales y rásters) 

En **defaultLayers** se especifican los identicadores de las capas a cargar al inicio de la aplicación- **GeoWE-GIS** ofrece de partida un conjunto de identificadores para las capas raster listos para usar:


| Nombre                  |   Desc.   |
| ----------------------- | --------- |
| osm                   | Mapa base de OpenStreetMap      |
| raster.carto-light                    |Mapa base de Carto       |
| raster.carto-dark            | Mapa base de Carto          |
| raster.catastro                     | Mapa base de Catastro de España          |
| raster.ign-base                  | Mapa base de IGN |
| raster.ign-fondo                  | Mapa base de IGN |
| raster.ign-raster                  | Mapa base de IGN |
| raster.pnoa-ortho                  | Mapa base de PNOA |
| raster.pnoa-mosaic                  | Mapa base de PNOA |

Se pueden especificar nuevos identificadores de capas que deberán estar definidos en el fichero como nuevos objetos JSON, indicando el nivel de anidamiento que se desee para su categorización. A continuación se crea un nuevo identificador (myRasters.myWms.wms1) de una capa WMS :      

```json
{
    "map": {        
        "defaultLayers": ["osm", "myRasters.myWms.wms1"]
    },
    "myRasters": {
        "myWms": {
            "wms1": {
                "title": "My WMS",
                "type": "wms",
                "attributions": "© <a target='_blank' href='http://www.scne.es'>Sistema Cartográfico Nacional</a>",
                "url": "http://www.ign.es/wms-inspire/pnoa-ma",
                "layers": "OI.MosaicElement"
            }
        }
    }
}
```
El mapa se define con la proyección **EPSG:3857**, como capas rasters por defecto usará tanto **OpenStreetMap** como **My WMS** y será renderizado en el DOM con id **map**.

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
Observe que tiene toda la libertad a la hora de definir las categorias y nombrado de las capas personalizadas en el JSON de configuración (**raster.pnoa-mosaico**).

## Parámetros para definir una capa WMS

| Nombre                  |   Desc.   |
| ----------------------- | --------- |
| title                   | Título de la capa      |
| type                    | Valor fijado a **wms**      |
| attributions            | Atribuciones oficiales de la capa que se mostrarán en el borde inferior          |
| url                     | URL base del servidor de capas          |
| layers                  | Nombre/s de la/s capa/s a cargar |      


## Contributors

* Atanasio Muñoz <ata@geowe.org>
* Rafael López <rafa@geowe.org>
* José María Martínez <jose@geowe.org>

## Copyright and license

Código publicado bajo [MIT License](https://github.com/geowe2-ce/geowe-gis/blob/master/LICENSE).
