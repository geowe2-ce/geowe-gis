import { ToolBar } from 'geowe-ui-js/api/toolbar/ToolBar';;
import { MapRenderer } from './api/map/MapRenderer';
import './style/main.css';

import { PanTool } from './api/tool/main/PanTool';
import { SelectTool } from './api/tool/main/SelectTool';
import { ZoomToExtentTool } from './api/tool/zoom/ZoomToExtentTool';
import { ZoomInTool } from './api/tool/zoom/ZoomInTool';
import { ZoomOutTool } from './api/tool/zoom/ZoomOutTool';
import { ZoomBoxTool } from './api/tool/zoom/ZoomBoxTool';
import { MeasureLineStringTool } from './api/tool/measure/MeasureLineStringTool';
import { MeasurePolygonTool } from './api/tool/measure/MeasurePolygonTool';

import appConfig from './appConfig.json';
import settingsHolder from './api/conf/SettingsHolder';

//settingsHolder.setLocale("en");
//settingsHolder.loadURLSettings("https://raw.githubusercontent.com/jmmluna/geodata/master/appConfig.json", initialize);

settingsHolder.loadSettings(appConfig);
initialize();

function initialize() {

    const toolbar = new ToolBar("toolbarId");
    toolbar.show();
    const mapRenderer = new MapRenderer();

    mapRenderer.render();

    const panTool = new PanTool(mapRenderer.getMap());
    const selectTool = new SelectTool(mapRenderer.getMap());
    const zoomToExtentTool = new ZoomToExtentTool(mapRenderer.getMap());
    const zoomInTool = new ZoomInTool(mapRenderer.getMap());
    const zoomOutTool = new ZoomOutTool(mapRenderer.getMap());
    const zoomBoxTool = new ZoomBoxTool(mapRenderer.getMap());
    const measureLineStringTool = new MeasureLineStringTool(mapRenderer.getMap());
    const measurePolygonTool = new MeasurePolygonTool(mapRenderer.getMap());


    toolbar.addTool(panTool.getUIElement(), "tools", true);
    toolbar.addTool(selectTool.getUIElement(), "tools");
    toolbar.addTool(zoomToExtentTool);
    toolbar.addTool(zoomInTool);
    toolbar.addTool(zoomOutTool);
    toolbar.addTool(zoomBoxTool.getUIElement(), "tools");
    toolbar.addTool(measureLineStringTool.getUIElement(), "tools");
    toolbar.addTool(measurePolygonTool.getUIElement(), "tools");


}

function execute() {
    alert("executed!!");
}