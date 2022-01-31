import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friend } from "./Friend";

@Entity("FriendName")
export class FriendName {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("text", { name: "name", default: () => "''" })
    name: string;

    @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => Friend, (friend) => friend.friendNames, {
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "puuid", referencedColumnName: "puuid" }])
    friend: Friend;
}
