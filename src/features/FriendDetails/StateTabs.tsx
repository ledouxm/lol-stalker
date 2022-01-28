import { Box, BoxProps, Flex } from "@chakra-ui/react";

export const StateTabs = ({
    tabs,
    state,
    setState,
}: {
    tabs: { name: string; label: string }[];
    state: string;
    setState: (state: string) => void;
}) => {
    return (
        <Flex direction="row" spacing="30px" justifyContent="center">
            {tabs.map((tab) => (
                <SwitchStateButton
                    stateName={tab.name}
                    state={state}
                    setState={setState}
                    key={tab.name}
                >
                    {tab.label}
                </SwitchStateButton>
            ))}
        </Flex>
    );
};
const SwitchStateButton = ({
    state,
    stateName,
    setState,
    ...props
}: BoxProps & {
    stateName: string;
    state: string;
    setState: (state: string) => void;
}) => (
    <Box
        fontWeight={state === stateName ? "bold" : "initial"}
        borderBottom={state === stateName ? "2px solid white" : "initial"}
        p="10px"
        m="10px"
        _hover={{ bgColor: "gray.700" }}
        cursor="pointer"
        textAlign="center"
        fontSize="16px"
        onClick={() => setState(stateName)}
        {...props}
    />
);
