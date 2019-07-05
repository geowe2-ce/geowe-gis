import 'ol/ol.css';
import { Map, View } from 'ol';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { osmLayer } from '../layer/tile/catalog/TileLayerCatalog';
import { Projections } from '../proj/Projections';

const DEFAULT_PROJECTION = "3857";
const DEFAULT_EXTENT = [-1102527.695985, 4273747.125481, 389523.096141, 5479006.187481];
const DEFAULT_CENTER_POINT = [-412148.456514, 4926825.095149]
const DEFAULT_INIT_ZOOM = 1;
const DEFAULT_MIN_ZOOM = 5;
const DEFAULT_UNIT = 'm';
const DEFAULT_DOM_ID = 'map';

/**
 * Representa al responsable de crear el mapa
 *
 * @constructor
 * @param {JSONObject} options - Parámetros que definen las características del mapa. 
 */

export class MapRenderer {
    constructor(options) {
        this.projection = options.projection != undefined ? options.projection : DEFAULT_PROJECTION;
        this.extent = options.extent != undefined ? options.extent : DEFAULT_EXTENT;
        this.centerPoint = options.centerPoint != undefined ? options.centerPoint : DEFAULT_CENTER_POINT;
        this.initialZoom = options.initialZoom != undefined ? options.initialZoom : DEFAULT_INIT_ZOOM;
        this.minZoom = options.minZoom != undefined ? options.minZoom : DEFAULT_MIN_ZOOM;
    }

    /**
     * Renderiza el mapa en el DOM
     */
    render(options) {
        this.id = options.id != undefined ? options.id : DEFAULT_DOM_ID;
        if (options.defaultTileLayers == undefined || options.defaultTileLayers.length == 0) {
            this.defaultTileLayers = [osmLayer];
        } else
            this.defaultTileLayers = options.defaultTileLayers;

        var scaleLineControl = new ScaleLine();

        this.map = new Map({
            controls: defaultControls({
                zoom: false,
                attribution: true,
                attributionOptions: {
                    collapsible: false
                }
            }).extend([
                scaleLineControl
            ]),
            target: document.getElementById(this.id),
            layers: this.defaultTileLayers,
            loadTilesWhileAnimating: true,
            view: new View({
                extent: this.extent,
                projection: Projections.get(this.projection),
                center: this.centerPoint,
                zoom: this.initialZoom,
                minZoom: this.minZoom
            }),
            units: DEFAULT_UNIT
        });

        setTimeout(function() {
            this.map.updateSize();
            var size = this.map.getSize();
            this.map.getView().fit(this.extent, size);
            document.body.style.cursor = 'auto';
        }.bind(this), 200);
    }

    getMap() {
        return this.map;
    }
}