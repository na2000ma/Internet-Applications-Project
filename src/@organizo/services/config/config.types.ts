// Types

import {Navigation} from "@organizo/services/navigation/navigation.types";

export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string }[];
export type Lang = { id: string, label: string, flag: string };

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface OrganizoConfig {
  layout: string;
  scheme: Scheme;
  screens: Screens;
  theme: Theme;
  themes: Themes;
  stickyToolbar: boolean;
  navigationItems: Navigation;
  languages: Lang[];
}
