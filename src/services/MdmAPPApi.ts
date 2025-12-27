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

export const Approval2Api = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Approval2",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
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

export const Approval1Extension = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialExtension/MaterialExtensionforApproval1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      //   throw error;
    }
  },
};

export const Approval2Extension = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.postWithHeaders(
        "/MaterialExtension/MaterialExtensionforApproval2",
        data,
        {
          "Content-Type": "application/json",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      //   throw error;
    }
  },
};

export const ChangeReqApproval1 = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/GetDataForChangeReqApproval1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      //   throw error;
    }
  },
};

export const ChangeReqApproval2 = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.postWithHeaders(
        "/MaterialTransaction/GetDataForChangeReqApproval2",
        data,
        {
          "Content-Type": "application/json",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      //   throw error;
    }
  },
};

export const BlockMaterialApproval1 = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Block1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      //   throw error;
    }
  },
};

export const BlockMaterialApproval2 = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Block2",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      //   throw error;
    }
  },
};
export const UnBlock1Api = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/UnBlock1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      //   throw error;
    }
  },
};
export const UnBlock2Api = {
  post: async (data: any) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/UnBlock2",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      //   throw error;
    }
  },
};
