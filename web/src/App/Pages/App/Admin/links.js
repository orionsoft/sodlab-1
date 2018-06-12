import DynamicComponent from 'App/components/DynamicComponent'

export default [
  {
    title: 'Usuarios',
    path: '/admin/users',
    image:
      'https://images.unsplash.com/photo-1485331129317-1717811a2b75?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1b713c86ebb20befc80029db6bc98dae&auto=format&fit=crop&w=3007&q=80',
    component: DynamicComponent(() => import('./Users'))
  },
  {
    title: 'Ambientes',
    path: '/admin/environments',
    image:
      'https://images.unsplash.com/photo-1518081461904-9d8f136351c2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8a815e999d0f593c8c8bbcb6473b0d39&auto=format&fit=crop&w=1677&q=80',
    component: DynamicComponent(() => import('./Environments'))
  }
]
