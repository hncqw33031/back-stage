<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">格凡安信管理平台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">格凡</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <span style="display:inline-block ;margin-top: 19px">{{this.$route.path === '/home' ? "主页" : navTitle}}</span>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import {clearLoginInfo} from '@/utils'

  export default {
    data() {
      return {
        ssoEnable: window.SITE_CONFIG['ssoEnable'],
        updatePassowrdVisible: false,
        navTitle: ""
      }
    },
    components: {
      UpdatePassword
    },
    computed: {
      navbarLayoutType: {
        get() {
          return this.$store.state.common.navbarLayoutType
        }
      },
      sidebarFold: {
        get() {
          return this.$store.state.common.sidebarFold
        },
        set(val) {
          this.$store.commit('common/updateSidebarFold', val)
        }
      },
      mainTabs: {
        get() {
          return this.$store.state.common.mainTabs
        },
        set(val) {
          this.$store.commit('common/updateMainTabs', val)
        }
      },
      userName: {
        get() {
          return this.$store.state.user.name
        }
      },
      menuActiveName: {
        get() {
          return this.$store.state.common.menuActiveName
        }
      },
      menuList: {
        get() {
          return this.$store.state.common.menuList
        }
      },
      mainTabsActiveName: {
        get() {
          return this.$store.state.common.mainTabsActiveName
        },
      },
    },
    watch: {
      menuActiveName(val) {
        if (val) {
          this.toNavTitle(val)
        } else {
          this.navTitle = ''
        }
      }
    },
    mounted() {
      this.toNavTitle(this.menuActiveName)
    },
    methods: {
      // 给navTitle赋值
      toNavTitle(val) {
        this.menuList.forEach((item) => {
          if (item.subMenus && item.subMenus.length > 0) {
            item.subMenus.forEach(subMenu => {
              if (subMenu.id === Number(val)) {
                this.navTitle = subMenu.parentName + ' - ' + subMenu.name
              }
            })
          }
        })
      },
      // 修改密码
      updatePasswordHandle() {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle() {
        this.$confirm1(`确定进行[退出]操作?`).then(() => {
          this.$http({
            url: this.$http.adornUrl('/logout'),
            method: 'post'
          }).then(({data}) => {
            clearLoginInfo()
            if (this.ssoEnable) {
              window.location.href = window.SITE_CONFIG['ssoCasUrl'] + '/logout?service=' + window.SITE_CONFIG['ssoAppUrl']
            } else {
              this.$router.push({name: 'login'})
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
