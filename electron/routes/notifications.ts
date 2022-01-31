import { last } from "@pastable/core";
import { getManager, In, LessThan, MoreThan, SelectQueryBuilder } from "typeorm";
import { Friend } from "../entities/Friend";
import { Notification } from "../entities/Notification";
import { selectedFriends } from "../selection";

export const addNotification = (data: Partial<Notification>) =>
    getManager().save(getManager().create(Notification, data));

export const getFriendNotifications = (puuid: Friend["puuid"]) =>
    getManager().find(Notification, {
        where: { friend: puuid },
        order: { createdAt: "DESC" },
        relations: ["friend"],
    });
export const setNotificationIsNew = (notificationsIds?: number[]) => {
    const query = getManager().createQueryBuilder().update(Notification).set({ isNew: false });
    if (notificationsIds) query.where("id IN (:...ids)", { ids: notificationsIds });
    return query.execute();
};
export interface NotificationFilters {
    cursor?: number;
    selected?: boolean;
    types?: string[];
    currentMaxId?: number;
}

const applyFilters = (query: SelectQueryBuilder<Notification>, filters: NotificationFilters) => {
    const whereClauses: any[] = [];
    const payload: Record<string, any> = {};
    if (filters.cursor) {
        whereClauses.push("notification.id < :cursor");
        payload.cursor = filters.cursor;
    }
    if (filters.currentMaxId) {
        whereClauses.push("notification.id > :currentMaxId");
        payload.currentMaxId = filters.currentMaxId;
    }
    if (filters.selected && selectedFriends.current) {
        whereClauses.push("friend.puuid IN (:...puuids)");
        payload.puuids = Array.from(selectedFriends.current?.values());
    }
    if (filters.types?.length) {
        whereClauses.push("notification.type IN (:...types)");
        payload.types = filters.types;
    }

    return query
        .orderBy("notification.createdAt", "DESC")
        .where(whereClauses.join(" AND "), payload);
};

const makeNotificationQuery = (filters: NotificationFilters) =>
    applyFilters(
        getManager()
            .createQueryBuilder(Notification, "notification")
            .leftJoinAndSelect("notification.friend", "friend"),
        filters
    );

export const getCursoredNotifications = async (filters: NotificationFilters) => {
    const query = makeNotificationQuery(filters).take(20);

    const content = await query.getMany();

    return { nextCursor: last(content)?.id, content };
};
export const getNbNewNotifications = async (filters: NotificationFilters) => {
    if (!filters.currentMaxId || !isFinite(filters.currentMaxId)) return null;
    const query = makeNotificationQuery(filters);

    return query.getCount();
};

export const notificationsApi = {
    addNotification,
    getFriendNotifications,
    setNotificationIsNew,
};
