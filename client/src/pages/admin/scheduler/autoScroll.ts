import { useRef, useEffect } from "react";

function useEdgeAutoScroll() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollInterval = useRef<NodeJS.Timeout | null>(null);

    function handleMouseMove(e: React.MouseEvent) {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { left, right } = container.getBoundingClientRect();
        const scrollSpeed = 10;
        const edgeSize = 40;

        if (e.clientX - left < edgeSize) {
            // Near left edge
            startScrolling(() => {
                container.scrollLeft -= scrollSpeed;
            });
        } else if (right - e.clientX < edgeSize) {
            // Near right edge
            startScrolling(() => {
                container.scrollLeft += scrollSpeed;
            });
        } else {
            stopScrolling();
        }
    }

    function startScrolling(callback: () => void) {
        if (scrollInterval.current) return;
        scrollInterval.current = setInterval(callback, 30);
    }

    function stopScrolling() {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
            scrollInterval.current = null;
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