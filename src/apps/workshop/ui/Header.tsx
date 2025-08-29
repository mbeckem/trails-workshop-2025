import { Box } from "@chakra-ui/react";
import { SectionHeading } from "@open-pioneer/react-utils";

export function Header() {
    return (
        <Box textAlign="center" py={2} borderBottom="3px solid" borderBottomColor="trails.500">
            <SectionHeading size="lg">Open Pioneer Trails Workshop</SectionHeading>
        </Box>
    );
}
