import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import { OsmTileLayer } from './tile/catalog/OsmTileLayer';
import { Projections } from '../proj/Projections';
import { getWidth, getTopLeft } from 'ol/extent.js';

import Vector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import settingsHolder from '../conf/SettingsHolder';

class LayerFactory {
    constructor() {
        this.osmLayer = new OsmTileLayer().getTileLayer();
        this.geojsonFormat = new GeoJSON();
    }

    getLayer(layerName) {
        var layer = undefined;
        const layerSettings = settingsHolder.getSetting(layerName);

        if (layerName == "osm") {
            layer = this.osmLayer;
        } else if (layerSettings != undefined) {
            if (layerSettings.type == "wms")
                layer = this.getWMSLayer(layerSettings);
            else if (layerSettings.type == "xyz")
                layer = this.getXYZLayer(layerSettings);
            else if (layerSettings.type == "wmts")
                layer = this.getWMTSLayer(layerSettings);
            else if (layerSettings.type == "vector")
                layer = this.getVectorLayer(layerSettings);
        } else
            console.warn("No se ha encontrado la capa " + layerName + ". No olvide indicar el nombre como: <raster|wfs|wmts." + layerName + ">");

        return layer;
    }

    getLayers(layerNames) {
        const layers = [];

        layerNames.forEach((layerName) => {
            const layer = this.getLayer(layerName);
            if (layer != undefined)
                layers.push(layer);
        });

        return layers;
    }

    getWMSLayer(layerSettings) {
        return new TileLayer({
            title: layerSettings.title,
            source: new TileWMS({
                attributions: layerSettings.attributions != undefined ? layerSettings.attributions : "No attributions provided",
                url: layerSettings.url,
                params: {
                    'LAYERS': layerSettings.layers,
                    'SRS': layerSettings.srs != undefined ? layerSettings.srs : "EPSG:3857",
                    'FORMAT': layerSettings.format != undefined ? layerSettings.format : "image/png"
                },

                //tileLoadFunction: proxyTileLoader.load,
                //crossOrigin: 'anonymous'
            }),
            visible: layerSettings.visible != undefined ? layerSettings.visible : true
        })

    }

    getXYZLayer(layerSettings) {
        return new TileLayer({
            source: new XYZ({
                attributions: layerSettings.attributions != undefined ? layerSettings.attributions : "No attributions provided",
                url: layerSettings.url
            })
        });
    }

    getWMTSLayer(layerSettings) {
        var projection = Projections.get(layerSettings.srs != undefined ? layerSettings.srs : "EPSG:3857");
        var projectionExtent = projection.getExtent();
        var size = getWidth(projectionExtent) / 256;
        var resolutions = new Array(14);
        var matrixIds = new Array(14);
        for (var z = 0; z < 14; ++z) {
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }

        return new TileLayer({
            source: new WMTS({
                attributions: layerSettings.attributions != undefined ? layerSettings.attributions : "No attributions provided",
                url: layerSettings.url,
                layer: layerSettings.layer,
                matrixSet: layerSettings.matrixSet,
                projection: projection,
                format: layerSettings.format != undefined ? layerSettings.format : "image/png",
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                style: layerSettings.style != undefined ? layerSettings.style : "default",
                wrapX: true
            })
        });
    }

    getVectorLayer(layerSettings) {
        const layerName = layerSettings.uri != undefined ? layerSettings.uri : layerSettings.uri.split('/').pop().split('?')[0];
        const layer = this.getEmptyVectorLayer(layerName);
        this.loadURLFile(layer, layerSettings);
        return layer;
    }

    getEmptyVectorLayer(layerName) {
        var vectorLayer = new Vector({
            source: new SourceVector()
        });

        vectorLayer.set('name', layerName);
        return vectorLayer;
    }

    loadURLFile(layer, layerSettings) {
        fetch(layerSettings.uri).then((response) => {
            return response.json();
        }).then((json) => {
            const geojson = JSON.stringify(json);
            const mapProjection = settingsHolder.getSetting("map.projection");
            const featureCollection = this.geojsonFormat.readFeatures(geojson, { "dataProjection": layerSettings.srs, "featureProjection": mapProjection });
            layer.getSource().addFeatures(featureCollection);
        });
    }
}

export default new LayerFactory();