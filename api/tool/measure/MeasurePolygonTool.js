import { MeasureTool } from './MeasureTool';

export class MeasurePolygonTool extends MeasureTool {
    constructor(map) {
        super("measurePolygonTool", "Polygon", map);
    }
}