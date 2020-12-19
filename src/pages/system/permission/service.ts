import {Permission} from "@/data";
import {request} from "umi";
import {ApiResponse} from "@/utils/response";

export async function createOrUpdatePermission(permission: Permission){
  return request('/api/permission',{
    method: 'post',
    data: permission
  })
}

export async function search(){
  return request<ApiResponse<Permission[]>>('/api/admin/current/permissions')
}

export async function deleteById(id: string) {
  return request(`/api/permission/${id}`,{method: 'delete'});
}

