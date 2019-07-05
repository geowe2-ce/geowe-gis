import { ToolBar } from 'geowe-ui-js/api/toolbar/ToolBar';;
import { SimpleButton } from 'geowe-ui-js/api/button/SimpleButton';
import { ToggleButton } from 'geowe-ui-js/api/button/ToggleButton';
import { MapRenderer } from './api/map/MapRenderer';
import { catastroLayer, osmLayer } from './api/layer/tile/catalog/TileLayerCatalog';
import 'geowe-ui-js/style/main.css';
import { ZoomToExtentTool } from './api/tool/zoom/ZoomToExtentTool';

const toolbar = new ToolBar("toolbarId");

// const zoomExtentButton = new SimpleButton("zoomExtentId", "", 'fas fa-globe-americas', execute);
const zoomToExtentTool = new ZoomToExtentTool();
const selectToggletButton = new ToggleButton("selectId", "", 'fas fa-mouse-pointer', execute);
const panToggleButton = new ToggleButton("panId", "", "far fa-hand-paper", execute);
const measureLineToggleButton = new ToggleButton("measureLineId", "", "fas fa-ruler", execute);
const measurePolygonToggleButton = new ToggleButton("measurePolygonId", "", "fas fa-ruler-combined", execute);

toolbar.addTool(panToggleButton, "tools", true);
toolbar.addTool(selectToggletButton, "tools");
// toolbar.addTool(zoomExtentButton);
toolbar.addTool(measureLineToggleButton, "tools");
toolbar.addTool(measurePolygonToggleButton, "tools");
toolbar.addTool(zoomToExtentTool);

var mapOptions = {
    projection: '25830',
    extent: [97805.10450538254, 3975325.5395915597, 624149.7135073378, 4290248.833085548],
    centerPoint: [624149.7135073378, 4290248.833085548]
};
var mapRenderer = new MapRenderer(mapOptions);

const rasterCatalog = [osmLayer, catastroLayer];

toolbar.show();
mapRenderer.render({ id: 'map', defaultTileLayers: rasterCatalog });


function execute() {
    alert("executed!!");
}