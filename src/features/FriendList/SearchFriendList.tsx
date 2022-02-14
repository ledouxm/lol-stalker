import { SearchIcon } from "@chakra-ui/icons";
import { Box, Input } from "@chakra-ui/react";
import { SetState } from "@pastable/core";

export const SearchFriendlist = ({
    setSearch,
    search,
}: {
    setSearch: SetState<string>;
    search: string;
}) => {
    return (
        <Box pr="20px" mt="10px" position="relative">
            <Input
                pl="40px"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
            />
            <SearchIcon pos="absolute" h="100%" left="15px" />
        </Box>
    );
};
