import { Box, Button, Center, Icon, Input, Stack } from "@chakra-ui/react";
// import { shell } from "electron";
import { useMutation } from "react-query";
import { electronRequest } from "../../utils";
import { AiFillGithub, AiFillTwitterCircle } from "react-icons/ai";
export const OptionsPage = () => {
    const dlDbMutation = useMutation(() => electronRequest("config/dl-db"));
    const openExternalBrowserMutation = useMutation((url: string) =>
        electronRequest("config/open-external", url)
    );

    return (
        <Stack h="100%">
            <Center h="100%">
                <Stack>
                    <Button colorScheme="twitter" onClick={() => dlDbMutation.mutate()}>
                        Open db folder
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                    >
                        Empty cache
                    </Button>
                </Stack>
            </Center>
            <Center>
                <Stack padding="10px">
                    <Center>
                        <Icon
                            transition="color .2s"
                            cursor="pointer"
                            boxSize="30px"
                            _hover={{ color: "black" }}
                            as={AiFillGithub}
                            onClick={() =>
                                openExternalBrowserMutation.mutate(
                                    "https://github.com/ledouxm/lol-stalking"
                                )
                            }
                        />
                        <Icon
                            transition="color .2s"
                            cursor="pointer"
                            ml="20px"
                            boxSize="30px"
                            _hover={{ color: "#1DA1F2" }}
                            as={AiFillTwitterCircle}
                            onClick={() =>
                                openExternalBrowserMutation.mutate(
                                    "https://twitter.com/Tinmardoule"
                                )
                            }
                        />
                    </Center>
                </Stack>
            </Center>
        </Stack>
    );
};
