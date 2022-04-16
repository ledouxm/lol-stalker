export const getBgColor = (initial: string[], selection: string[], puuid: string) => {
    if (initial.includes(puuid) && selection.includes(puuid)) return "red.400";
    if (!initial.includes(puuid) && !selection.includes(puuid)) return "initial";
    if (initial.includes(puuid) && !selection.includes(puuid)) return "blue.400";
    if (!initial.includes(puuid) && selection.includes(puuid)) return "green.400";
};
