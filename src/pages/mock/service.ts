import {request} from "umi";
import {ApiResponse} from "@/utils/response";
import {Mock} from "@/pages/mock/data";

export async function fetchAll(){
  return request<ApiResponse<Mock[]>>('/api/mock/all')
}

export async function add(mock: Mock){
  return request('/api/mock',{
    method: 'POST',
    data: mock
  })
}

export async function deleteById(id: string) {
  return request(`/api/mock/${id}`,{method: 'DELETE'})
}
