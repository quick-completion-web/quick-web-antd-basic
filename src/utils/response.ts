import React from "react";
import {notification} from 'antd';

export interface ApiResponse<T> {
  code: number;
  message: string | undefined;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number
}

export interface ResponsesParameter<T> {
  request: Promise<ApiResponse<T>>;
  current?: React.Component,
  onLoadingChange?: (loading: boolean) => void;
  isNotification?: boolean;
  title?: string;
  appendKey?: boolean;
}

export async function response<T>(parameter: ResponsesParameter<T>): Promise<T>{
  const onLoad = (parameter.onLoadingChange || (parameter.current ? loading => parameter.current?.setState({loading}) : undefined )) || (() => {});
  return new Promise(resolve => {
    onLoad(true);
    parameter.request
      .then(resp => {
        if (resp){
          if (parameter.isNotification){
            notification.success({
              message: parameter.title || '请求成功',
              description: resp.message
            })
          }
          const data = resp.data as T;
          if (parameter.appendKey){
            if (data instanceof Array){
              // @ts-ignore
              resolve(data.map(item => {
                // eslint-disable-next-line no-param-reassign
                item.key = item.id;
                return item;
              }) as T);
            }else{
              // @ts-ignore
              data.key = data.id;
              resolve(data as T);
            }
          }else{
            resolve(data as T);
          }
        }
      })
      .finally(() => onLoad(false))
  })
}

