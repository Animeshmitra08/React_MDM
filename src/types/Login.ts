export type LoginPayload = {
    ApplicationId: string;
    Username: string;
    Password: string;
    IdentityCode: string;
    IpAddress: string;
    MACAddress: string | null;
}

export type LoginResponse = {
  userID: string;              
  userType: string;
  prefix: string;
  configuration: string;
  username: string;
  name: string;
  profile: string;
  email: string;
  mobile: string;
  accessTag: string;
  accessData: string;
  roleId: string;              
  roleName: string;
  changePassword: boolean;
  permissions: string;
  isUserPermission: boolean;
};