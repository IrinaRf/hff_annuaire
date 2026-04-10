import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Surveille le scroll de la fenêtre entière
    useEffect(() => {
        const toggleVisibility = () => {
            // Apparaît après 300px de scroll
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-100">
            <button
                type="button"
                onClick={scrollToTop}
                className={`
                    flex h-12 w-12 items-center justify-center rounded-sm
                    bg-[#1f2937] text-[#fbbb01] shadow-[4px_4px_0px_0px_rgba(251,187,1,1)]
                    border-2 border-[#fbbb01] transition-all duration-300 hover:scale-110 active:scale-95
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
                `}
            >
                <ChevronUp size={24} strokeWidth={3} />
            </button>
        </div>
    );
};

export default ScrollToTop;