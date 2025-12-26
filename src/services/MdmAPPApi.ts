import appAxiosCon from "./ApplicationConnection";

const ApplicationID = process.env.EXPO_PUBLIC_APP_ID;
const CompanyID = process.env.EXPO_PUBLIC_COMPANY_ID;

// Approval1 API fetch Data

export const PlantData = {
  GetAll: async () => {
    try {
      const response = await appAxiosCon.get(`/Lookup/GetPlant`);
      return response;
    } catch (error) {
      console.error("Error fetching PlantData:", error);
      //   throw error;
    }
  },
};

export const Approval1Api = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Approval1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 1 Data:", error);
      //   throw error;
    }
  },
};

export const Approval12Api = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Appproval",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approvaled Data:", error);
      //   throw error;
    }
  },
};
