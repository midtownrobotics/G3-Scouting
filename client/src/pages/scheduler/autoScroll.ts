import { useRef, useEffect } from "react";

function useEdgeAutoScroll() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollIntervalX = useRef<NodeJS.Timeout | null>(null);
    const scrollIntervalY = useRef<NodeJS.Timeout | null>(null);

    function handleMouseMove(e: React.MouseEvent) {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { left, right, top, bottom } = container.getBoundingClientRect();
        const scrollSpeed = 10;

        if (e.clientX - left < 120) {
            startScrollingX(() => {
                container.scrollLeft -= scrollSpeed;
            });
        } else if (right - e.clientX < 80) {
            startScrollingX(() => {
                container.scrollLeft += scrollSpeed;
            });
        } else {
            stopScrollingX()
        };

        if (e.clientY - top < 150) {
            startScrollingY(() => {
                container.scrollTop -= scrollSpeed;
            });
        } else if (bottom - e.clientY < 80) {
            startScrollingY(() => {
                container.scrollTop += scrollSpeed;
            });
        } else {
            stopScrollingY()
        };

    }

    function startScrollingX(callback: () => void) {
        if (scrollIntervalX.current) return;
        scrollIntervalX.current = setInterval(callback, 30);
    }

    function startScrollingY(callback: () => void) {
        if (scrollIntervalY.current) return;
        scrollIntervalY.current = setInterval(callback, 30);
    }

    function stopScrolling() {
        stopScrollingX();
        stopScrollingY();
    }

    function stopScrollingX() {
        if (scrollIntervalX.current) {
            clearInterval(scrollIntervalX.current);
            scrollIntervalX.current = null;
        }
    }

    function stopScrollingY() {
        if (scrollIntervalY.current) {
            clearInterval(scrollIntervalY.current);
            scrollIntervalY.current = null;
        }
    }

    useEffect(() => stopScrolling, []);

    return {
        containerRef: scrollContainerRef,
        handleMouseMove,
        stopScroll: stopScrolling,
    };
}

export default useEdgeAutoScroll;