import { AbstractTileLayer } from '../AbstractTileLayer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

/**
 * Representa la capa raster teselada de Open Street Map
 * 
 */

export class OsmTileLayer extends AbstractTileLayer {
    constructor() {
        super();
    }

    getTileLayer() {
        return new TileLayer({
            title: "OSM",
            source: new OSM()
        });
    }
}