import { Column, Entity, OneToMany } from "typeorm";
import { Ranking } from "./Ranking";
import { FriendName } from "./FriendName";
import { Notification } from "./Notification";

@Entity("Friend")
export class Friend {
    @Column("text", { primary: true, name: "puuid", unique: true })
    puuid: string;

    @Column("text", { name: "id", nullable: true })
    id: string | null;

    @Column("text", { name: "gameName" })
    gameName: string;

    @Column("text", { name: "gameTag", nullable: true })
    gameTag: string | null;

    @Column("integer", { name: "groupId", default: () => "0" })
    groupId: number;

    @Column("text", { name: "groupName", default: () => "'NONE'" })
    groupName: string;

    @Column("text", { name: "name" })
    name: string;

    @Column("integer", { name: "summonerId" })
    summonerId: number;

    @Column("integer", { name: "icon" })
    icon: number;

    @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column("boolean", { name: "isCurrentSummoner", default: () => "false" })
    isCurrentSummoner: boolean;

    @OneToMany(() => Ranking, (ranking) => ranking.friend)
    rankings: Ranking[];

    @OneToMany(() => FriendName, (friendName) => friendName.friend)
    friendNames: FriendName[];

    @OneToMany(() => Notification, (notification) => notification.friend)
    notifications: Notification[];
}
