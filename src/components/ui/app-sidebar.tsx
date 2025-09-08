"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, FileText, Phone } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <h2 className="text-lg font-bold">Menú</h2>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/">
                                    <Home className="w-4 h-4 mr-2" />
                                    Inicio
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {/* <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/declaracion-jurada">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Declaración
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem> */}
                        {/* <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/contacto">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Contacto
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem> */}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* <SidebarFooter>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} UPEA
                </p>
            </SidebarFooter> */}
        </Sidebar>
    );
}
