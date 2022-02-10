import { Center, chakra, Modal, useDisclosure } from "@chakra-ui/react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { DiscordGuild } from "../../components/LCUConnector";
import { AddSummonerModal } from "./SummonerSelection";

export const AddSummonerButton = ({
    guildId,
    channelId,
    summoners,
    name,
}: {
    name: string;
    guildId: string;
    channelId: string;
    summoners: DiscordGuild["summoners"];
}) => {
    const disclosure = useDisclosure();

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
                            window.Main.sendMessage("discord/remove-friends", {
                                channelId: channelId,
                                guildId: guildId,
                                summoners: summoners.map((summoner) => summoner.puuid),
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
                    guildName={name}
                    guildId={guildId}
                    channelId={channelId}
                />
            </Modal>
        </>
    );
};
