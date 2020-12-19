import {Permission} from "@/data";
import {request} from "umi";
import {ApiResponse} from "@/utils/response";

export async function createOrUpdateMenu(menu: Permission){
  return request('/api/permission',{
    method: 'POST',
    data: menu
  })
}

export async function search(){
  return request<ApiResponse<Permission[]>>('/api/admin/current/permissions')
}

export async function deleteById(id: string) {
  return request(`/api/permission/${id}`,{method: 'DELETE'});
}


export async function orderById(params: {currentId: string, targetId: string}){
  return request('/api/permission/menu/order',{
    method: 'POST',
    data: params
  })
}
