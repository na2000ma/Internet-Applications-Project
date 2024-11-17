import {Navigation} from "@organizo/services/navigation/navigation.types";

export const appNavigationItems: Navigation = {
  default: [
    {
      id: 'organizo',
      title: 'Internet Applications',
      type: 'group',
      children: [
        {
          id: 'folders',
          title: 'Folders',
          type: 'basic',
          icon: 'folder',
          link: '/folders',
        },
        {
          id: 'groups',
          title: 'Groups',
          type: 'basic',
          icon: 'group',
          link: '/groups',
        },
        {
          id: 'users',
          title: 'Users',
          type: 'basic',
          icon: 'user',
          link: '/users',
        },
      ]
    }
  ],
  compact: [
    {
      id: 'organizo',
      title: 'Organizo',
      type: 'aside',
      tooltip: 'Organizo',
      icon: 'logo',
      children: [], // This will be filled from defaultNavigation, so we don't have to manage multiple sets of the same navigation
    }
  ],
  futuristic: [
    {
      id: 'organizo',
      title: 'Organizo',
      type: 'group',
      children: [], // This will be filled from defaultNavigation, so we don't have to manage multiple sets of the same navigation
    }
  ],
  horizontal: [
    {
      id: 'organizo',
      title: 'Organizo',
      type: 'group',
      icon: 'logo',
      children: [], // This will be filled from defaultNavigation, so we don't have to manage multiple sets of the same navigation
    }
  ]
}
