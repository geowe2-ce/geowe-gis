import { JSTSParser } from './JSTSParser';
import geometryExploder from './GeometryExploder';


class SpatialEngine {
    constructor() {
        this.jstsParser = new JSTSParser();
    }

    bufferFeature(feature, distance) {
        feature.setGeometry(this.bufferGeometry(feature.getGeometry(), distance));
        return feature;
    }

    bufferGeometry(geometry, distance) {
        var jstsGeom = this.jstsParser.getJSTSGeometry(geometry);
        var bufferGeometry = jstsGeom.buffer(distance);

        return this.jstsParser.getOLGeometry(bufferGeometry);
    }

    distanceBetween(geom1, geom2) {
        var jstsGeom1 = this.jstsParser.getJSTSGeometry(geom1);
        var jstsGeom2 = this.jstsParser.getJSTSGeometry(geom2);

        return jstsGeom1.distance(jstsGeom2);
    }

    unionFeature(feature1, feature2) {
        var feature = feature1.clone();
        feature.setGeometry(this.unionGeometry(feature1.getGeometry(), feature2.getGeometry()));
        return feature;
    }

    /*getCentroid(geometry) {
        var jstsGeom = this.jstsParser.getJSTSGeometry(geometry);
        var coordinate = this.jstsParser.getCentroid(jstsGeom);

        alert(coordinate.x);
        var geometryFactory = this.jstsParser.getGeometryFactory();
        var point = geometryFactory.createPoint(coordinate);
        alert(JSON.stringify(point));

        return this.jstsParser.getOLGeometry(point);
    }*/

    mergeFeaturesWithExplode(features) {
        var featureTemplate = features[0].clone();
        var mergedFeature = this.mergeFeatures(features);

        var polygonResults = geometryExploder.getPolygons(mergedFeature.getGeometry());
        var newFeatures = [];
        polygonResults.forEach(function(polygon) {
            var featureClone = featureTemplate.clone();
            featureClone.setGeometry(polygon);
            newFeatures.push(this.removeSmallHoles(featureClone));
        }.bind(this));

        return newFeatures;
    }

    mergeFeatures(features) {
        var union;

        features.forEach(function(feature) {
            if (union == undefined)
                union = feature.clone();

            try {
                union = this.unionFeature(union, feature);
            } catch (ex) {
                //console.log("error en mergeFeatures: " + ex.message)
            }
        }.bind(this));

        return union;
    }

    unionGeometry(geom1, geom2) {
        var jstsGeom1 = this.jstsParser.getJSTSGeometry(geom1);
        var jstsGeom2 = this.jstsParser.getJSTSGeometry(geom2);
        var unionGeometry = jstsGeom1.union(jstsGeom2);

        return this.jstsParser.getOLGeometry(unionGeometry);
    }

    splitFeature(feature, geometryLine) {

        var jsts_geom = this.jstsParser.getJSTSGeometry(feature.getGeometry());
        var jsts_geom_line = this.jstsParser.getJSTSGeometry(geometryLine);
        var union = jsts_geom.getExteriorRing().union(jsts_geom_line);

        var polygonizer = this.jstsParser.getPolygonizer();
        polygonizer.add(union);
        var polygons = polygonizer.getPolygons();
        var resultFeatures = [];
        for (var i = polygons.iterator(); i.hasNext();) {

            var polygon = i.next();
            var newFeature = feature.clone();
            var totalHoles = jsts_geom.getNumInteriorRing();

            for (var n = 0; n < totalHoles; n++) {
                var hole = jsts_geom.getInteriorRingN(n);
                var holePolygonizer = this.jstsParser.getPolygonizer();
                holePolygonizer.add(hole);
                var holePolygons = holePolygonizer.getPolygons();

                polygon = polygon.difference(holePolygons.iterator().next());

            }

            var ol_geom = this.jstsParser.getOLGeometry(polygon);
            newFeature.setGeometry(ol_geom);
            resultFeatures.push(newFeature);
        };

        return resultFeatures;
    }

    existIntersect(feature, geometryIntersect) {
        var jsts_geom_intersect = this.jstsParser.getJSTSGeometry(geometryIntersect);
        var jsts_geom = this.jstsParser.getJSTSGeometry(feature.getGeometry());

        return jsts_geom.intersects(jsts_geom_intersect);
    }

