import geojsonvt from 'geojson-vt';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import { VectorTile as VectorTileLayer } from 'ol/layer.js';
import { Projections } from '../proj/Projections';
import SourceVector from 'ol/source/Vector';
import { Circle, Fill, Stroke, Style } from 'ol/style';

class VectorTileLayerFactory {
    constructor() {
        this.geojsonFormat = new GeoJSON();
    }

    addData(layer, geojson) {
        const tilePixels = Projections.get("TILE_PIXELS");

        const tileIndex = geojsonvt(geojson, {
            extent: 4096,
            debug: 1
        });

        const vectorSource = new VectorTileSource({
            format: new GeoJSON(),

            tileLoadFunction: (tile) => {
                var format = tile.getFormat();
                var tileCoord = tile.getTileCoord();
                var data = tileIndex.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);

                var features = format.readFeatures(
                    JSON.stringify({
                        type: 'FeatureCollection',
                        features: data ? data.features : []
                    }, this.replacer));
                tile.setLoader(() => {
                    //vectorSource.setFeatures(features);
                    tile.setFeatures(features);
                    tile.setProjection(tilePixels);
                });
            },
            url: 'data:' // arbitrary url, we don't use it in the tileLoadFunction
        });

        vectorSource.setFeatures = (newFeatures) => {
            //vectorSource.features = vectorSource.features == undefined ? [] : vectorSource.features;

            //vectorSource.features = vectorSource.features.concat(newFeatures);
            vectorSource.features = newFeatures;
            //alert("entro:" + this.features.length);
        }

        vectorSource.getFeatures = () => {
            return vectorSource.features;
        }

        vectorSource.getExtent = () => {
            if (vectorSource.source == undefined) {
                vectorSource.source = new SourceVector();
                const features = vectorSource.getFeatures();
                //alert(features.length);
                vectorSource.source.addFeatures(features);
            }

            return vectorSource.source.getExtent();
        }

        vectorSource.forEachFeatureIntersectingExtent = (extent, callback) => {

            vectorSource.getFeatures().forEach((feature) => {
                var geometry = feature.getGeometry();
                if (geometry.intersectsExtent(extent)) {
                    var result = callback(feature);
                    if (result) {
                        return result;
                    }
                }
            });
        }

        const featureCollection = this.geojsonFormat.readFeatures(geojson, { "featureProjection": "EPSG:3857" });
        vectorSource.setFeatures(featureCollection);

        layer.setSource(vectorSource);
    }

    getFeatures() {
        return this.featuresForZ;
    }

    getVector() {
        var vectorLayer = new VectorTileLayer({
            style: new Style({
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new Stroke({
                        color: '#8bc34a',
                        width: 2
                    }),
                    image: new Circle({
                        radius: 7,
                        fill: new Fill({
                            color: '#8bc34a'
                        })
                    })
                })
                //source: new VectorTileSource({})
        });

        return vectorLayer;
    }

    replacer(key, value) {
        if (value != null && value.geometry) {
            var type;
            var rawType = value.type;
            var geometry = value.geometry;

            if (rawType === 1) {
                type = 'MultiPoint';
                if (geometry.length == 1) {
                    type = 'Point';
                    geometry = geometry[0];
                }
            } else if (rawType === 2) {
                type = 'MultiLineString';
                if (geometry.length == 1) {
                    type = 'LineString';
                    geometry = geometry[0];
                }
            } else if (rawType === 3) {
                type = 'Polygon';
                if (geometry.length > 1) {
                    type = 'MultiPolygon';
                    geometry = [geometry];
                }
            }

            return {
                'type': 'Feature',
                'geometry': {
                    'type': type,
                    'coordinates': geometry
                },
                'properties': value.tags
            };
        } else {
            return value;
        }
    }
}

export default new VectorTileLayerFactory();