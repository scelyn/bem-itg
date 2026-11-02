import { Request } from 'express';

export type RoleId = 'super_admin' | 'admin' | 'editor';

export interface AuthUserPayload {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roleId: RoleId;
  permissions?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

