import {get as getOLProjection } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import Projection from 'ol/proj/Projection.js';
const projs = require('epsg-index/all.json')

/**
 * Representa las proyecciones definidas en el mapa. 
 * 
 */

export class Projections {
    constructor() {}

    /**
     * Obtiene la proyección correspondiente al código. 
     *
     * 
     * @param {number} projectionCode - Código que identifica a la proyección. 
     * @return Projection - Objeto Projectión de OpenLayers
     */

    static get(projectionCode) {
        var projection = undefined;
        if (projectionCode.startsWith("EPSG:")) {
            projectionCode = projectionCode.split(":")[1];
        }

        if (projectionCode == 3857 || projectionCode == 4326) {
            projection = getOLProjection("EPSG:" + projectionCode);
        } else if (projectionCode == "TILE_PIXELS") {
            projection = new Projection({
                code: 'TILE_PIXELS',
                units: 'tile-pixels'
            });
        } else {
            var epsgProj = projs[projectionCode];
            if (epsgProj != undefined) {
                proj4.defs("EPSG:" + projectionCode, epsgProj.proj4);
                register(proj4);

                projection = getOLProjection("EPSG:" + projectionCode);
                projection.setExtent(epsgProj.proj4.bbox);
            }
        }

        return projection;
    }
}