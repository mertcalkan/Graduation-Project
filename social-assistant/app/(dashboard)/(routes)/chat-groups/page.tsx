
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

// video idea suggestor page.
const chatGroupsPage = () => {
    return ( 
    <div> <Heading
    title = "Chat Groups"
    description = "You can join Chat Groups and grow up together!"
    icon = {MessageCircle}
    iconColor = "text-green-400"
    bgColor = "bg-green-400/10"
    /> 
    <div className="app px-8 py-8">
        <h1 className="text-xl font-semibold mb-4">Joined Chats</h1>
        <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
      </div>
      <div className="app px-8 py-8">
        <h1 className="text-xl font-semibold mb-4">Explore</h1>
        <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
      </div>
    </div>
     
    )
    
}
 
export default chatGroupsPage;