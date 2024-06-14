"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Kerim Kürşat Kara",
    avatar: "A",
    title: "Industrial Engineer",
    description: "This app helped me so much when looking ideas.",
  },
  {
    name: "Ismail Utku Memiş",
    avatar: "I",
    title: "Med Vet",
    description:
      "This social media assistant application has revolutionized my veterinary practice by making social media management effortless and highly effective. It saves me time, enhances my online presence, and allows me to focus more on my patients",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-10 bg-[#101927]">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <Card
              key={item.description}
              className="bg-[#192339] border-none text-white"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  <div>
                    <p className="text-lg">{item.name}</p>
                    <p className="text-zinc-400 text-sm">{item.title}</p>
                  </div>
                </CardTitle>
                <CardContent className="pt-4 px-0">
                  {item.description}
                </CardContent>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
