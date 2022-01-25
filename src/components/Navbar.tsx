import { Box, Center, Stack, StackProps } from "@chakra-ui/react";
import { NavLink, NavLinkProps, useLocation } from "react-router-dom";

export const navbarHeight = 60;
export const Navbar = (props: StackProps) => {
    return (
        <Stack
            direction="row"
            spacing="20px"
            pl="20px"
            // justifyContent="center"
            alignItems="center"
            zIndex="10"
            height={`${navbarHeight}px`}
            bgColor="blackAlpha.700"
            mb="10px"
            {...props}
        >
            <AppLink to="/">Notifications</AppLink>
            <AppLink to="/friendlist">Friendlist</AppLink>
        </Stack>
    );
};

const AppLink = (props: NavLinkProps) => {
    const location = useLocation();
    const isActive = props.to === location.pathname;
    return (
        <Box fontWeight={isActive ? "bold" : "initial"}>
            <NavLink {...props} />
        </Box>
    );
};
