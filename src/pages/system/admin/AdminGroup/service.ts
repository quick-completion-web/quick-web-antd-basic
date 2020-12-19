import {request} from "umi";
import {ApiResponse} from "@/utils/response";
import {Group} from "@/data";

export async function groups(){
  return request<ApiResponse<Group[]>>('/api/admin/current/groups')
}

export async function getGroupById(adminId: string){
  return request<ApiResponse<Group[]>>(`/api/group/admin/${adminId}`);
}

export async function setGroups(adminId: string, groupIds: string[]) {
  return request(`/api/group/admin/${adminId}`,{
    method: 'post',
    data: groupIds
  })
}
