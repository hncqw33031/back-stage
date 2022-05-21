<template>
  <main :class="ssoEnable ? ($route.meta.isTab ? 'site-content-1 site-content--tabs' : 'site-content-1') : ($route.meta.isTab ? 'site-content site-content--tabs' : 'site-content')">
    <ul class="contextmenu" v-show="contextMenuVisible" :style="{left:left+'px',top:top+'px'}">
      <li @click="contextMenuCloseCurrentHandle">关闭当前标签页</li>
      <li @click="contextMenuCloseOtherHandle">关闭其它标签页</li>
      <li @click="tabsCloseAllHandle">关闭全部标签页</li>
    </ul>
    <!-- 主入口标签页 s -->
    <el-tabs
      v-if="$route.meta.isTab"
      v-model="mainTabsActiveName"
      :closable="true"
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle"
      @contextmenu.prevent.native="openContextMenu($event)"

    >
      <el-dropdown class="site-tabs__tools" :show-timeout="0">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tab-pane
        v-for="item in mainTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <el-card :body-style="siteContentViewHeight">
          <iframe
            v-if="item.type === 'iframe'"
            :src="item.iframeUrl"
            width="100%" height="100%" frameborder="0" scrolling="yes">
          </iframe>
          <keep-alive v-else>
            <router-view v-if="item.name === mainTabsActiveName"/>
          </keep-alive>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-card v-else :body-style="siteContentViewHeight">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </el-card>
  </main>
</template>

<script>
  import {isURL} from '@/utils/validate'

  export default {
    inject: ['refresh'],
    data() {
      return {
        ssoEnable: window.SITE_CONFIG['ssoEnable'],
        contextMenuVisible: false,
        left: 0,
        top: 0,
        contextMenuActiveName: ''
      }
    },
    computed: {
      documentClientHeight: {
        get() {
          return this.$store.state.common.documentClientHeight
        }
      },
      menuActiveName: {
        get() {
          return this.$store.state.common.menuActiveName
        },
        set(val) {
          this.$store.commit('common/updateMenuActiveName', val)
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
      mainTabsActiveName: {
        get() {
          return this.$store.state.common.mainTabsActiveName
        },
        set(val) {
          this.$store.commit('common/updateMainTabsActiveName', val)
        }
      },
      siteContentViewHeight() {
        var height = this.documentClientHeight - 50 - 30 - 2
        if (this.$route.meta.isTab) {
          height -= 40
          return isURL(this.$route.meta.iframeUrl) ? {height: height + 'px'} : {minHeight: height + 'px'}
        }
        return {minHeight: height + 'px'}
      }
    },
    watch: {
      contextMenuVisible(value) {
        if (this.contextMenuVisible) {
          document.body.addEventListener("click", this.closeContextMenu);
        } else {
          document.body.removeEventListener("click", this.closeContextMenu);
        }
      }
    },
    methods: {
      // tabs, 选中tab
      selectedTabHandle(tab) {
        tab = this.mainTabs.filter(item => item.name === tab.name)
        if (tab.length >= 1) {
          this.$router.push({name: tab[0].name, query: tab[0].query, params: tab[0].params})
        }
      },
      // tabs, 删除tab
      removeTabHandle(tabName) {
        this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
        if (this.mainTabs.length >= 1) {
          // 当前选中tab被删除
          if (tabName === this.mainTabsActiveName) {
            var tab = this.mainTabs[this.mainTabs.length - 1]
            this.$router.push({name: tab.name, query: tab.query, params: tab.params}, () => {
              this.mainTabsActiveName = this.$route.name
            })
          }
        } else {
          this.menuActiveName = ''
          this.$router.push({name: 'home'})
        }
      },
      // tabs, 关闭当前
      tabsCloseCurrentHandle() {
        this.removeTabHandle(this.mainTabsActiveName)
      },
      // tabs, 关闭其它
      tabsCloseOtherHandle() {
        this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
      },
      // tabs, 关闭全部
      tabsCloseAllHandle() {
        this.mainTabs = []
        this.menuActiveName = ''
        this.$router.push({name: 'home'})
      },
      // contextMenu,右键弹框关闭当前页面
      contextMenuCloseCurrentHandle() {
        this.removeTabHandle(this.contextMenuActiveName)
      },
      // contextMenu,右键弹框关闭其他页面
      contextMenuCloseOtherHandle() {
        this.mainTabs = this.mainTabs.filter(item => item.name === this.contextMenuActiveName);
        this.mainTabsActiveName == this.contextMenuActiveName
        var tab = this.mainTabs[this.mainTabs.length - 1]
        this.$router.push({name: tab.name, query: tab.query, params: tab.params}, () => {
          this.mainTabsActiveName = this.$route.name
        })
      },
      // 关闭右键弹框
      closeContextMenu() {
        this.contextMenuVisible = false
      },
      // 点击右键
      openContextMenu(e) {
        if (e.srcElement.getAttribute("tabIndex") && e.srcElement.id) {
          this.contextMenuVisible = true;
          this.left = e.clientX - 300;
          this.top = e.clientY - 40;
          this.contextMenuActiveName = e.srcElement.id.substr(4);
        }
      },
    },

  }
</script>
<style scoped>
  .contextmenu {
    width: 145px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
  }

  .contextmenu li {
    text-align: center;
    margin: 0;
    padding: 7px 16px;
  }

  .contextmenu li:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
</style>

