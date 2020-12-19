import {request} from "umi";
import {Group, PageParams} from "@/data";
import {ApiResponse, PageResponse} from "@/utils/response";

export async function query(page: PageParams, params: object) {
  return request<ApiResponse<PageResponse<Group>>>('/api/group',{
    method: 'get',
    params: {...page, ...params}
  })
}

export async function saveGroup(admin: Group) {
  return request('/api/group',{
    method: 'post',
    data: admin
  })
}

export async function deleteById(id: string){
  return request(`/api/group/${id}`,{
    method: 'delete'
  })
}
