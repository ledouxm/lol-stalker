import { getAllApexLeague } from "../features/lcu/lcu";
import { sendWs } from "../features/ws/discord";

export const startUpdateApex = async () => {
    try {
        const apex = await getAllApexLeague();

        sendWs("apex", apex);

        console.log("sent apex to ws backed");
        setTimeout(() => startUpdateApex(), 1000 * 60);
    } catch (e) {
        console.log("couldn't find apex, retrying in 5s");
        setTimeout(() => startUpdateApex(), 5000);
    }
};
