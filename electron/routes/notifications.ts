import { prisma } from "../db";
import { Prisma } from "../prismaClient";

export const addNotification = (data: Prisma.NotificationUncheckedCreateInput) =>
    prisma.notification.create({ data });
export const getNotifications = ({ where = {} }: { where?: any } = {}) =>
    prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        include: { friend: { select: { name: true, icon: true } } },
        take: 20,
        where,
    });
export const getNewNotifications = () => getNotifications({ where: { isNew: { equals: true } } });
export const getFriendNotifications = (puuid: Prisma.FriendCreateInput["puuid"]) =>
    prisma.notification.findMany({
        where: { puuid },
        orderBy: { createdAt: "desc" },
        include: { friend: { select: { name: true, icon: true } } },
    });
export const setNotificationIsNew = () =>
    //@ts-ignore
    console.log("set is new to false") ||
    prisma.notification.updateMany({
        where: { isNew: { equals: true } },
        data: { isNew: { set: false } },
    });

export const notificationsApi = {
    addNotification,
    getNotifications,
    getNewNotifications,
    getFriendNotifications,
    setNotificationIsNew,
};
