'use client'

import * as React from 'react'
import { CircleGaugeIcon, InfoIcon, CirclePlusIcon, AxeIcon, ChevronRightIcon, DatabaseIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/stores'

type NavItem = {
  title: string
  path: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  children?: NavItem[]
}

const navMenu: NavItem[] = [
  {
    title: '仪表盘',
    path: '/',
    icon: CircleGaugeIcon,
  },
  {
    title: '报价录入',
    path: '/price',
    icon: CirclePlusIcon,
  },
  {
    title: '基础数据',
    icon: DatabaseIcon,
    path: '/base-data',
    children: [
      {
        title: '基材',
        path: '/base-data/mat',
      },
      {
        title: '花色',
        path: '/base-data/color',
      },
      {
        title: '测试',
        path: '/base-data/test',
      },
    ],
  },
  {
    title: '关于',
    path: '/about',
    icon: InfoIcon,
  },
]

function findNavName(targetPath: string) {
  for (const item of navMenu) {
    if (item.path === targetPath) return [item.title]
    const child = item.children?.find((c) => c.path === targetPath)
    if (child) return [item.title, child.title]
  }
  return []
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const setTitle = useAppStore((state) => state.setTitle)

  React.useEffect(() => {
    setTitle(findNavName(pathname))
  }, [pathname])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-1.5 select-none">
              <AxeIcon className="!size-5" />
              <span className="text-base font-semibold">报价管理系统</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMenu.map((item) => (
              <NavChild key={item.path} {...{ item, pathname }} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function NavChild({ item, pathname }: { item: NavItem; pathname: string }) {
  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={item.title} isActive={pathname === item.path} asChild>
          <Link href={item.path}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible asChild className="group/collapsible" defaultOpen={item.children.some((c) => c.path === pathname)}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((subItem) => (
              <SidebarMenuSubItem key={subItem.path}>
                <SidebarMenuSubButton isActive={pathname === subItem.path} asChild>
                  <Link href={subItem.path}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