    intersects(features, geometryIntersects) {
        var jsts_geom_intersects = this.jstsParser.getJSTSGeometry(geometryIntersects);
        var targetFeatures = [];
        var this_ = this;

        features.forEach(function(feature) {

            var jsts_geom = this_.jstsParser.getJSTSGeometry(feature.getGeometry());

            if (jsts_geom.intersects(jsts_geom_intersects)) {
                targetFeatures.push(feature);
            }

        });

        return targetFeatures;
    }

    intersection(feature, geometryIntersect) {
        var ol_geom = undefined;

        try {
            var jsts_geom_intersects = this.jstsParser.getJSTSGeometry(geometryIntersect);
            var jsts_geom = this.jstsParser.getJSTSGeometry(feature.getGeometry());

            var resultGeom = jsts_geom.intersection(jsts_geom_intersects);
            ol_geom = this.jstsParser.getOLGeometry(resultGeom);
        } catch (ex) {
            //alert("Error topológico (intersection): " + ex.message);
            //console.log("Error topológico (intersection): " + ex.message);
            throw ex;
        }
        return ol_geom;
    }

    difference(feature, geometry) {
        var ol_geom = undefined;
        try {
            var jsts_geom_difference = this.jstsParser.getJSTSGeometry(geometry);
            var jsts_geom = this.jstsParser.getJSTSGeometry(feature.getGeometry());
            var resultGeom = jsts_geom.difference(jsts_geom_difference);
            resultGeom = resultGeom.buffer(0);
            ol_geom = this.jstsParser.getOLGeometry(resultGeom);
        } catch (ex) {
            //console.log("Error topológico (difference): " + ex.message);
            throw ex;
        }
        return ol_geom;
    }

    equals(geom1, geom2) {
        var jstsGeom1 = this.jstsParser.getJSTSGeometry(geom1);
        var jstsGeom2 = this.jstsParser.getJSTSGeometry(geom2);

        return jstsGeom1.equals(jstsGeom2);
    }


    /**
     * Realiza el cálculo de superficie de cualquier tipo geometría, extrayendo
     * los componentes poligonales y desechando el resto.
     */
    getArea(geom) {
        var results = geometryExploder.getPolygons(geom);
        var totalSurfaces = 0;
        results.forEach(function(geom) {
            totalSurfaces = totalSurfaces + geom.getArea();
        });

        return totalSurfaces;
    }

    removeSmallHoles(feature) {
        var newFeature = feature.clone();
        var jsts_geom = this.jstsParser.getJSTSGeometry(feature.getGeometry());

        if (jsts_geom.getGeometryType() != "Polygon") {
            alert("Se ha detectado un " + jsts_geom.getGeometryType());
            return newFeature;
        }

        var exteriorRing = jsts_geom.getExteriorRing();
        var polygonizer = this.jstsParser.getPolygonizer();
        var totalHoles = jsts_geom.getNumInteriorRing();

        if (totalHoles == 0)
            return newFeature;

        var successfulHoles = [];

        for (var n = 0; n < totalHoles; n++) {
            var hole = jsts_geom.getInteriorRingN(n);
            var holePolygonizer = this.jstsParser.getPolygonizer();
            holePolygonizer.add(hole);
            var holePolygon;
            try {
                holePolygon = holePolygonizer.getPolygons().iterator().next();
            } catch (e) {
                alert("error al validar hueco: " + e.message);
            }

            if (holePolygon.getArea() > 10) {
                successfulHoles.push(hole);
            }
        }

        var unionResult = exteriorRing;
        successfulHoles.forEach(function(hole) {
            try {
                unionResult = unionResult.union(hole);
            } catch (e) {
                alert("error al reconstruir hueco: " + e.message);
            }
        });

        polygonizer.add(unionResult);
        var ol_geom;
        try {
            if (polygonizer.getPolygons().size() == 0) {
                return newFeature;
            } else {
                ol_geom = this.jstsParser.getOLGeometry(polygonizer.getPolygons().iterator().next());
            }

        } catch (e) {
            alert("error al limpiar huecos: " + e.message);
        }
        newFeature.setGeometry(ol_geom);

        return newFeature;
    }

}

export default new SpatialEngine();