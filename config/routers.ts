
export default [
  {
    path: '/system',
    name: '系统设置',
    icon: 'smile',
    routes: [
      {
        name: '菜单',
        path: '/system/menu',
        component: './system/menu'
      },
      {
        name: '管理员',
        path: '/system/admin',
        component: './system/admin'
      },
      {
        name: '权限',
        path: '/system/permission',
        component: './system/permission'
      },
      {
        name: '管理员组',
        path: '/system/group',
        component: './system/group'
      }
    ]
  },
  {
    path: '/mock',
    name: '数据模拟',
    icon: 'ThunderboltOutlined',
    component: './mock'
  }
]
