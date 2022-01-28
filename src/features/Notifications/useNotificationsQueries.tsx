import { useAtom } from "jotai";
import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { filtersAtom, getNbNewNotifications, getNotifications } from "./notificationsRequests";

export const useNotificationsQueries = () => {
    const [filters, setFilters] = useAtom(filtersAtom);

    const notificationsQuery = useInfiniteQuery(
        ["notifications/all", filters],
        (context) => getNotifications({ ...context, ...filters }),
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchInterval: false,
            refetchOnWindowFocus: false,
        }
    );

    const currentMaxId =
        notificationsQuery.data?.pages.length &&
        Math.max(
            ...notificationsQuery.data?.pages.map((page) =>
                Math.max(...page.content.map((notif) => notif.id))
            )
        );

    const newNotificationsQuery = useQuery(
        ["notifications/nb-new", currentMaxId, filters],
        () => getNbNewNotifications({ currentMaxId: currentMaxId!, ...filters }),
        {
            enabled: !!currentMaxId,
            refetchInterval: false,
            refetchOnWindowFocus: false,
        }
    );

    return {
        notificationsQuery,
        newNotificationsQuery,
        nbNewNotifications: newNotificationsQuery.data,
    };
};
