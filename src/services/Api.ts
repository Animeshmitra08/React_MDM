import axiosCon from "./AxiosConnection";

const ApplicationID = process.env.EXPO_PUBLIC_APP_ID || 'https://aonapps.in:7080/amsdevapi/api';

// Navigation API
export const navigationAPI = {
  getAll: async () => {
    try {
      const response = await axiosCon.postWithHeaders('/Navigation', {},{
        appid: ApplicationID
      });
      return response;
    } catch (error) {
      console.error('Error fetching navigations:', error);
      throw error;
    }
  },

  create: async (navigation: {
    ApplicationID: string;
    ParentId: string | null;
    DashboardId: string | null;
    DisplayName: string | null;
    DashboardName: string | null;
    Icon: string | null;
    IconClass: string | null;
    Svg: string | null;
    Path: string | null;
    Order: number | null;
    Level: number | null;
    IsMobile: boolean;
    Grant: string | null;
    Type: string | null;
    Value: string | null;
    Name: string;
  }) => {
    try {
      const response = await axiosCon.post('/Navigation', navigation);
      return response;
    } catch (error) {
      console.error('Error creating navigation:', error);
      throw error;
    }
  },

  update: async (id: string, navigation: Partial<{
    ApplicationID: string;
    ParentId: string | null;
    DashboardId: string | null;
    DisplayName: string | null;
    DashboardName: string | null;
    Icon: string | null;
    IconClass: string | null;
    Svg: string | null;
    Path: string | null;
    Order: number | null;
    Level: number | null;
    IsMobile: boolean;
    Grant: string | null;
    Type: string | null;
    Value: string | null;
    Name: string;
  }>) => {
    try {
      const response = await axiosCon.post(`/Navigation/${id}`, navigation);
      return response;
    } catch (error) {
      console.error('Error updating navigation:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await axiosCon.post(`/Navigation/delete/${id}`, {});
      return response;
    } catch (error) {
      console.error('Error deleting navigation:', error);
      throw error;
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getAll: async () => {
    try {
      const response = await axiosCon.postWithHeaders('/Dashboard', {},{
        appid: ApplicationID
      });
      return response;
    } catch (error) {
      console.error('Error fetching navigations:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await axiosCon.getJSON(`/dashboards/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching dashboard by id:', error);
      throw error;
    }
  },

  create: async (dashboard: any) => {
    try {
      const response = await axiosCon.post('/dashboards', dashboard);
      return response;
    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw error;
    }
  },

  update: async (id: string, dashboard: any) => {
    try {
      const response = await axiosCon.post(`/dashboards/${id}`, dashboard);
      return response;
    } catch (error) {
      console.error('Error updating dashboard:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await axiosCon.post(`/dashboards/delete/${id}`, {});
      return response;
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      throw error;
    }
  },
};