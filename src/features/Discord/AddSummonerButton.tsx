import { Center, chakra, Modal, useDisclosure } from "@chakra-ui/react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { DiscordGuild } from "../../components/LCUConnector";
import { AddSummonerModal, useRemoveSummonersMutation } from "./AddSummonerModal";

export const AddSummonerButton = ({
    guildId,
    channelId,
    summoners,
    guildName,
    isRestricted,
}: DiscordGuild) => {
    const disclosure = useDisclosure();
    const removeSummonersMutation = useRemoveSummonersMutation();
    return (
        <>
            <Center>
                <Center cursor="pointer" onClick={() => disclosure.onOpen()} userSelect="none">
                    <BiPlusCircle size="30px" />
                    <chakra.span ml="10px">Add summoner</chakra.span>
                </Center>
                {summoners?.length !== 0 && (
                    <Center
                        ml="20px"
                        cursor="pointer"
                        onClick={() => {
                            removeSummonersMutation.mutate({
                                channelId: channelId,
                                guildId: guildId,
                                summoners: summoners.map((summoner) => summoner.id),
                            });
                        }}
                        userSelect="none"
                    >
                        <BiMinusCircle size="30px" />
                        <chakra.span ml="10px">Remove all</chakra.span>
                    </Center>
                )}
            </Center>
            <Modal {...disclosure}>
                <AddSummonerModal
                    {...disclosure}
                    summoners={summoners}
                    guildName={guildName}
                    guildId={guildId}
                    channelId={channelId}
                    isRestricted={isRestricted}
                />
            </Modal>
        </>
    );
};
