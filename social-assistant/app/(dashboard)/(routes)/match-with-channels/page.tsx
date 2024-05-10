"use client"
import React, { useState } from 'react';
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"

const MatchWithChannelsPage = () => {
    const [isMatching, setIsMatching] = useState(false);
    const [isScrollEnabled, setIsScrollEnabled] = useState(false);
    const [superLikes, setSuperLikes] = useState(3);
    const [showPremiumOffer, setShowPremiumOffer] = useState(false);

    const handleStart = () => {
        setIsMatching(true);
        setIsScrollEnabled(true); // Başlatıldığında kaydırma seçeneğini aç
        // Buraya eşleştirme işleminin başlatılması için gerekli kodları ekleyebilirsiniz.
    };

    const handleStop = () => {
        setIsMatching(false);
        setIsScrollEnabled(false); // Durdurulduğunda kaydırma seçeneğini kapat
        // Buraya eşleştirme işleminin durdurulması için gerekli kodları ekleyebilirsiniz.
    };

    const handleLike = () => {
        if (superLikes > 0) {
            // Buraya bir kullanıcıya "super like" gönderme kodlarını ekleyebilirsiniz.
            setSuperLikes(superLikes - 1);
        } else {
            setShowPremiumOffer(true);
        }
    };

    return (
        <div>
            <Heading
                title="Match With Channels"
                description="You can look at channels like you. You can swipe right and down. If both side likes each other, then you can start direct message and share your perspectives!"
                icon={Youtube}
                iconColor="text-pink-600"
                bgColor="bg-pink-600/10"
            />
            <div className="flex justify-center mt-8">
                <Button
                    onClick={handleStart}
                    disabled={isMatching}
                    className="mr-4 px-6 py-3 text-lg rounded-md bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Start
                </Button>
                <Button
                    onClick={handleStop}
                    disabled={!isMatching}
                    className="px-6 py-3 text-lg rounded-md bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                >
                    Stop
                </Button>
            </div>
            {isScrollEnabled && (
                <div className="mt-4 text-center">
                    {/* Carousel benzeri bileşeni buraya ekleyebilirsiniz */}
                    <p>Kaydırma seçeneği açıldı!</p>
                    <Button
                        onClick={handleLike}
                        className="mt-4 px-6 py-3 text-lg rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                    >
                        Super Like
                    </Button>
                    
                </div>
            )}
            {showPremiumOffer && (
                <div className="mt-4 text-center">
                    <p>Günlük "super like" hakkınız tükendi. Premium paketle daha fazla "super like" alabilirsiniz!</p>
                    <Button
                        className="mt-4 px-6 py-3 text-lg rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                    >
                        Premium Paket Satın Al
                    </Button>
                    
                </div>
            )}
        </div>
    );
};

export default MatchWithChannelsPage;
