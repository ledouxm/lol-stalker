import { Box, Center, Flex, Stack } from "@chakra-ui/react";
import { FriendDto } from "../../types";

export const FriendOldNames = ({ friend }: { friend: FriendDto }) => {
    return !friend.oldNames?.length ? (
        <Center w="100%">
            <Box>No old names</Box>
        </Center>
    ) : (
        <Center alignItems="flex-start" w="100%">
            <Stack alignItems="center">
                {friend.oldNames.map((oldName) => (
                    <Box width="600px" key={oldName.id}>
                        <Flex direction="column">
                            <Box>{oldName.name}</Box>
                            <Box fontSize="sm" color="gray.500">
                                {oldName.createdAt.toLocaleDateString()}
                            </Box>
                        </Flex>
                    </Box>
                ))}
            </Stack>
        </Center>
    );
};
