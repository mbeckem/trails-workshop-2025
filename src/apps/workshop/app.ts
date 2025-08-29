import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { AppUI } from "./ui/AppUI";

// This reads the `lang` parameter from the URL and uses it for the application's locale.
const URL_PARAMS = new URLSearchParams(window.location.search);
const FORCED_LANG = URL_PARAMS.get("lang") || undefined;

const element = createCustomElement({
    component: AppUI,
    appMetadata,
    config: {
        locale: FORCED_LANG
    }
});

customElements.define("workshop-app", element);
