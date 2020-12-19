import React, {useCallback, useState} from 'react';
import { LogoutOutlined, LockOutlined } from '@ant-design/icons';
import {Avatar, Menu, Spin} from 'antd';
import { history, useModel } from 'umi';
import { outLogin } from '@/services/login';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import ChangePasswordModal from "./ChangePasswordModal";

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  // Note: There may be security issues, please note
  history.replace({
    pathname: '/user/login'
  });
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const [passwordModal, setPasswordModal] = useState(false);

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        return;
      }
      if (key === 'password') {
        setPasswordModal(true);
      }
      // history.push(`/account/${key}`);
    },
    [],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="password">
        <LockOutlined />
        修改密码
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <ChangePasswordModal
        show={passwordModal}
        onClose={() => setPasswordModal(false)}
      />
      <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
      </HeaderDropdown>
    </div>
  );
};

export default AvatarDropdown;
