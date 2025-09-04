import { Flex, Spacer } from "@chakra-ui/react";
import { SectionHeading } from "@open-pioneer/react-utils";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { useService } from "open-pioneer:react-hooks";
import { AppModel } from "../AppModel";
import { Search } from "@open-pioneer/search";

export function Header() {
    const appModel = useService<AppModel>("workshop.AppModel");
    const searchSources = useReactiveSnapshot(() => appModel.searchSources, [appModel]);
    return (
        <Flex
            py={2}
            px={2}
            borderBottom="3px solid"
            borderBottomColor="trails.500"
            alignItems="center"
            css={{
                "& .header-search": {
                    flex: "1 1 auto",
                    maxW: "45%"
                }
            }}
        >
            <SectionHeading
                size="lg"
                flex="0 1 auto"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
            >
                Open Pioneer Trails Workshop
            </SectionHeading>
            <Spacer minW="10px" />
            <Search
                className="header-search"
                sources={searchSources}
                onSelect={(event) => {
                    console.debug("Search result selected", event);
                    appModel.onSearchComplete(event.source, event.result);
                }}
            />
        </Flex>
    );
}
