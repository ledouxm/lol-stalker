import { atomWithStorage } from "jotai/utils";
import { NotificationDto } from "../../types";
import { electronRequest } from "../../utils";

export const getNotifications = ({
    pageParam,
    ...filters
}: { pageParam?: number } & NotificationFilters) =>
    electronRequest<{ content: NotificationDto[] } & { nextCursor: number }>("notifications/all", {
        cursor: pageParam,
        ...filters,
    });
export const getNbNewNotifications = ({
    currentMaxId,
    ...filters
}: { currentMaxId: number } & NotificationFilters) =>
    electronRequest("notifications/nb-new", { currentMaxId, ...filters });
export interface NotificationFilters {
    selected?: boolean;
    types?: string[];
}
export const filtersAtom = atomWithStorage<NotificationFilters>("lol-stalker/filters", {
    types: [],
    selected: false,
});
