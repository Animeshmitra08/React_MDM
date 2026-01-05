import axiosCon from "./AxiosConnection";

const ApplicationID = process.env.EXPO_PUBLIC_APP_ID;

// Dashboard API
export const dashboardAPI = {
  getAll: async () => {
    try {
      const response = await axiosCon.getWithHeaders("/Dashboard", {
        appid: ApplicationID ?? "",
      });
      return response;
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await axiosCon.getJSON(`/dashboards/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching dashboard by id:", error);
      throw error;
    }
  },

  create: async (dashboard: any) => {
    try {
      const response = await axiosCon.post("/dashboards", dashboard);
      return response;
    } catch (error) {
      console.error("Error creating dashboard:", error);
      throw error;
    }
  },

  update: async (id: string, dashboard: any) => {
    try {
      const response = await axiosCon.post(`/dashboards/${id}`, dashboard);
      return response;
    } catch (error) {
      console.error("Error updating dashboard:", error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await axiosCon.post(`/dashboards/delete/${id}`, {});
      return response;
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      throw error;
    }
  },
};

// Login Api------
export const LoginApi = {
  post: async (data: any) => {
    try {
      const response = await axiosCon.postWithHeaders("/Login", data, {
        appid: ApplicationID ?? "",
        'Content-Type': 'application/json-patch+json'
      });
      return response;
    } catch (error) {
      console.error("Error fetching Login:", error);
      throw error;
    }
  },
};

// Navigation Api
export const NavigationApi = {
  getAll: async () => {
    try {
      const res = await axiosCon.getWithHeaders("/Navigation", {
        appid: ApplicationID ?? "",
      });
      return res;
    } catch (error) {
      console.error("Error fetching Navigation", error);
      throw error;
    }
  },
  getMobileAll: async () => {
    try {
      const res = await axiosCon.getWithHeaders("/Navigation/mob", {
        appid: ApplicationID ?? "",
      });
      return res;
    } catch (error) {
      console.error("Error fetching Navigation", error);
      throw error;
    }
  },
};

//Navigation config for role based
export const NavigationConfig = {
  getAll: async (roleId: string) => {
    try {
      const res = await axiosCon.getWithHeaders(`/NavigationConfig/${roleId}`, {
        appid: ApplicationID ?? "",
      });
      return res;
    } catch (error) {
      console.log("Error fetching Navigation Config", error);
      throw error;
    }
  },
};
