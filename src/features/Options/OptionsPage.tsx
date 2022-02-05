import {
    Box,
    Button,
    ButtonProps,
    Center,
    CenterProps,
    Checkbox,
    FormLabel,
    Icon,
    Input,
    Spinner,
    Stack,
} from "@chakra-ui/react";
// import { shell } from "electron";
import { useMutation, useQuery } from "react-query";
import { electronRequest } from "../../utils";
import { AiFillGithub, AiFillTwitterCircle } from "react-icons/ai";
import { CopyIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../../../electron/preload";
import { useAtomValue } from "jotai/utils";
import { configAtom, discordUrlsAtom } from "../../components/LCUConnector";
import { useEffect } from "react";
import { FaDiscord } from "react-icons/fa";
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

const useEditConfigMutation = () =>
    useMutation((obj: Record<string, any>) => electronRequest("config/set", obj));
export const ConfigPanel = () => {
    const config = useAtomValue(configAtom);
    const editConfigMutation = useEditConfigMutation();
    if (!config) return <Spinner />;

    return (
        <>
            <ConfigForm config={config} mb="50px" />
            <Checkbox
                isChecked={config.windowsNotifications}
                onChange={(e) =>
                    editConfigMutation.mutate({ windowsNotifications: e.target.checked })
                }
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

export const ConfigForm = ({ config, ...props }: { config: Record<string, any> } & CenterProps) => {
    const editConfigMutation = useEditConfigMutation();
    const { handleSubmit, register } = useForm({
        defaultValues: { defaultLossMessage: config.defaultLossMessage },
    });

    const onSubmit = (data: any) =>
        editConfigMutation.mutate({ defaultLossMessage: data.defaultLossMessage });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Center flexDir="column" {...props}>
                <FormLabel>Default loss message</FormLabel>
                <Input type="text" {...register("defaultLossMessage")} />
                <Button mt="10px" type="submit">
                    Save
                </Button>
            </Center>
        </form>
    );
};
