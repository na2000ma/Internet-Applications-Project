import {EnvironmentProviders, Provider} from "@angular/core";
import {provideOrganizo} from "@organizo/organizo.provider";
import {Scheme, Theme} from "@organizo/services/config/config.types";
import {appThemes} from "@app/config/app-themes";
import {appScreens} from "@app/config/app-screens";
import {appNavigationItems} from "@app/config/navigation-items";
import {appLanguages} from "@app/config/app-languages";

export const appProvidersConfig: Array<Provider | EnvironmentProviders> = [
  // Organizo
  provideOrganizo({
    layout: localStorage.getItem('organizo-layout'),
    scheme: localStorage.getItem('organizo-scheme') as Scheme,
    theme: localStorage.getItem('organizo-theme') as Theme,
    stickyToolbar: localStorage.getItem('organizo-sticky-toolbar') === 'true',
    navigationItems: appNavigationItems,
    themes: appThemes,
    screens: appScreens,
    languages: appLanguages
  }),
];
