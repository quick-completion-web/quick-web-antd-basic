import React, { useState } from 'react';
import { Link } from 'umi';
import {useModel} from "@@/plugin-model/useModel";
import logo from '@/assets/logo.svg';
import { LoginParamsType, login } from '@/services/login';
import {response} from "@/utils/response";
import Footer from '@/components/Footer';
import Cons from "@/Cons";
import LoginFrom from './components/Login';
import styles from './style.less';

const { Tab, Username, Password, Submit } = LoginFrom;

const Login: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const handleSubmit = (values: LoginParamsType) => {
    response({
      request: login(values),
      onLoadingChange: setSubmitting
    }).then(token => {
      localStorage.setItem(Cons.RequestAuthorizationKey,token);
      window.location.href = (initialState?.settings?.home || '/')
    })
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>Ant Design</span>
            </Link>
          </div>
          <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
        </div>

        <div className={styles.main}>
          <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
            <Tab key="account" tab="账户密码登录">
              <Username
                name="loginName"
                placeholder="登录名称"
                rules={[
                  {
                    required: true,
                    message: '请输入登录名称',
                  },
                ]}
              />
              <Password
                name="password"
                placeholder="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]}
              />
            </Tab>
            <Submit loading={submitting}>登录</Submit>
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
