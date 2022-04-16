import { Button, Center, Input, Stack, Textarea } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { useForm } from "react-hook-form";
import { JSONTree } from "react-json-tree";
import { storeAtom } from "../../components/LCUConnector";
import { electronRequest } from "../../utils";

export const DevTools = () => {
    const store = useAtomValue(storeAtom);
    const { handleSubmit, register } = useForm();
    const onSubmit = (data: any) => electronRequest("ws", JSON.parse(data));
    return (
        <Center overflowY="auto" h="100%" alignItems="flex-start">
            <Stack>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Center flexDir="column">
                        Event:
                        <Input w="300px" {...register("event")} />
                        Data:
                        <Textarea w="500px" {...register("data")}></Textarea>
                        <Button type="submit">Submit</Button>
                    </Center>
                </form>
                <Button onClick={() => electronRequest("ws/reconnect")}>Reconnect ws</Button>
                <JSONTree data={store} />
            </Stack>
        </Center>
    );
};
