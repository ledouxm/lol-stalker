import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friend } from "./Friend";

@Entity("Notification")
export class Notification {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("text", { name: "type", default: () => "''" })
    type: string;

    @Column("text", { name: "from" })
    from: string;

    @Column("text", { name: "to" })
    to: string;

    @Column("text", { name: "content" })
    content: string;

    @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column("boolean", { name: "isNew", default: () => "true" })
    isNew: boolean;

    @ManyToOne(() => Friend, (friend) => friend.notifications, {
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "puuid", referencedColumnName: "puuid" }])
    friend: Friend;
}
