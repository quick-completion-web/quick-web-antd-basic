import React from 'react';
import {BasicLayoutProps, MenuDataItem, Settings as LayoutSettings} from '@ant-design/pro-layout';
import {notification} from 'antd';
import {history, RequestConfig} from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {RequestOptionsInit, ResponseError} from 'umi-request';
import {ApiResponse} from "@/utils/response";
import Cons from "@/Cons";
import IconFont from "@/components/Icon";
import PermissionTreeConverter from "@/pages/system/components/PermissionTree/Converter";
import {Permission} from "@/data";

import {CurrentUser, queryCurrent} from './services/user';
import defaultSettings, {ManifestLayoutSettings} from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  settings?: ManifestLayoutSettings;
  currentUser?: CurrentUser;
  fetchUserInfo: () => Promise<ApiResponse<CurrentUser> | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrent();
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser: currentUser?.data,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: CurrentUser };
}): BasicLayoutProps => {
  return {
    menuDataRender: () => {
      const permissions = initialState.currentUser?.permissions || [] as Permission[];
      const menus = permissions.map(item => ({...item, icon: item.icon ? <IconFont type={item.icon as string} /> : null}));
      return PermissionTreeConverter(menus) as MenuDataItem[];
    },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { currentUser } = initialState;
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }

      if (location.pathname !== '/404'
        && currentUser?.permissions.filter(p => p.menu).filter(p => p.path === location.pathname).length === 0){
        history.push('/404');
      }

    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response,data } = error;

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
    return;
  }

  if (response.status === 401) {
    history.push('/user/login');
    return;
  }

  if (response.status === 404) {
    history.push('/404');
    return;
  }

  if (response && response.status) {
    const errorText = data.message || codeMessage[response.status];
    const { status } = response;

    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });
  }

};

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [(url,options) => {
    const customHeader = {}
    customHeader[Cons.RequestAuthorizationKey] = localStorage.getItem(Cons.RequestAuthorizationKey);
    return {
      url,
      options: {
        ...options,
        headers: {
          ...customHeader,
          ...options.headers
        }
      } as RequestOptionsInit
    };
  }]
};
