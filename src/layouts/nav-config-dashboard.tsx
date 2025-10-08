import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      // { title: 'Ecommerce', path: paths.dashboard.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
      // { title: 'Banking', path: paths.dashboard.general.banking, icon: ICONS.banking },
      // { title: 'Booking', path: paths.dashboard.general.booking, icon: ICONS.booking },
      // { title: 'File', path: paths.dashboard.general.file, icon: ICONS.file },
      // { title: 'Course', path: paths.dashboard.general.course, icon: ICONS.course },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Customers',
        path: paths.dashboard.customer.root,
        icon: ICONS.user,
        children: [
          // { title: 'Profile', path: paths.dashboard.user.root },
          // { title: 'Cards', path: paths.dashboard.user.cards },
          { title: 'Total', path: paths.dashboard.customer.root },
          { title: 'My Customers', path: paths.dashboard.customer.list },
          // { title: 'Create', path: paths.dashboard.user.new },
          // { title: 'Edit', path: paths.dashboard.customer.demo.edit },
          // { title: 'Account', path: paths.dashboard.customer.account },
        ],
      },
      
    ],
  },
  {
    subheader: 'Account',
    items: [
      {
        title: 'Account',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Overview', path: paths.dashboard.general.banking },
          { title: 'Payments', path: paths.dashboard.general.invoice },
        ],
      },
      // {
      //   title: 'Tickets',
      //   path: paths.dashboard.user.root,
      //   icon: ICONS.user,
      //   children: [
      //     { title: 'Profile', path: paths.dashboard.user.root },
      //     { title: 'Cards', path: paths.dashboard.user.cards },
      //     { title: 'List', path: paths.dashboard.user.list },
      //     { title: 'Create', path: paths.dashboard.user.new },
      //     { title: 'Edit', path: paths.dashboard.user.demo.edit },
      //     { title: 'Account', path: paths.dashboard.user.account },
      //   ],
      // },
      // {
      //   title: 'Payments',
      //   path: paths.dashboard.payment.root,
      //   icon: ICONS.user,
      //   children: [
      //     { title: 'Overview', path: paths.dashboard.payment.root },
      //     { title: 'Cards', path: paths.dashboard.payment.cards },
      //     { title: 'List', path: paths.dashboard.payment.list },
      //     { title: 'Create', path: paths.dashboard.payment.new },
      //     { title: 'Edit', path: paths.dashboard.payment.demo.edit },
      //     { title: 'Account', path: paths.dashboard.payment.account },
      //   ],
      // },
    ],
  },
  // {
  //   subheader: 'Management',
  //   items: [
  //     {
  //       title: 'Packages',
  //       path: paths.dashboard.package.root,
  //       icon: ICONS.file,
  //       children: [
  //         { title: 'All', path: paths.dashboard.package.cards },
  //         { title: 'List', path: paths.dashboard.package.list },
  //       ],
  //     },
  //     {
  //       title: 'Vouchers',
  //       path: paths.dashboard.voucher.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'Overview', path: paths.dashboard.voucher.root },
  //         { title: 'List', path: paths.dashboard.voucher.list },
  //         // { title: 'Create', path: paths.dashboard.voucher.new },
  //         // { title: 'Edit', path: paths.dashboard.voucher.demo.edit },
  //         // { title: 'Account', path: paths.dashboard.voucher.account },
  //       ],
  //     },
  //   ],
  // },
  // /**
  //  * Item State
  //  */
  // {
  //   subheader: 'Misc',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'Permission',
  //       path: paths.dashboard.permission,
  //       icon: ICONS.lock,
  //       roles: ['admin', 'manager'],
  //       caption: 'Only admin can see this item',
  //     },
  //     {
  //       title: 'Level',
  //       path: '#/dashboard/menu_level',
  //       icon: ICONS.menuItem,
  //       children: [
  //         {
  //           title: 'Level 1a',
  //           path: '#/dashboard/menu_level/menu_level_1a',
  //           children: [
  //             { title: 'Level 2a', path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a' },
  //             {
  //               title: 'Level 2b',
  //               path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b',
  //               children: [
  //                 {
  //                   title: 'Level 3a',
  //                   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3a',
  //                 },
  //                 {
  //                   title: 'Level 3b',
  //                   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3b',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         { title: 'Level 1b', path: '#/dashboard/menu_level/menu_level_1b' },
  //       ],
  //     },
  //     {
  //       title: 'Disabled',
  //       path: '#disabled',
  //       icon: ICONS.disabled,
  //       disabled: true,
  //     },
  //     {
  //       title: 'Label',
  //       path: '#label',
  //       icon: ICONS.label,
  //       info: (
  //         <Label
  //           color="info"
  //           variant="inverted"
  //           startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
  //         >
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'Caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption:
  //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
  //     },
  //     {
  //       title: 'Params',
  //       path: '/dashboard/params?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
  //       icon: ICONS.parameter,
  //     },
  //     {
  //       title: 'External link',
  //       path: 'https://www.google.com/',
  //       icon: ICONS.external,
  //       info: <Iconify width={18} icon="prime:external-link" />,
  //     },
  //     { title: 'Blank', path: paths.dashboard.blank, icon: ICONS.blank },
  //   ],
  // },
];
