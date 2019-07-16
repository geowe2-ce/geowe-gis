import '../../../style/measure.css';
import { ToggleButtonTool } from '../base/ToggleButtonTool';
import { MeasureControl } from '../../control/MeasureControl';

export class MeasureTool extends ToggleButtonTool {
    constructor(id, type, map) {
        super({ id: id, map: map });
        this.measureControl = new MeasureControl(type, map);

        const drawStrokeColor = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.draw-stroke`);
        const drawFillColor = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.draw-fill`);
        const drawTooltipBgColor = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.draw-tooltip-bg-color`);
        const drawTooltipTextColor = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.draw-tooltip-text-color`);

        const drawedStrokeColor = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.drawed-stroke`);
        const drawedFillColor = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.drawed-fill`);
        const drawedTooltipBgColor = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.drawed-tooltip-bg-color`);
        const drawedTooltipTextColor = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.drawed-tooltip-text-color`);
        const keepSingleMeasurement = this.getSettingsHolder().getLocalizedSetting(`tool.${this.getId()}.keep-single-measurement`);


        this.measureControl.setDrawStrokeColor(drawStrokeColor);
        this.measureControl.setDrawFillColor(drawFillColor);
        this.measureControl.setDrawTooltipBgColor(drawTooltipBgColor);
        this.measureControl.setDrawTooltipTextColor(drawTooltipTextColor);

        this.measureControl.setDrawedStrokeColor(drawedStrokeColor);
        this.measureControl.setDrawedFillColor(drawedFillColor);
        this.measureControl.setDrawedTooltipBgColor(drawedTooltipBgColor);
        this.measureControl.setDrawedTooltipTextColor(drawedTooltipTextColor);

        this.measureControl.setKeepSingleMeasurement(keepSingleMeasurement);
    }

    onToggle(isActive) {
        this.measureControl.enableMeasure(isActive);
    }
}