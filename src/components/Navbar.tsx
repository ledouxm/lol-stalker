import { Box, Center, Stack, StackProps } from "@chakra-ui/react";
import { NavLink, NavLinkProps, useLocation } from "react-router-dom";

export const navbarHeight = 60;
export const Navbar = (props: StackProps) => {
    return (
        <Stack
            direction="row"
            spacing="20px"
            pl="20px"
            alignItems="center"
            zIndex="10"
            height={`${navbarHeight}px`}
            bgColor="blackAlpha.700"
            {...props}
        >
            <AppLink to="/">Notifications</AppLink>
            <AppLink to="/friendlist">Friendlist</AppLink>
            <AppLink to="/options">Options</AppLink>
        </Stack>
    );
};

export const AppLink = (props: NavLinkProps) => {
    const location = useLocation();
    const isActive = props.to === location.pathname;
    return (
        <Box fontWeight={isActive ? "bold" : "initial"}>
            <NavLink {...props} />
        </Box>
    );
};
