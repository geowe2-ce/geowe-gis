import { ToolBar } from 'geowe-ui-js/api/toolbar/ToolBar';;
import { ToggleButton } from 'geowe-ui-js/api/button/ToggleButton';
import { MapRenderer } from './api/map/MapRenderer';
import './style/main.css';

import { ZoomToExtentTool } from './api/tool/zoom/ZoomToExtentTool';
import { ZoomInTool } from './api/tool/zoom/ZoomInTool';
import { ZoomOutTool } from './api/tool/zoom/ZoomOutTool';
import { ZoomBoxTool } from './api/tool/zoom/ZoomBoxTool';
import { PanTool } from './api/tool/main/PanTool';
import { MeasureTool } from './api/tool/measure/MeasureTool';

import appConfig from './appConfig.json';
import settingsHolder from './api/conf/SettingsHolder';

//settingsHolder.setLocale("en");
//settingsHolder.loadURLSettings("https://raw.githubusercontent.com/jmmluna/geodata/master/appConfig.json", initialize);

initialize();

function initialize() {
    const toolbar = new ToolBar("toolbarId");
    const selectToggletButton = new ToggleButton("selectId", "", 'fas fa-mouse-pointer', execute);
    //const panToggleButton = new ToggleButton("panId", "", "far fa-hand-paper", execute);
    //const measureLineToggleButton = new ToggleButton("measureLineId", "", "fas fa-ruler", execute);
    //const measurePolygonToggleButton = new ToggleButton("measurePolygonId", "", "fas fa-ruler-combined", execute);

    const mapRenderer = new MapRenderer();

    toolbar.show();
    mapRenderer.render();

    const zoomToExtentTool = new ZoomToExtentTool(mapRenderer.getMap());
    const zoomInTool = new ZoomInTool(mapRenderer.getMap());
    const zoomOutTool = new ZoomOutTool(mapRenderer.getMap());
    const zoomBoxTool = new ZoomBoxTool(mapRenderer.getMap());
    const panTool = new PanTool(mapRenderer.getMap());
    const measureTool = new MeasureTool(mapRenderer.getMap());

    toolbar.addTool(panTool.getUIElement(), "tools", true);
    toolbar.addTool(selectToggletButton, "tools");
    //toolbar.addTool(measureLineToggleButton, "tools");
    //toolbar.addTool(measurePolygonToggleButton, "tools");
    toolbar.addTool(zoomToExtentTool);
    toolbar.addTool(zoomInTool);
    toolbar.addTool(zoomOutTool);
    toolbar.addTool(zoomBoxTool.getUIElement(), "tools");
    toolbar.addTool(measureTool.getUIElement(), "tools");
}

function execute() {
    alert("executed!!");
}