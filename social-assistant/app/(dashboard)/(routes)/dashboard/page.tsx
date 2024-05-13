"use client";
import { ImageIcon, MessageCircleQuestion, Youtube, MessageCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tools = [{ label: "Suggest Channels With Hashtags", icon: MessageCircleQuestion, href: "/suggest-channels-with-hashtags", color: "text-violet-500" },
{ label: "Suggest Channels With Channel Links", icon: MessageCircleQuestion, href: "/suggest-channels-with-channel-url", color: "text-orange-500" },
{ label: "Suggest Channels With Video Links", icon: MessageCircleQuestion, href: "/suggest-channels-with-video-url", color: "text-blue-500" },
{ label: "Suggest Video Ideas With Hashtags", icon: MessageCircleQuestion, href: "/suggest-video-ideas-with-hashtags", color: "text-pink-500" },
{ label: "Suggest Video Ideas With Channel Links", icon: MessageCircleQuestion, href: "/suggest-video-ideas-with-channel-url", color: "text-green-500" },
{ label: "Suggest Video Ideas With Video Links", icon: MessageCircleQuestion, href: "/suggest-video-ideas-with-video-url", color: "text-yellow-500" },
]

const DashboardPage = () => {
  const router = useRouter();

  // Grid'e bölmek için tools dizisini üçerli gruplara bölelim
  const groupedTools = [];
  for (let i = 0; i < tools.length; i += 3) {
    groupedTools.push(tools.slice(i, i + 3));
  }

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-2xl md:text-4xl font-bold text-center">Explore the power of social media support</h2>
      <p className="text-muted-foreground font-light text-sm md:text-lg text-center">This YouTube assistant will help you for great contents!</p>
      <div className="px-6 md:px-20 lg:px-32 space-y-6">
        {groupedTools.map((group, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            {group.map((tool) => (
              <Card
                onClick={() => router.push(tool.href)}
                key={tool.href}
                className="p-4 border black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-8 h-8", tool.color)} />
                  </div>
                  <div className="font-semibold">
                    {tool.label}
                  </div>
                </div>
               
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;

