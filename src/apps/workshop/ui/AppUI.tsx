import { Flex } from "@chakra-ui/react";
import { DefaultMapProvider } from "@open-pioneer/map";
import { Notifier } from "@open-pioneer/notifier";
import { TitledSection } from "@open-pioneer/react-utils";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { useService } from "open-pioneer:react-hooks";
import { AppModel } from "../AppModel";
import { Header } from "./Header";
import { MapContent } from "./MapContent";
import { Footer } from "./Footer";

export function AppUI() {
    const appModel = useService<AppModel>("workshop.AppModel");

    // Map can be undefined if it's still loading or an error occurred.
    // This app displays nothing in that case, but one could use this to show a
    // loading screen or an error message.
    const map = useReactiveSnapshot(() => appModel.map, [appModel]);
    return (
        <Flex height="100%" direction="column" overflow="hidden">
            <Notifier />
            <TitledSection>
                {/** Uses the specified map for all map-related widgets */}
                {map && (
                    <DefaultMapProvider map={map}>
                        <Header />
                        <MapContent />
                        <Footer />
                    </DefaultMapProvider>
                )}
            </TitledSection>
        </Flex>
    );
}
