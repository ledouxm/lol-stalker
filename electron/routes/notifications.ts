import { prisma } from "../db";
import { Prisma } from "../prismaClient";

export const addNotification = (data: Prisma.NotificationUncheckedCreateInput) =>
    prisma.notification.create({ data });
export interface PaginationOptions {
    nbPerPage?: number;
    page?: number;
}
export const getNotifications = async ({
    where = {},
    nbPerPage = 20,
    page = 0,
}: { where?: any } & PaginationOptions = {}) => {
    const content = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        include: { friend: { select: { name: true, icon: true } } },
        take: nbPerPage,
        skip: page * nbPerPage,
        where,
    });
    const count = await prisma.notification.count({ where });

    return { count, content, nbPerPage, page, nbPages: Math.floor(count / nbPerPage) };
};
export const getNewNotifications = (options?: PaginationOptions) =>
    getNotifications({ where: { isNew: { equals: true } }, ...options });
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
