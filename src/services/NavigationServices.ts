// import { NavItem } from "@/Models/navigationTypes";

export type NavItem = {
  ID: string;
  ApplicationID: string;
  ParentId: string;
  DashboardId: string;
  DocumentNo: string;
  DisplayName: string;
  DashboardName: string;
  Icon: string;
  IconClass: string;
  Svg: string;
  Path: string;
  Order: number;
  Level: number;
  IsMobile: boolean;
  Grant: boolean;
  By: string;
  LogOn: string;
  Del: number;
  Type: string;
  Value: string;
  Name: string;
};

export function buildNavigation(items: NavItem[]) {
  return items
    .filter((item) => item.IsMobile && item.Grant)
    .sort((a, b) => a.Order - b.Order)
    .map((item) => ({
      key: item.ID,
      title: item.DisplayName || item.Name,
      path: item.Path || "/",
      icon: item.Icon || "home",
      dashboardName: item.DashboardName,   // 👈 add this
      dashboardId: item.DashboardId,       // 👈 add this
      rawItem: item,                       // 👈 optional: keep full NavItem
    }));
}