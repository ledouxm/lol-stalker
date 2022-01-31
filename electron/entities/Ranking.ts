import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friend } from "./Friend";

@Entity("Ranking")
export class Ranking {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("text", { name: "division" })
    division: string;

    @Column("text", { name: "tier" })
    tier: string;

    @Column("integer", { name: "leaguePoints" })
    leaguePoints: number;

    @Column("integer", { name: "wins" })
    wins: number;

    @Column("integer", { name: "losses" })
    losses: number;

    @Column("text", { name: "miniSeriesProgress", default: () => "''" })
    miniSeriesProgress: string;

    @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => Friend, (friend) => friend.rankings, {
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "puuid", referencedColumnName: "puuid" }])
    friend: Friend;
}
