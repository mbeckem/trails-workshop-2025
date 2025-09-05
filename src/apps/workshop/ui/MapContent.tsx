import { Flex, Text, VStack } from "@chakra-ui/react";
import { MapAnchor, MapContainer, MapModel } from "@open-pioneer/map";
import { InitialExtent, ZoomIn, ZoomOut } from "@open-pioneer/map-navigation";
import { ToolButton } from "@open-pioneer/map-ui-components";
import { NotificationService } from "@open-pioneer/notifier";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { ScaleBar } from "@open-pioneer/scale-bar";
import { Toc } from "@open-pioneer/toc";
import { useIntl, useService } from "open-pioneer:react-hooks";
import { LuAtom } from "react-icons/lu";
import { AppModel } from "../AppModel";
import { CollapseWidget } from "./CollapseTool";
import { MapInfoComponent } from "map-info-component";

export function MapContent() {
    const intl = useIntl();
    const appModel = useService<AppModel>("workshop.AppModel");
    const notifier = useService<NotificationService>("notifier.NotificationService"); // Aufgabe 2
    const map = useReactiveSnapshot(() => appModel.map, [appModel])!;

    return (
        <Flex
            flex="1"
            direction="column"
            position="relative"
            css={{
                "& .scale-bar-container": {
                    left: "25px",
                    bottom: "25px"
                }
            }}
        >
            <MapContainer
                role="main"
                aria-label={intl.formatMessage({
                    id: "map.ariaLabel"
                })}
            >
                <MapAnchor position="top-right" horizontalGap={5} verticalGap={5}>
                    <CollapseWidget>
                        <Toc /> {/* Aufgabe 1b*/}
                        <MapInfoComponent map={map} />
                    </CollapseWidget>
                </MapAnchor>
                <MapAnchor position="bottom-right" horizontalGap={5} verticalGap={25}>
                    <Flex
                        role="toolbar"
                        direction="column"
                        aria-orientation="vertical"
                        aria-label="map.toolsAriaLabel"
                        gap={2}
                        padding={1}
                    >
                        <ZoomIn />
                        <ZoomOut />
                        <InitialExtent /> {/* Aufgabe 1a*/}
                        <ToolButton
                            label={intl.formatMessage({ id: "map.printMapInfoLabel" })}
                            icon={<LuAtom />}
                            onClick={() => printMapInfo(map, notifier)}
                        />
                    </Flex>
                </MapAnchor>
                <MapAnchor position="manual" className="scale-bar-container">
                    <ScaleBar />
                </MapAnchor>
            </MapContainer>
        </Flex>
    );
}

function printMapInfo(map: MapModel, notifier: NotificationService) {
    const coords = map.center;
    const projection = map.projection.getCode();
    const scale = map.scale != null ? `1:${map.scale}` : "N/A";

    // Aufgabe 2
    const message = (
        <VStack align="left" gap={0}>
            <Text>Projektion: {projection}</Text>
            <Text>
                Koordinaten: {coords ? coords.map((c) => c.toFixed(2)).join(", ") : "N / A"}
            </Text>
            <Text>Maßstab: {scale}</Text>
        </VStack>
    );

    notifier.info({
        title: "Kartenzustand",
        message: message
    });
}
