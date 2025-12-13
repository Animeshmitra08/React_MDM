export type Navigation = {
  id: string;               
  applicationID: string;    
  parentId: string; 
  dashboardId: string;      
  page: string;
  displayName: string;
  dashboardName: string;
  icon: string;
  iconClass: string;
  svg: string;
  path: string;
  page_order: number;
  level: number;
  isMobile: boolean;
  grant: boolean;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;      
  del: number;               
};

export type NavigationConfigType = {
  id: string;
  applicationID: string;
  navigationID: string;
  roleID: string;
  displayName: string;
  icon: string; // e.g., "fa-solid fa-chart-line"
  isGranted: boolean;
  pageOrder: number;
  createdBy: string;
  createdOn: string; // ISO date string
  modifiedBy: string;
  modifiedOn: string; // ISO date string
  status: number;
}
