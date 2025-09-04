// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { HttpService } from "@open-pioneer/http";
import { MapModel } from "@open-pioneer/map";
import { SearchOptions, SearchResult, SearchSource } from "@open-pioneer/search";
import GeoJSON from "ol/format/GeoJSON";
import { transform } from "ol/proj";

interface PhotonResponseFeature {
    geometry: unknown; // geojson
    properties: {
        osm_id: number;
        osm_value: string;
        name: string;
        city: string;
        postcode: string;
        country: string;
        type: string;
    };
}

interface PhotonResponse {
    features: PhotonResponseFeature[];
}

/**
 * A simple search source that queries the [Photon Geocoder service](https://photon.komoot.io/).
 *
 * This source is intended to serve as an example.
 */
export class PhotonGeocoder implements SearchSource {
    private map: MapModel;
    private filteredTypes: string[];
    private httpService: HttpService;

    label: string;

    constructor(map: MapModel, httpService: HttpService) {
        this.map = map;
        this.label = "Photon Geocoder";
        this.filteredTypes = ["city", "street"];
        this.httpService = httpService;
    }

    async search(
        inputValue: string,
        { mapProjection, signal }: SearchOptions
    ): Promise<SearchResult[]> {
        const response = await this.request(inputValue, 100, signal);
        const geojson = new GeoJSON({
            dataProjection: "EPSG:4326",
            featureProjection: mapProjection
        });

        return response.features
            .filter((feature: PhotonResponseFeature) =>
                this.filteredTypes.includes(feature.properties.type)
            )
            .map((feature: PhotonResponseFeature, idx: number): SearchResult => {
                const geometry = geojson.readGeometry(feature.geometry);
                return {
                    id: feature.properties.osm_id || idx,
                    label: this.createLabel(feature),
                    geometry: geometry,
                    properties: feature.properties
                };
            });
    }

    private async request(
        inputValue: string,
        limit: number,
        signal?: AbortSignal | undefined
    ): Promise<PhotonResponse> {
        let center = this.map.center;
        let projection = this.map.projection.getCode();
        if (!center || !projection) {
            center = [7.628202, 51.961563];
            projection = "EPSG:4326";
        }

        if (projection !== "EPSG:4326") {
            center = transform(center, projection, "EPSG:4326");
        }

        const url = new URL("https://photon.komoot.io/api?");
        url.searchParams.set("q", inputValue);
        url.searchParams.set("lang", "de");
        url.searchParams.set("lat", center[1]!.toString());
        url.searchParams.set("lon", center[0]!.toString());
        url.searchParams.set("limit", limit.toString());
        const response = await this.httpService.fetch(url, { signal });
        if (!response.ok) {
            throw new Error("Request failed: " + response.status);
        }
        const result = (await response.json()) as PhotonResponse;
        return result;
    }

    private createLabel(feature: PhotonResponseFeature) {
        const props = feature.properties;
        const details = [props.osm_value, props.postcode, props.city, props.country]
            .map((field) => field?.trim())
            .filter((field) => !!field)
            .join(", ");
        return `${props.name} (${details})`;
    }
}
