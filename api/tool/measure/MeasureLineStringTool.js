import { MeasureTool } from './MeasureTool';

export class MeasureLineStringTool extends MeasureTool {
    constructor(map) {
        super("measureLineStringTool", "LineString", map);
    }
}