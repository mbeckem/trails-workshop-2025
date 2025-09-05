// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { FC, useState } from "react";
import {
    CommonComponentProps,
    SectionHeading,
    useCommonComponentProps
} from "@open-pioneer/react-utils";
import { Box, Button, Text } from "@chakra-ui/react";
import { MapModel } from "@open-pioneer/map";

type MapInfos = {
    projection: string;
    coordinates: string;
    scale: string;
};

export interface MapInfoComponentProps extends CommonComponentProps {
    map: MapModel;
}

export const MapInfoComponent: FC<MapInfoComponentProps> = (props) => {
    const { map } = props;
    const { containerProps } = useCommonComponentProps("simple-ui", {});

    const [mapInfos, setMapInfos] = useState<MapInfos>({
        projection: "",
        coordinates: "",
        scale: ""
    });

    function updateMapInfo() {
        const coords = map.center;
        const projection = map.projection.getCode();
        const scale = map.scale != null ? `1:${map.scale}` : "N/A";
        setMapInfos({
            projection: projection,
            coordinates: coords ? coords.map((c) => c.toFixed(2)).join(", ") : "N / A",
            scale: scale
        });
    }

    const infoText = `Projektion: ${mapInfos.projection} \n Koordinaten: ${mapInfos.coordinates} \n Maßstab: ${mapInfos.scale}`;

    return (
        <Box {...containerProps} border="1.5px solid" padding={1} mt={3}>
            <SectionHeading size={"sm"} pb={1}>
                Karteninformationen
            </SectionHeading>
            <Text margin-top={3} whiteSpace="pre-line" pb={2}>
                {infoText}
            </Text>
            <Button
                onClick={() => {
                    updateMapInfo();
                }}
            >
                Aktualisieren
            </Button>
        </Box>
    );
};
