export interface AuthUser {
  id: number;
  loginName: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationUUID: string;
  imagePath: string;
  role: string;
}
