import { last } from "@pastable/core";
import { prisma } from "../db";
import { Prisma } from "../prismaClient";
import { selectedFriends } from "../selection";

export const addNotification = (data: Prisma.NotificationUncheckedCreateInput) =>
    prisma.notification.create({ data });

export const getFriendNotifications = (puuid: Prisma.FriendCreateInput["puuid"]) =>
    prisma.notification.findMany({
        where: { puuid },
        orderBy: { createdAt: "desc" },
        include: { friend: { select: { name: true, icon: true } } },
    });
export const setNotificationIsNew = (notificationsIds?: number[]) =>
    prisma.notification.updateMany({
        where: {
            isNew: { equals: true },
            ...(notificationsIds && { id: { in: notificationsIds } }),
        },
        data: { isNew: { set: false } },
    });

export interface NotificationFilters {
    cursor?: number;
    selected?: boolean;
    types?: string[];
}
const makeWhereFromFilters = ({ types, selected }: NotificationFilters) => ({
    puuid: {
        ...(selected &&
            selectedFriends.current && { in: Array.from(selectedFriends.current.values()) }),
    },
    ...(types?.length && { type: { in: types } }),
});
export const getCursoredNotifications = async ({ cursor, ...filters }: NotificationFilters) => {
    const content = await prisma.notification.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { friend: { select: { name: true, icon: true } } },
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        where: makeWhereFromFilters(filters),
    });
    return { nextCursor: last(content)?.id, content };
};
export const getNbNewNotifications = async ({
    currentMaxId,
    ...filters
}: { currentMaxId: number } & NotificationFilters) =>
    prisma.notification.count({
        where: { id: { gt: currentMaxId }, ...makeWhereFromFilters(filters) },
    });

export const notificationsApi = {
    addNotification,
    getFriendNotifications,
    setNotificationIsNew,
};
