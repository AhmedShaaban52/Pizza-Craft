"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 size-11 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1  ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"}  bg-orange-500 text-white hover:bg-orange-600  dark:bg-orange-600 dark:hover:bg-orange-700 dark:text-white animate-bounce cursor-pointer`}
            aria-label="Scroll to top"
        >
            <ArrowUp className="size-5" />
        </Button>
    );
}