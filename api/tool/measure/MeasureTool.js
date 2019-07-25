import '../../../style/measure.css';
import { ToggleButtonTool } from '../base/ToggleButtonTool';
import { MeasureControl } from '../../control/MeasureControl';

export class MeasureTool extends ToggleButtonTool {
    constructor(id, type, map) {
        super({ id: id, map: map });
        this.measureControl = new MeasureControl(type, map);

        const drawStrokeColor = this.getSettingsHolder().getSetting(`tool.${this.getId()}.draw-stroke`);
        const drawFillColor = this.getSettingsHolder().getSetting(`tool.${this.getId()}.draw-fill`);
        const drawTooltipBgColor = this.getSettingsHolder().getSetting(`tool.${this.getId()}.draw-tooltip-bg-color`);
        const drawTooltipTextColor = this.getSettingsHolder().getSetting(`tool.${this.getId()}.draw-tooltip-text-color`);

        const drawnStrokeColor = this.getSettingsHolder().getSetting(`tool.${this.getId()}.drawn-stroke`);
        const drawnFillColor = this.getSettingsHolder().getSetting(`tool.${this.getId()}.drawn-fill`);
        const drawnTooltipBgColor = this.getSettingsHolder().getSetting(`tool.${this.getId()}.drawn-tooltip-bg-color`);
        const drawnTooltipTextColor = this.getSettingsHolder().getSetting(`tool.${this.getId()}.drawn-tooltip-text-color`);
        const keepSingleMeasurement = this.getSettingsHolder().getSetting(`tool.${this.getId()}.keep-single-measurement`);

        this.measureControl.setDrawStrokeColor(drawStrokeColor);
        this.measureControl.setDrawFillColor(drawFillColor);
        this.measureControl.setDrawTooltipBgColor(drawTooltipBgColor);
        this.measureControl.setDrawTooltipTextColor(drawTooltipTextColor);

        this.measureControl.setDrawnStrokeColor(drawnStrokeColor);
        this.measureControl.setDrawnFillColor(drawnFillColor);
        this.measureControl.setDrawnTooltipBgColor(drawnTooltipBgColor);
        this.measureControl.setDrawnTooltipTextColor(drawnTooltipTextColor);

        this.measureControl.setKeepSingleMeasurement(keepSingleMeasurement);
    }

    onToggle(isActive) {
        this.measureControl.enableMeasure(isActive);
    }
}