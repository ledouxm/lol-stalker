import fs from "fs/promises";
import path from "path";

const selectedFriendsFilePath = path.join(__dirname, "selectedFriends.json");
export const selectedFriends: { current: Set<string> | null } = {
    current: null,
};
export const loadSelectedFriends = async () => {
    try {
        const selectedFriendsArr = JSON.parse(await fs.readFile(selectedFriendsFilePath, "utf-8"));
        selectedFriends.current = new Set(selectedFriendsArr);
    } catch (e) {
        console.log("no selected friends file found, creating it...");
        selectedFriends.current = new Set();
        await persistSelectedFriends();
    } finally {
        return selectedFriends.current;
    }
};

export const editSelectedFriends = async (callback: () => void) => {
    callback();
    persistSelectedFriends();
};

export const persistSelectedFriends = () =>
    selectedFriends.current &&
    fs.writeFile(
        selectedFriendsFilePath,
        JSON.stringify(Array.from(selectedFriends.current), null, 4)
    );
