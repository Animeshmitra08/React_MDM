import appAxiosCon from "./ApplicationConnection";

const ApplicationID = process.env.EXPO_PUBLIC_APP_ID;
const CompanyID = process.env.EXPO_PUBLIC_COMPANY_ID;

export const MaterialTransApi ={
    getAll : async () => {
        try {
            const res = await appAxiosCon.get("/MaterialTransaction");
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}