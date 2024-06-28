"use client";
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { ImageIcon, LayoutDashboard, MessageCircleQuestion, Youtube, MessageCircle, SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
    { label: "Suggest Channels With Hashtags", icon: MessageCircleQuestion, href: "/suggest-channels-with-hashtags", color: "text-violet-500" },
    { label: "Suggest Channels With Channel Links", icon: MessageCircleQuestion, href: "/suggest-channels-with-channel-url", color: "text-orange-500" },
    { label: "Suggest Channels With Video Links", icon: MessageCircleQuestion, href: "/suggest-channels-with-video-url", color: "text-blue-500" },
    { label: "Suggest Video Ideas With Hashtags", icon: MessageCircleQuestion, href: "/suggest-video-ideas-with-hashtags", color: "text-pink-500" },
    { label: "Suggest Video Ideas With Channel Links", icon: MessageCircleQuestion, href: "/suggest-video-ideas-with-channel-url", color: "text-green-500" },
    { label: "Suggest Video Ideas With Video Links", icon: MessageCircleQuestion, href: "/suggest-video-ideas-with-video-url", color: "text-yellow-500" },
    
   
];

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 px-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4 flex items-center">
                        <Image fill alt="Logo" src="/logo.png" />
                    </div>
                    <h1 className={cn("text-2xl font-bold", montserrat.className)}> SocialTube</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link href={route.href} key={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", pathname === route.href ? "text-white bg-white/10": "text-zinc-400")}>
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} /> {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
