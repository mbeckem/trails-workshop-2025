import { Flex } from "@chakra-ui/react";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { ScaleViewer } from "@open-pioneer/scale-viewer";
import { useService } from "open-pioneer:react-hooks";
import { AppModel } from "../AppModel";

export function Footer() {
    const appModel = useService<AppModel>("workshop.AppModel");
    const map = useReactiveSnapshot(() => appModel.map, [appModel])!;
    const projection = useReactiveSnapshot(() => map.projection.getCode(), [map]);

    return (
        <Flex
            as="footer"
            gap={3}
            alignItems="center"
            justifyContent="center"
            borderTop="2px solid"
            borderTopColor="trails.500"
            pb={1}
        >
            {projection}
            <ScaleViewer />
        </Flex>
    );
}
