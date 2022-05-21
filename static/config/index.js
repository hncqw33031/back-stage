/**
 * 环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://localhost:38080';

  window.SITE_CONFIG['ssoEnable'] = false;
  // cas-tomcat地址
  window.SITE_CONFIG['ssoCasUrl'] = 'https://localhost:48443/cas';
  // cas-管理平台地址
  window.SITE_CONFIG['ssoMenuUrl'] = 'https://localhost:38443';
  // 应用自身地址
  window.SITE_CONFIG['ssoAppUrl'] = 'http://localhost:3000';
  // 应用在CAS管理平台的名称
  window.SITE_CONFIG['ssoAppName'] = 'test';

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
