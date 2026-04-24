import 'vue-router';

type HeaderTitleConfig = (context: {
  route: RouteLocationNormalized;
  userName?: string;
}) => {
  translateKey: string;
  paramsStore?: Record<string, string | number>;
};

declare module 'vue-router' {
  interface RouteMeta {
   titleHeader?: string | HeaderTitleConfig;
    permission?: string;
    role?: string;
    titleMenu?: string;
    iconMenu?: string;
    showInMenu?: boolean;
    showHeader?: boolean;
  }
}
