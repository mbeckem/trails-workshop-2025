import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    styles: "./app.css",
    i18n: ["en", "de"],
    services: {
        MapConfigImpl: {
            provides: ["map.MapConfigProvider"]
        },
        AppModel: {
            provides: ["workshop.AppModel"],
            references: {
                mapRegistry: "map.MapRegistry"
            }
        }
    },
    ui: {
        references: ["workshop.AppModel"]
    }
});
