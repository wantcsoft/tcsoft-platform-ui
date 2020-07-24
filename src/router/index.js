import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // 登录界面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/develop',
    component: () => import('@/views/login/develop'),
    hidden: true
  },
  //首页
  {
    path: '/',
    component: Layout,
    children: [{
      path: '',
      name: 'index',
      component: () => import('@/views/index/index'),
      meta: {
        title: '首页',
      }
    }]
  },
  // 用户管理
  {
    path: '/',
    component: Layout,
    children: [{
      path: 'manage',
      name: 'manage',
      component: () => import('@/views/manage/users'),
      meta: {
        title: '用户管理',
        icon: 'usermanage'
      }
    }]
  },
  // 服务管理
  // {
  //   path: '/service01',
  //   component: Layout,
  //   redirect: '/service01/upload',
  //   meta: {
  //     title: 'xx服务',
  //     icon: 'plane'
  //   },
  //   children: [{
  //       path: 'check-template',
  //       name: 'check-template',
  //       component: () => import('@/views/service01/check-template'),
  //       meta: {
  //         title: '功能1',
  //       }
  //     },
  //     {
  //       path: 'logo',
  //       name: 'logo',
  //       component: () => import('@/views/service01/check-logo'),
  //       meta: {
  //         title: '功能2',
  //       }
  //     },
  //     {
  //       path: 'generate',
  //       name: 'generate',
  //       component: () => import('@/views/service01/generate'),
  //       meta: {
  //         title: '功能3',
  //       }
  //     },
  //     {
  //       path: 'check',
  //       name: 'check',
  //       component: () => import('@/views/service01/check'),
  //       meta: {
  //         title: '功能4',
  //       }
  //     },
  //   ]
  // },
  // 服务管理
  {
    path: '/laboratory',
    component: Layout,
    redirect: '/laboratory',
    meta: {
      title: '实验室',
      icon: 'laboratory'
    },
    children: [{
      path: 'message',
      name: 'message',
      component: () => import('@/views/laboratory/message'),
      meta: {
        title: '信息管理',
        icon: 'message',
      }
    },
      {
        path: 'middleware',
        name: 'middleware',
        component: () => import('@/views/laboratory/middleware'),
        meta: {
          title: '中间件',
          icon: 'middle',
        }
      },
    ]
  },
  // 404界面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 401未授权界面
  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  },
  //测试页面
  // {
  //   path: '/',
  //   component: Layout,
  //   children: [{
  //     path: 'test',
  //     name: 'test',
  //     component: () => import('@/views/test/test'),
  //     meta: {
  //       title: '测试',
  //     }
  //   }]
  // },

  // 404 页面一定要放在最后 !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
