import { OsmTileLayer } from './OsmTileLayer';
import { CatastroTileLayer } from './CatastroTileLayer';

export var osmLayer = new OsmTileLayer().getTileLayer();
export var catastroLayer = new CatastroTileLayer().getTileLayer();