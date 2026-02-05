import { ApprovalMaster, DATAPayload, ExtensionPostSap, MaterialMaster } from "../types/ApprovalType";
import appAxiosCon from "./ApplicationConnection";

const ApplicationID = process.env.EXPO_PUBLIC_APP_ID;
const CompanyID = process.env.EXPO_PUBLIC_COMPANY_ID;
const DocType = process.env.EXPO_PUBLIC_DOC_TYPE;

// Approval1 API fetch Data

export const PlantData = {
  GetAll: async () => {
    try {
      const response = await appAxiosCon.get(`/Lookup/GetPlant`);
      return response;
    } catch (error) {
      console.error("Error fetching PlantData:", error);
      throw error;
    }
  },
};

export const Approval1Api = {
  post: async (data: DATAPayload) => {
    try {
      const response = await appAxiosCon.postWithHeaders(
        "/MaterialTransaction/Approval1",
        data,
        {
          'accept': 'text/plain'
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 1 Data:", error);
      throw error;
    }
  },
};

export const Approval2Api = {
  post: async (data: DATAPayload) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Approval2",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      throw error;
    }
  },
};


export const Approval12Api = {
  post: async (data: ApprovalMaster) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Appproval",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approvaled Data:", error);
      throw error;
    }
  },
};

// material extension approval 2 ---------
export const MaterialExtension2SapPostApi = {
  post: async (data: MaterialMaster) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialExtension/ExtensionPostSAP",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Material Extension Data:", error);
      throw error;
    }
  },
};

// material extention approval 1 and 2 reject and approval 1-------
export const MaterialExtensionPostApi = {
  post: async (data : MaterialMaster) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialExtension/ExtensionPost",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Material Extension Data:", error);
      throw error;
    }
  },
};

// material block approval 1-------
export const MaterialBlockUnBlockSapPost = {
  post: async (data : MaterialMaster) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialExtension/BlockUnBlockPostSap",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Material Extension Data:", error);
      throw error;
    }
  },
};


export const Approval1Extension = {
  post: async (data: DATAPayload) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialExtension/MaterialExtensionforApproval1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      throw error;
    }
  },
};

export const Approval2Extension = {
  post: async (data: DATAPayload) => {
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
      throw error;
    }
  },
};

export const ChangeReqApproval1 = {
  post: async (data: DATAPayload) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/GetDataForChangeReqApproval1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      throw error;
    }
  },
};

export const ChangeReqApproval2 = {
  post: async (data: DATAPayload) => {
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
      throw error;
    }
  },
};

export const BlockMaterialApproval1 = {
  post: async (data: DATAPayload) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Block1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      throw error;
    }
  },
};

export const BlockMaterialApproval2 = {
  post: async (data: DATAPayload) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/Block2",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      throw error;
    }
  },
};

export const UnBlock1Api = {
  post: async (data: DATAPayload) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/UnBlock1",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      throw error;
    }
  },
};
export const UnBlock2Api = {
  post: async (data: DATAPayload) => {
    try {
      const response = await appAxiosCon.post(
        "/MaterialTransaction/UnBlock2",
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching Approval 2 Data:", error);
      throw error;
    }
  },
};



// lookup----
export const lookUpApi = {
  getAll : async () => {
    try {
      const response = await appAxiosCon.get("/Lookup");
      return response;
    } catch (error) {
      throw error;
    }
  },
  getStatus : async () => {
    try {
      const response = await appAxiosCon.get(`/Lookup/GetBlockStatus/${DocType}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
