import { Flex } from "@chakra-ui/react";
import { MapAnchor, MapContainer, MapModel } from "@open-pioneer/map";
import { ZoomIn, ZoomOut } from "@open-pioneer/map-navigation";
import { ToolButton } from "@open-pioneer/map-ui-components";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { ScaleBar } from "@open-pioneer/scale-bar";
import { useIntl, useService } from "open-pioneer:react-hooks";
import { LuAtom } from "react-icons/lu";
import { AppModel } from "../AppModel";
import { CollapseWidget } from "./CollapseTool";

export function MapContent() {
    const intl = useIntl();
    const appModel = useService<AppModel>("workshop.AppModel");
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
                    <CollapseWidget>Hier könnte Ihr Inhalt stehen!</CollapseWidget>
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
                        <ToolButton
                            label={intl.formatMessage({ id: "map.printMapInfoLabel" })}
                            icon={<LuAtom />}
                            onClick={() => printMapInfo(map)}
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

function printMapInfo(map: MapModel) {
    const coords = map.center?.toString() || "N/A";
    const projection = map.projection.getCode();
    const scale = map.scale != null ? `1:${map.scale}` : "N/A";
    console.log(
        `Current coordinates: ${coords}\n` +
            `Current projection: ${projection}\n` +
            `Current scale: ${scale}`
    );
}
