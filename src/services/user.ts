import { request } from 'umi';
import {ApiResponse} from "@/utils/response";
import {NameEntity, Permission} from "@/data";

export interface CurrentUser extends NameEntity{
  avatar: string;
  attach: object;
  permissions: Permission[];
  superAdmin: boolean;
}

export async function queryCurrent() {
  return request<ApiResponse<CurrentUser>>('/api/admin/current');
}
