import {Navigation} from "@organizo/services/navigation/navigation.types";

export const appNavigationItems: Navigation = {
  default: [
    {
      id: 'organizo',
      title: 'DMS',
      type: 'group',
      children: [
        {
          id: 'folderStructure',
          title: 'Folder Structure',
          type: 'basic',
          icon: 'folder-structure',
          link: '/folder-structure',
        }
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
