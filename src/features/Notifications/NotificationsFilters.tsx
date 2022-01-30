import { InfoIcon } from "@chakra-ui/icons";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Checkbox,
    Stack,
    Tooltip,
} from "@chakra-ui/react";
import { useSelection } from "@pastable/core";
import { useAtom } from "jotai";
import { filtersAtom } from "./notificationsRequests";

export const NotificationsFilters = () => {
    const [filters, setFilters] = useAtom(filtersAtom);

    const [_, api] = useSelection({
        getId: (item) => item.label,
        initial: (filters.types || []).map((type) => ({ label: type })),
        onUpdate: (newSelection) =>
            setFilters((filters) => ({
                ...filters,
                types: newSelection.map((type) => type.label),
            })),
    });

    return (
        <Stack shouldWrapChildren>
            <Accordion allowMultiple defaultIndex={[0]}>
                <AccordionItem>
                    <AccordionButton>
                        <Box textAlign="left" flex="1">
                            Type
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <Stack>
                            <Checkbox
                                isChecked={api.has({ label: "WIN" })}
                                onChange={() => api.toggle({ label: "WIN" })}
                            >
                                Win
                            </Checkbox>
                            <Checkbox
                                isChecked={api.has({ label: "LOSS" })}
                                onChange={() => api.toggle({ label: "LOSS" })}
                            >
                                Loss
                            </Checkbox>
                            <Checkbox
                                isChecked={api.has({ label: "PROMOTION" })}
                                onChange={() => api.toggle({ label: "PROMOTION" })}
                            >
                                Promotion
                            </Checkbox>
                            <Checkbox
                                isChecked={api.has({ label: "DEMOTION" })}
                                onChange={() => api.toggle({ label: "DEMOTION" })}
                            >
                                Demotion
                            </Checkbox>
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            <Checkbox
                // display="flex"
                ml="10px"
                alignItems="center"
                isChecked={!filters.selected}
                onChange={(e) =>
                    setFilters((filters) => ({ ...filters, selected: !e.target.checked }))
                }
            >
                Show all
                <Tooltip
                    label={
                        <Box textAlign="center">You can filter friends in the Friendlist tab</Box>
                    }
                >
                    <InfoIcon ml="10px" />
                </Tooltip>
            </Checkbox>
        </Stack>
    );
};
