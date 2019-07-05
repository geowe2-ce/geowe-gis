import {get as getOLProjection } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

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
        var epsgProj = projs[projectionCode];
        proj4.defs("EPSG:" + projectionCode, epsgProj.proj4);
        register(proj4);

        var projection = getOLProjection("EPSG:" + projectionCode);
        projection.setExtent(epsgProj.proj4.bbox);

        return projection;
    }
}