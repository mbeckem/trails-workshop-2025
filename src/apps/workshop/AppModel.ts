import { reactive } from "@conterra/reactivity-core";
import { createLogger } from "@open-pioneer/core";
import { HttpService } from "@open-pioneer/http";
import { MapModel, MapRegistry } from "@open-pioneer/map";
import { NotificationService } from "@open-pioneer/notifier";
import { DECLARE_SERVICE_INTERFACE, ServiceOptions } from "@open-pioneer/runtime";
import { SearchResult, SearchSource } from "@open-pioneer/search";
import { MAP_ID } from "./MapConfigImpl";
import { PhotonGeocoder } from "./search-sources/PhotonGeocoder";
import { WikipediaSearch } from "./search-sources/WikipediaSearch";

const LOG = createLogger("workshop.AppModel");

interface References {
    mapRegistry: MapRegistry;
    httpService: HttpService;
    notifier: NotificationService;
}

export class AppModel {
    declare [DECLARE_SERVICE_INTERFACE]: "workshop.AppModel";

    #notifier: NotificationService;

    #map = reactive<MapModel | undefined>();
    #searchSources = reactive<SearchSource[]>([]);

    constructor({ references }: ServiceOptions<References>) {
        this.#notifier = references.notifier;

        // This triggers map construction and, on success, makes the initialized map
        // available to the UI (and any other potential users of this service).
        const mapRegistry = references.mapRegistry;
        mapRegistry
            .expectMapModel(MAP_ID)
            .then((map) => {
                this.#map.value = map;
                this.#searchSources.value = [
                    // Search source needs the map to search on the current center, the map is not yet available as a callback property.
                    new WikipediaSearch(references.httpService),
                    new PhotonGeocoder(map, references.httpService)
                ];
            })
            .catch((error) => {
                // Error not shown in UI in this app
                LOG.error("Failed to construct map", error);
            });
    }

    /**
     * The current map, or undefined if still loading or loading failed.
     */
    get map(): MapModel | undefined {
        return this.#map.value;
    }

    /**
     * Currently available search sources, used by the `Search` component (see Header.tsx).
     *
     * Empty if not yet initialized.
     */
    get searchSources(): SearchSource[] {
        return this.#searchSources.value;
    }

    /**
     * Called by the UI when a search result has been selected (see Header.tsx).
     */
    onSearchComplete(source: SearchSource, result: SearchResult) {
        // Open Wikipedia result in new window
        if (source instanceof WikipediaSearch && result.properties?.url) {
            const url = result.properties.url as string;
            window.open(url, "_blank");
            return;
        }

        this.#notifier.info({
            title: `Ausgewählt: ${result.label}`
        });
    }
}
