import {PageResponse} from "@/utils/response";
import {PageParams} from "@/data";

export interface PageState<T> {
  loading?: boolean;
  editing?: boolean;
  current?: T;
  list?: T[];
  page?: PageParams;
  dataSource?: PageResponse<T>;
}

export interface PageProps<ID> {
  match: {
    params: {
      id?: ID
    }
  }
}
