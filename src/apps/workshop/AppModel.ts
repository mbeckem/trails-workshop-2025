import { reactive } from "@conterra/reactivity-core";
import { MapModel, MapRegistry } from "@open-pioneer/map";
import { DECLARE_SERVICE_INTERFACE, ServiceOptions } from "@open-pioneer/runtime";
import { MAP_ID } from "./MapConfigImpl";
import { createLogger } from "@open-pioneer/core";

const LOG = createLogger("workshop.AppModel");

interface References {
    mapRegistry: MapRegistry;
}

export class AppModel {
    declare [DECLARE_SERVICE_INTERFACE]: "workshop.AppModel";

    #map = reactive<MapModel | undefined>();

    constructor(options: ServiceOptions<References>) {
        // This triggers map construction and, on success, makes the initialized map
        // available to the UI (and any other potential users of this service).
        const mapRegistry = options.references.mapRegistry;
        mapRegistry
            .expectMapModel(MAP_ID)
            .then((map) => {
                this.#map.value = map;
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
}
