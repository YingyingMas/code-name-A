
export default [
    {
        path: '/login',
        component: resolve => require(['../components/login.vue'], resolve),
        beforeEnter:(to,from,next)=>{
          sessionStorage.clear();
          next();
        }
    },
    {
        path: '/',
        component: resolve => require(['../components/site-frame.vue'], resolve),
        children:[]
    }
]
