import { AbstractTileLayer } from '../AbstractTileLayer';
import Projections from '../../../proj/Projections';

/**
 * Representa la capa raster teselada de la Dirección General de Catastro
 * 
 */

export class CatastroTileLayer extends AbstractTileLayer {
    constructor() {
        super({
            title: 'Catastro',
            attribution: '© <a target="_blank" href="https://www.sedecatastro.gob.es/">DIRECCION GENERAL DEL CATASTRO</a>',
            url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx',
            layers: 'catastro',
            srs: 'EPSG:25830',
            format: 'image/png',
            visible: true
        });
    }
}