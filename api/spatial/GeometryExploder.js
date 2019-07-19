import GeometryType from 'ol/geom/GeometryType';

class GeometryExploder {
    constructor() {}

    getPolygons(geom) {
        return this.getGeometriesOfType(geom, GeometryType.POLYGON);
    }

    getGeometriesOfType(geom, geometryType) {
        var explodedGeoms = this.explode(geom);
        var selectedGeoms = [];

        explodedGeoms.forEach(function(geometry) {
            if (geometry.getType() == geometryType) {
                selectedGeoms.push(geometry);
            }
        });

        return selectedGeoms;
    }

    explode(geom) {
        var subGeometries = [];

        switch (geom.getType()) {
            case GeometryType.GEOMETRY_COLLECTION:
                subGeometries = geom.getGeometries();
                /**
                 * La GeometryCollection puede contener otras multi-geometrias,
                 * por lo que se realiza una llamada recursiva para obtener
                 * solamente geometrias simples
                 */
                var subSubGeometries = [];
                subGeometries.forEach(function(geometry) {
                    subSubGeometries.concat(this.explode(geometry));
                }.bind(this));

                subGeometries.concat(subSubGeometries);
                break;
            case GeometryType.MULTI_POLYGON:
                subGeometries = geom.getPolygons();
                break;
            case GeometryType.MULTI_LINE_STRING:
                subGeometries = geom.getLineStrings();
                break;
            case GeometryType.MULTI_POINT:
                subGeometries = geom.getPoints();
                break;

            default:
                subGeometries.push(geom);
        }

        return subGeometries;
    }
}

export default new GeometryExploder();