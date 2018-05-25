import App from '../App'

export default [{
  path: '/',
  component: App,
  children: [{
    path: '',
    component: r => require.ensure([], () => r(require('../page/survey/home')), 'list')
  }, {
    path: 'survey/:id',
    component: r => require.ensure([], () => r(require('../page/survey')), 'survey')
  }, {
    path: '/success',
    component: r => require.ensure([], () => r(require('../page/survey/success')), 'success')
  }, {
    path: '/admin',
    component: r => require.ensure([], () => r(require('../page/admin')), 'list')
  }, {
    path: '/admin/add',
    component: r => require.ensure([], () => r(require('../page/admin/add')), 'add')
  }, {
    path: '/admin/edit/:id',
    component: r => require.ensure([], () => r(require('../page/admin/add')), 'add')
  }
  ]
}]
