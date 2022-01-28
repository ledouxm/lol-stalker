import { last } from "@pastable/core";
import { prisma } from "../db";
import { Prisma } from "../prismaClient";

export const addNotification = (data: Prisma.NotificationUncheckedCreateInput) =>
    prisma.notification.create({ data });

export const getFriendNotifications = (puuid: Prisma.FriendCreateInput["puuid"]) =>
    prisma.notification.findMany({
        where: { puuid },
        orderBy: { createdAt: "desc" },
        include: { friend: { select: { name: true, icon: true } } },
    });
export const setNotificationIsNew = (notificationsIds?: number[]) =>
    //@ts-ignore
    console.log("set is new to false") ||
    prisma.notification.updateMany({
        where: {
            isNew: { equals: true },
            ...(notificationsIds && { id: { in: notificationsIds } }),
        },
        data: { isNew: { set: false } },
    });

export const getCursoredNotifications = async ({ cursor }: { cursor?: number }) => {
    const content = await prisma.notification.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { friend: { select: { name: true, icon: true } } },
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
    return { nextCursor: last(content).id, content };
};
export const getNbNewNotifications = ({ maxId }: { maxId: number }) =>
    prisma.notification.count({
        orderBy: { createdAt: "desc" },
        where: { id: { gt: maxId } },
    });

export const notificationsApi = {
    addNotification,
    getFriendNotifications,
    setNotificationIsNew,
};
