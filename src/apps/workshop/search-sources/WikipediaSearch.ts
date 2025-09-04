import { HttpService } from "@open-pioneer/http";
import { SearchOptions, SearchResult, SearchSource } from "@open-pioneer/search";

export class WikipediaSearch implements SearchSource {
    #httpService: HttpService;

    label = "Wikipedia";

    constructor(httpService: HttpService) {
        this.#httpService = httpService;
    }

    async search(inputValue: string, { signal }: SearchOptions): Promise<SearchResult[]> {
        const params = new URLSearchParams({
            action: "opensearch",
            search: inputValue,
            limit: "5",
            namespace: "0",
            format: "json",
            origin: "*"
        });

        const url = `https://en.wikipedia.org/w/api.php?${params}`;
        const response = await this.#httpService.fetch(url, {
            signal
        });
        if (!response.ok) {
            throw new Error(`Request to Wikipedia API failed with status code ${response.status}`);
        }

        const [, titles, , urls] = await response.json();
        return (titles as string[]).map((title, index): SearchResult => {
            return {
                id: index,
                label: title,
                properties: {
                    url: urls[index]
                }
            };
        });
    }
}
