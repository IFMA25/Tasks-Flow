import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    role?: 'admin' | 'user' | string
    permission?: string
    showHeader?: boolean
    showInMenu?: boolean
    titleHeader?: string | ((route: RouteLocationNormalized) => string)
    parent?: {
      textKey: string
      to: string
    }
    titleMenu?: string
    iconMenu?: string;
  }
}
