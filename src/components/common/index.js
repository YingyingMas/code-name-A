const components = [];

const install = (Vue, options) => {
  if (install.installed) return;
  components.map(component => {
    if (!component.name) console.error('必须指定组件name', component);
    Vue.component(component.name, component);
  })
  install.installed = true;
}

export default {
  version: '1.0.0',
  install
}
