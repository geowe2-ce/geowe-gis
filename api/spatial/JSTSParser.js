import GeoJSON from 'ol/format/GeoJSON';
import * as jsts from 'jsts';

export class JSTSParser {
    constructor() {

    }

    getJSTSGeometry(geometry) {
        var olFormat = new GeoJSON();
        var geojsonRepresentation = olFormat.writeGeometry(geometry);

        var reader = new jsts.io.GeoJSONReader();
        var jstsGeom = reader.read(geojsonRepresentation);
        return jstsGeom;
    }

    getOLGeometry(jstsGeom) {
        var writter = new jsts.io.GeoJSONWriter();
        var geojson = writter.write(jstsGeom);

        var olFormat = new GeoJSON();
        var olGeom = olFormat.readGeometry(geojson);

        return olGeom;
    }

    getPolygonizer() {
        return new jsts.operation.polygonize.Polygonizer();
    }

    getGeometryFactory() {
        return new jsts.geom.GeometryFactory();
    }

    getCoordinate(x, y) {
        return new jsts.geom.Coordinate(x, y);
    }

    getCentroid(geometry) {
        return new jsts.algorithm.Centroid(geometry);
    }



    isOrientedCounterClockwise(geometry) {
        var jstsGeom = this.getJSTSGeometry(geometry);
        return jsts.algorithm.CGAlgorithms.isCCW(jstsGeom.getCoordinates());
    }
}

//export default new JSTSParser();