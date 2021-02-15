import Vue from 'vue';
import Router from 'vue-router';
import Index from 'pages/Index.vue';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/cadastro/:id',
        component: () => import('../pages/Pessoa.vue')
      },
      {
        path: '/cadastro/:id/enderecos',
        component: () => import('../components/pessoa/EnderecosTable.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
