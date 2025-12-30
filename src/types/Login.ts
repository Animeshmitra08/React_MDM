export type LoginPayload = {
    applicationId: string;
    username: string;
    password: string;
    identityCode: string;
    ipAddress: string;
    macAddress: string | null;
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