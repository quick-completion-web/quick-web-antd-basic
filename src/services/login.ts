import { request } from 'umi';
import {ApiResponse} from "@/utils/response";

export interface LoginParamsType {
  loginName: string;
  password: string;
}

export async function login(params: LoginParamsType) {
  return request<ApiResponse<string>>('/api/admin/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/admin/logout');
}
