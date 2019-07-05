# geowe-gis
Librería de componentes Open Source en Javascript para el desarrollo de aplicaciones GIS en la web.

## Requerimientos

Para comenzar a trabajar con el proyecto necesitará tener Node.js instalado en su entorno. Para **geowe-ui** se han utilizado las siguientes versiones: 

    $ node --version
    v10.15.3

    $ npm --version
    6.4.1

## Instalación

Para usar la librería desde un proyecto Javascript basado en NodeJS, ejecute el siguiente comando:

    npm install --save geowe-gis 

## Ejemplo básico de uso

```javascript
import { MapRenderer } from './api/map/MapRenderer';
import { catastroLayer, osmLayer } from './api/layer/tile/catalog/TileLayerCatalog';

const mapOptions = {
    projection: '25830',
    extent: [97805.10450538254, 3975325.5395915597, 624149.7135073378, 4290248.833085548],
    centerPoint: [624149.7135073378, 4290248.833085548]
};

const mapRenderer = new MapRenderer(mapOptions);
const rasterCatalog = [osmLayer, catastroLayer];

//Se le especifica que renderize el mapa en el elemento del DOM con identificador llamado "map" 
mapRenderer.render({ id: 'map', defaultTileLayers: rasterCatalog });
```

## Contributors

* Atanasio Muñoz <ata@geowe.org>
* Rafael López <rafa@geowe.org>
* José María Martínez <jose@geowe.org>
