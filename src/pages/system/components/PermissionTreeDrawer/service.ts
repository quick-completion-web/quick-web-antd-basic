import {request} from "umi";
import {ApiResponse} from "@/utils/response";
import {Permission} from "@/data";

export async function permissions(){
  return request<ApiResponse<Permission[]>>('/api/admin/current/permissions')
}

export async function grant(url: string,id: string ,permissionIds: string[]){
  return request(url,{
    method: 'post',
    data: {
      id,
      permissionIds
    }
  })
}

export async function getSelected(url: string,id: string){
  return request<ApiResponse<Permission[]>>(`${url}/${id}`)
}
