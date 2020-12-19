import React from "react";
import {useModel} from "@@/plugin-model/useModel";

export interface AuthorizationProps {
  permissionKey: string;
  children?: JSX.Element[] | JSX.Element;
}

const Authorization = (props: AuthorizationProps) => {
  const initialState = useModel('@@initialState');
  return <i>
    {
      // @ts-ignore
      initialState.initialState?.currentUser?.permissions
        .filter(p => !p.menu)
        .filter(p => p.key === props.permissionKey)
        .length > 0 ? props.children : null
    }
  </i>
}

export default Authorization;
