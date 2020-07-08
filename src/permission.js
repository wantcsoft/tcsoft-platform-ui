/* eslint-disable prefer-const */
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 设置白名单页面

router.beforeEach(async(to, from, next) => {
  // 进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确认哪些人可以进入
  const hasLogin = localStorage.getItem('hasLogin')
  if (hasLogin) {
    if (to.path === '/login') {
      // 从登录页面跳转到主页面
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
    if (to.path === '/user/user') {
      let id = JSON.parse(localStorage.getItem('userInfo')).id
      console.log(id)
      if (id > 2) {
        next({ path: '/task' })
        window.alert('permission denied')
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
