import { Box, Center, Spinner } from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import { useQuery } from "react-query";
import {
    LineChart,
    XAxis,
    YAxis,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { FriendDto } from "../../types";
import {
    electronRequest,
    getTotalLpFromRank,
    LeagueApex,
    makeTierData,
    makeTierLps,
    Tier,
    TierData,
} from "../../utils";
import { formatRank } from "./FriendDetails";

export const FriendRankingGraph = ({ friend }: { friend: FriendDto }) => {
    const tierDataRef = useRef<TierData>(null as any);
    const query = useQuery("config/apex", () => electronRequest<LeagueApex>("config/apex"));
    console.log(friend);
    const data = useMemo(() => {
        if (!query.data) return [];
        tierDataRef.current = makeTierData(query.data);
        return friend?.rankings?.map((rank) => ({
            ...rank,
            totalLp: getTotalLpFromRank(rank, tierDataRef.current),
        }));
    }, [friend.rankings, query.data]);

    const tierLps = useMemo(() => query.data && makeTierLps(query.data), [query.data]);
    if (query.isLoading) {
        return (
            <Center w="100%">
                <Spinner />
            </Center>
        );
    }
    if (!data?.length) {
        return (
            <Center w="100%">
                <Box>No elo data</Box>
            </Center>
        );
    }
    return (
        <ResponsiveContainer>
            <LineChart data={data}>
                <YAxis domain={["dataMin - 250", "dataMax + 250"]} />
                <Tooltip
                    isAnimationActive={false}
                    contentStyle={{ color: "black" }}
                    content={(props) => <GraphTooltip {...props} />}
                />
                {tierLps &&
                    Object.entries(tierLps).map(([key, val]) => (
                        <ReferenceLine
                            key={key}
                            y={val}
                            strokeDasharray="3 3"
                            label={{ position: "top", value: key, fill: tierColors[key] }}
                            stroke={tierColors[key]}
                        />
                    ))}
                <Line dataKey="totalLp" stroke="#0a9396" strokeWidth={5} fill="#0a9396" />
                <XAxis
                    dataKey="createdAt"
                    tickFormatter={(value: Date) => new Date(value).toLocaleDateString()}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
const GraphTooltip = (props: TooltipProps<ValueType, NameType>) => {
    if (props.payload?.[0] != null) {
        return <Box>{formatRank(props.payload[0].payload)}</Box>;
    }
    return null;
};
const tierColors: Record<Tier, string> = {
    IRON: "#0E1720",
    BRONZE: "#5F3F3C",
    SILVER: "#ABB9C8",
    GOLD: "#865B30",
    PLATINUM: "#205B4D",
    DIAMOND: "#736AB6",
    MASTER: "#AF709D",
    GRANDMASTER: "#A32923",
    CHALLENGER: "#070D17",
};
