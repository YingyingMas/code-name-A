export default [
  /*公共*/
  {
    path: '/common/comming-soon',
    component: resolve => require(['../components/common/comming-soon.vue'], resolve)
  },
  {
    path: '/one/page-one',
    component: resolve => require(['../components/one/page-one.vue'], resolve)
  },


  /*全不匹配的情况下 进此页面 此路由需要放置最后*/
  {
    path: '/',
    name: 'null',
  },
  {
    path: '*',
    component: resolve => require(['../components/common/comming-soon.vue'], resolve)
  },
];


