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
  // 平台管理登录界面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  //开发者平台登录页面
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
      path: 'index',
      name: 'index',
      component: () => import('@/views/index/index'),
      meta: {
        title: '首页',
        icon: 'index'
      }
    }]
  },
  // 用户管理
  {
    path: '/manage',
    component: Layout,
    meta: {
      title: '人员管理',
      icon: 'userManage'
    },
    children: [{
      path: 'user',
      name: 'user',
      component: () => import('@/views/manage/people'),
      meta: {
        title: '人员信息',
        icon: 'people',
      }
    },{
      path: 'hospital',
      name: 'hospital',
      component: () => import('@/views/manage/hospital'),
      meta: {
        title: '医院信息',
        icon: 'hospital',
      }
    },{
      path: 'role',
      name: 'role',
      component: () => import('@/views/manage/role'),
      meta: {
        title: '角色信息',
        icon: 'role',
      }
    },{
      path: 'authority',
      name: 'authority',
      component: () => import('@/views/manage/authority'),
      meta: {
        title: '权限信息',
        icon: 'authority',
      }
    }]
  },
  // 系统基础配置
  {
    path: '/system',
    component: Layout,
    redirect: 'system',
    meta: {
      title: '系统基础设置',
      icon: 'setting'
    },
    children: [
      {
        path: 'auditState',
        name: 'auditState',
        component: () => import('@/views/setting/auditState'),
        meta: {
          title: 'auditState',
        }
      },
      {
        path: 'comparisonType',
        name: 'comparisonType',
        component: () => import('@/views/setting/comparisonType'),
        meta: {
          title: 'comparisonType',
        }
      },
      {
        path: 'confirmState',
        name: 'confirmState',
        component: () => import('@/views/setting/confirmState'),
        meta: {
          title: 'confirmState',
        }
      },
      {
        path: 'dataType',
        name: 'dataType',
        component: () => import('@/views/setting/dataType'),
        meta: {
          title: 'dataType',
        }
      },
      {
        path: 'hospitalInfo',
        name: 'hospitalInfo',
        component: () => import('@/views/setting/hospitalInfo'),
        meta: {
          title: 'hospitalInfo',
        }
      },
      {
        path: 'instrumentAlternateType',
        name: 'instrumentAlternateType',
        component: () => import('@/views/setting/instrumentAlternateType'),
        meta: {
          title: 'instrumentAlternateType',
        }
      },
      {
        path: 'lineType',
        name: 'lineType',
        component: () => import('@/views/setting/lineType'),
        meta: {
          title: 'lineType',
        }
      },
      {
        path: 'resultType',
        name: 'resultType',
        component: () => import('@/views/setting/resultType'),
        meta: {
          title: 'resultType',
        }
      },
      {
        path: 'ruleFunction',
        name: 'ruleFunction',
        component: () => import('@/views/setting/ruleFunction'),
        meta: {
          title: 'ruleFunction',
        }
      },
      {
        path: 'ruleParam',
        name: 'ruleParam',
        component: () => import('@/views/setting/ruleParam'),
        meta: {
          title: 'ruleParam',
        }
      },
      {
        path: 'ruleType',
        name: 'ruleType',
        component: () => import('@/views/setting/ruleType'),
        meta: {
          title: 'ruleType',
        }
      },
      {
        path: 'sampleEvent',
        name: 'sampleEvent',
        component: () => import('@/views/setting/sampleEvent'),
        meta: {
          title: 'sampleEvent',
        }
      },
      {
        path: 'sampleState',
        name: 'sampleState',
        component: () => import('@/views/setting/sampleState'),
        meta: {
          title: 'sampleState',
        }
      },
      {
        path: 'sampleStatus',
        name: 'sampleStatus',
        component: () => import('@/views/setting/sampleStatus'),
        meta: {
          title: 'sampleStatus',
        }
      },
      {
        path: 'sexType',
        name: 'sexType',
        component: () => import('@/views/setting/sexType'),
        meta: {
          title: 'sexType',
        }
      },
    ]
  },
  // 医院相关基础配置
  {
    path: '/hospital',
    component: Layout,
    redirect: 'hospital',
    meta: {
      title: '医院基础设置',
      icon: 'hospitalSetting'
    },
    children: [
      {
        path: 'actionCode',
        name: 'actionCode',
        component: () => import('@/views/setting/actionCode'),
        meta: {
          title: 'actionCode',
        }
      },
      {
        path: 'ageType',
        name: 'ageType',
        component: () => import('@/views/setting/ageType'),
        meta: {
          title: 'ageType',
        }
      },
      {
        path: 'chemistryContrast',
        name: 'chemistryContrast',
        component: () => import('@/views/setting/chemistryContrast'),
        meta: {
          title: 'chemistryContrast',
        }
      },
      {
        path: 'comparisonInfo',
        name: 'comparisonInfo',
        component: () => import('@/views/setting/comparisonInfo'),
        meta: {
          title: 'comparisonInfo',
        }
      },
      {
        path: 'instrument',
        name: 'instrument',
        component: () => import('@/views/setting/instrument'),
        meta: {
          title: 'instrument',
        }
      },
      {
        path: 'instrumentGroup',
        name: 'instrumentGroup',
        component: () => import('@/views/setting/instrumentGroup'),
        meta: {
          title: 'instrumentGroup',
        }
      },
      {
        path: 'instrumentType',
        name: 'instrumentType',
        component: () => import('@/views/setting/instrumentType'),
        meta: {
          title: 'instrumentType',
        }
      },
      {
        path: 'lotSet',
        name: 'lotSet',
        component: () => import('@/views/setting/lotSet'),
        meta: {
          title: 'lotSet',
        }
      },
      {
        path: 'material',
        name: 'material',
        component: () => import('@/views/setting/material'),
        meta: {
          title: 'material',
        }
      },
      {
        path: 'patientType',
        name: 'patientType',
        component: () => import('@/views/setting/patientType'),
        meta: {
          title: 'patientType',
        }
      },
      {
        path: 'prepLinkAbortCode',
        name: 'prepLinkAbortCode',
        component: () => import('@/views/setting/prepLinkAbortCode'),
        meta: {
          title: 'prepLinkAbortCode',
        }
      },
      {
        path: 'prepLinkErrorCode',
        name: 'prepLinkErrorCode',
        component: () => import('@/views/setting/prepLinkErrorCode'),
        meta: {
          title: 'prepLinkErrorCode',
        }
      },
      {
        path: 'resultRange',
        name: 'resultRange',
        component: () => import('@/views/setting/resultRange'),
        meta: {
          title: 'resultRange',
        }
      },
      {
        path: 'resultUnit',
        name: 'resultUnit',
        component: () => import('@/views/setting/resultUnit'),
        meta: {
          title: 'resultUnit',
        }
      },
      {
        path: 'rule',
        name: 'rule',
        component: () => import('@/views/setting/rule'),
        meta: {
          title: 'rule',
        }
      },
      {
        path: 'ruleGroup',
        name: 'ruleGroup',
        component: () => import('@/views/setting/ruleGroup'),
        meta: {
          title: 'ruleGroup',
        }
      },
      {
        path: 'sampleType',
        name: 'sampleType',
        component: () => import('@/views/setting/sampleType'),
        meta: {
          title: 'sampleType',
        }
      },
      {
        path: 'testItemDeltaCheck',
        name: 'testItemDeltaCheck',
        component: () => import('@/views/setting/testItemDeltaCheck'),
        meta: {
          title: 'testItemDeltaCheck',
        }
      },
      {
        path: 'testItemGroup',
        name: 'testItemGroup',
        component: () => import('@/views/setting/testItemGroup'),
        meta: {
          title: 'testItemGroup',
        }
      },
      {
        path: 'testItemGroupItem',
        name: 'testItemGroupItem',
        component: () => import('@/views/setting/testItemGroupItem'),
        meta: {
          title: 'testItemGroupItem',
        }
      },
      {
        path: 'testItemInfo',
        name: 'testItemInfo',
        component: () => import('@/views/setting/testItemInfo'),
        meta: {
          title: 'testItemInfo',
        }
      },
      {
        path: 'testItemType',
        name: 'testItemType',
        component: () => import('@/views/setting/testItemType'),
        meta: {
          title: 'testItemType',
        }
      },
      {
        path: 'testType',
        name: 'testType',
        component: () => import('@/views/setting/testType'),
        meta: {
          title: 'testType',
        }
      }
    ]
  },

  // 服务管理
  {
    path: '/service',
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
