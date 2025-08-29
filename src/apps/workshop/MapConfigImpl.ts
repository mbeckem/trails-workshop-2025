import { MapConfigProvider, MapConfig, SimpleLayer, WMTSLayer, WMSLayer } from "@open-pioneer/map";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

export const MAP_ID = "main";

export class MapConfigImpl implements MapConfigProvider {
    mapId = MAP_ID;

    async getMapConfig(): Promise<MapConfig> {
        return {
            initialView: {
                kind: "position",
                center: { x: 848800, y: 6793584 },
                zoom: 14
            },
            projection: "EPSG:3857",
            layers: [
                new SimpleLayer({
                    title: "OpenStreetMap",
                    olLayer: new TileLayer({
                        source: new OSM()
                    }),
                    isBaseLayer: true
                }),
                new WMTSLayer({
                    isBaseLayer: true,
                    title: "Topplus grau",
                    url: "https://www.wmts.nrw.de/topplus_open/1.0.0/WMTSCapabilities.xml",
                    name: "topplus_grau",
                    matrixSet: "EPSG_25832_14",
                    visible: false,
                    sourceOptions: {
                        attributions: `Kartendarstellung und Präsentationsgraphiken: &copy; Bundesamt für Kartographie und Geodäsie ${new Date().getFullYear()}, <a title="Datenquellen öffnen" aria-label="Datenquellen öffnen" href="https://sg.geodatenzentrum.de/web_public/gdz/datenquellen/Datenquellen_TopPlusOpen.html " target="_blank">Datenquellen</a>`
                    }
                }),
                new WMSLayer({
                    id: "streets",
                    title: "Straßennetz Landesbetrieb Straßenbau NRW",
                    url: "https://www.wms.nrw.de/wms/strassen_nrw_wms",
                    visible: true,
                    sublayers: [
                        {
                            name: "1",
                            title: "Verwaltungen"
                        },
                        {
                            name: "4",
                            title: "Abschnitte und Äste"
                        },
                        {
                            name: "6",
                            title: "Unfälle"
                        }
                    ]
                })
            ]
        };
    }
}
