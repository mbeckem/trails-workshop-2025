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
                mapRegistry: "map.MapRegistry",
                httpService: "http.HttpService",
                notifier: "notifier.NotificationService"
            }
        }
    },
    ui: {
        references: ["workshop.AppModel", "notifier.NotificationService"]
    }
});
