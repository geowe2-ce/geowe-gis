import 'ol/ol.css';
import { Map, View } from 'ol';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { Projections } from '../proj/Projections';
import settingsHolder from '../conf/SettingsHolder';
import layerFactory from '../layer/LayerFactory';

/**
 * Representa al responsable de crear el mapa
 *
 * @constructor
 * @param {JSONObject} options - Parámetros que definen las características del mapa. 
 */

export class MapRenderer {
    constructor() {
        const projectionCode = settingsHolder.getSetting("map.projection");
        this.extent = settingsHolder.getSetting("map.extent");
        this.centerPoint = settingsHolder.getSetting("map.centerPoint");
        this.initialZoom = settingsHolder.getSetting("map.initZoom");
        this.minZoom = settingsHolder.getSetting("map.minZoom");
        this.unit = settingsHolder.getSetting("map.unit");

        this.projection = Projections.get(projectionCode);
        if (this.projection == undefined) {
            alert("La proyección EPSG:" + projectionCode + " no es válida. Se establece la proyección EPSG:3857 por defecto.");
            this.projection = Projections.get(3857);
        }

        if (this.extent == undefined || this.extent.length == 0) {
            this.extent = this.projection.getExtent();
        }

        if (this.centerPoint == undefined || this.centerPoint.length == 0) {
            this.centerPoint = [0, 0];
        }
    }

    /**
     * Renderiza el mapa en el DOM
     */
    render() {
        this.id = settingsHolder.getSetting("map.domId");
        const layers = settingsHolder.getSetting("map.defaultLayers");
        this.defaultLayers = layerFactory.getLayers(layers);
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
            layers: this.defaultLayers,
            loadTilesWhileAnimating: true,
            view: new View({
                extent: this.extent,
                projection: this.projection,
                center: this.centerPoint,
                zoom: this.initialZoom,
                minZoom: this.minZoom
            }),
            units: this.unit
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