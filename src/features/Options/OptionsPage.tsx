import { Box, Button, Center, Checkbox, Icon, Input, Spinner, Stack } from "@chakra-ui/react";
// import { shell } from "electron";
import { useMutation, useQuery } from "react-query";
import { electronRequest } from "../../utils";
import { AiFillGithub, AiFillTwitterCircle } from "react-icons/ai";
import { CopyIcon } from "@chakra-ui/icons";
export const OptionsPage = () => {
    const dlDbMutation = useMutation(() => electronRequest("config/dl-db"));
    const openExternalBrowserMutation = useMutation((url: string) =>
        electronRequest("config/open-external", url)
    );
    return (
        <Stack h="100%">
            <Center h="100%">
                <Stack>
                    <ConfigPanel />
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
                                    "https://github.com/ledouxm/lol-stalker"
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

export const ConfigPanel = () => {
    const configQuery = useQuery("config", () => electronRequest<Record<string, any>>("config"));
    const editConfigQuery = useMutation((obj: Record<string, any>) =>
        electronRequest("config/set", obj)
    );

    if (configQuery.isLoading) return <Spinner />;
    const config = configQuery.data!;

    return (
        <>
            <Checkbox
                isChecked={config.windowsNotifications}
                onChange={(e) => editConfigQuery.mutate({ windowsNotifications: e.target.checked })}
            >
                Windows notifications
            </Checkbox>
            <Button
                leftIcon={<CopyIcon />}
                onClick={() => navigator.clipboard.writeText(config.dirname)}
            >
                {config.dirname}
            </Button>
        </>
    );
};
