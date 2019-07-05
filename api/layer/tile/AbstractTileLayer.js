import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

/**
 * Representa la definición común de las capas teseladas
 *
 * @constructor
 * @param {JSONObject} tileLayerDef - Parámetros que definen la capa de teselas. 
 */

export class AbstractTileLayer {

    constructor(tileLayerDef) {
        if (tileLayerDef == undefined)
            return;

        this.tileLayer = this.createTileLayer(tileLayerDef);
    }

    getTileLayer() {
        return this.tileLayer;
    }

    createTileLayer(tileLayerDef) {
        return new TileLayer({
            title: tileLayerDef.title,
            source: new TileWMS({
                attribution: tileLayerDef.attribution,
                url: tileLayerDef.url,
                params: {
                    'LAYERS': tileLayerDef.layers,
                    'SRS': tileLayerDef.srs,
                    'FORMAT': tileLayerDef.format
                },

                //tileLoadFunction: proxyTileLoader.load,
                //crossOrigin: 'anonymous'
            }),
            visible: tileLayerDef.visible
        });
    }
}