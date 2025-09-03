import { Box, IconButton } from "@chakra-ui/react";
import { Tooltip } from "@open-pioneer/chakra-snippets/tooltip";
import { useIntl } from "open-pioneer:react-hooks";
import { ReactNode, useState } from "react";
import { LuArrowDownLeft, LuArrowUpRight } from "react-icons/lu";

export function CollapseWidget(props: { children?: ReactNode }) {
    const { children } = props;
    const intl = useIntl();
    const [isOpen, setIsOpen] = useState(false);
    const label = intl.formatMessage({ id: "collapseTool.label" });

    // NOTE: Not ready for production usages, aria attributes are missing.
    return (
        <Box
            position="relative"
            backgroundColor="white"
            borderWidth="1px"
            borderRadius="lg"
            padding={2}
            boxShadow="lg"
            minH="34px"
            minW="34px"
        >
            <Tooltip content={label}>
                <IconButton
                    position="absolute"
                    top={0}
                    right={0}
                    size="xs"
                    variant="plain"
                    aria-label={label}
                    focusVisibleRing="inside"
                    onClick={() => setIsOpen((isOpen) => !isOpen)}
                >
                    {isOpen ? <LuArrowUpRight /> : <LuArrowDownLeft />}
                </IconButton>
            </Tooltip>
            <Box
                display={isOpen ? "flex" : "none"}
                flexDirection="column"
                w="300px"
                minH="100px"
                maxH="500px"
                overflowX="hidden"
                overflowY="auto"
                transition="all"
            >
                {children}
            </Box>
        </Box>
    );
}
