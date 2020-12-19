import {request} from "umi";
import {Admin, PageParams} from "@/data";
import {ApiResponse, PageResponse} from "@/utils/response";
import {CurrentUser} from "@/services/user";

export async function getEntry(adminId: string){
  return request<ApiResponse<CurrentUser>>(`/api/admin/entry/${adminId}`);
}

export async function query(page: PageParams, params: object) {
  return request<ApiResponse<PageResponse<Admin>>>('/api/admin',{
    method: 'GET',
    params: {...page, ...params}
  })
}

export async function saveAdminEntry(admin: Admin) {
  return request(admin.id ? '/api/admin/save' : '/api/admin/init',{
    method: 'POST',
    data: admin
  })
}

export async function deleteById(adminId: string){
  return request(`/api/admin/${adminId}`,{
    method: 'DELETE'
  })
}

export async function changePassword(pwd: {password: string, adminId: string}){
  return request('/api/admin/password/set',{
    method: 'post',
    params: pwd
  })
}
