import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Center, Stack, StackProps } from "@chakra-ui/react";
import { NavLink, NavLinkProps, useLocation, useParams } from "react-router-dom";
export const navbarHeight = 60;

const regex = /\/friend\/[a-z0-9-]*/g;
const testRegex = (str: string) => {
    const match = str.match(regex);
    return match && str === match[0];
};
export const Navbar = (props: StackProps) => {
    const location = useLocation();
    const hasSubMenu = testRegex(location.pathname);

    const puuid = hasSubMenu && location.pathname.replace("/friend/", "");

    return (
        <>
            <Stack
                direction="row"
                spacing="20px"
                pl="20px"
                alignItems="center"
                zIndex="10"
                height={`${navbarHeight}px`}
                bgColor="blackAlpha.700"
                userSelect="none"
                {...props}
            >
                <AppLink to="/">Notifications</AppLink>
                <AppLink to="/friendlist">Friendlist</AppLink>
                <AppLink to="/options">Options</AppLink>
                {hasSubMenu && (
                    <Center>
                        <Box fontSize="sm">
                            friend
                            <ChevronRightIcon />
                            {puuid}
                        </Box>
                    </Center>
                )}
            </Stack>
        </>
    );
};

export const AppLink = (props: NavLinkProps) => {
    const location = useLocation();
    const isActive = props.to === location.pathname;
    return (
        <Box
            fontWeight={isActive ? "bold" : "initial"}
            color={isActive ? "white" : "whiteAlpha.600"}
        >
            <NavLink {...props} />
        </Box>
    );
};
