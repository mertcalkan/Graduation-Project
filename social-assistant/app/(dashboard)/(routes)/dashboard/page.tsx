"use client";
import { ImageIcon, MessageCircleQuestion, Youtube, MessageCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tools = [{ label: "Suggest Video Ideas", icon: MessageCircleQuestion, href: "/suggest-ideas", color: "text-violet-500",bgColor: "text-violet-500/10" },
{ label: "Suggest Channels", icon: MessageCircleQuestion, href: "/suggest-channels", color: "text-orange-500",bgColor: "text-orange-500/10" },
{ label: "Channel Matches", icon: Youtube, href: "/match-with-channels", color: "text-pink-600",bgColor: "text-pink-600/10"},
{ label: "Chat Groups", icon: MessageCircle, href: "/chat-groups", color: "text-green-400",bgColor: "text-green-400/10"},]

const DashboardPage = ( ) => {
  const router = useRouter();

  return (
    
    <div className = "mb-8 space-y-4">
      <h2 className = "text-2xl md:text-4xl font-bold text-center">Explore the power of social media support</h2>
      <p className = "text-muted-foreground font-light text-sm md:text-lg text-center ">This YouTube assistant will help you for great contents!</p>
    <div className = "px-4 md:px-20 lg:px-32 space-y-4">
    {tools.map(
      (tool) => (<Card onClick={() => router.push(tool.href)} key = {tool.href} className ="p-4 border black/5 flex items-center 
      justify-between hover:shadow-md transition cursor-pointer" >
        <div className = "flex items-center gap-x-4">
          <div className = {cn("p-2 w-fit rounded-md, tool.bgColor")}>
            <tool.icon className = {cn("w-8 h-8" , tool.color)}/>
          </div>
          <div className = "font-semibold">
           {tool.label}
          </div>
        </div>
        <div>
          <ArrowRight className = "w-5 h-5"/>
        </div>
      </Card>))}
     </div>
     </div>
     
  );
}


export default DashboardPage
