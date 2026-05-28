import React, { useState, useRef, useEffect } from "react";

type Props = {
  text: string | null;
  lines?: number; // number of lines to show when collapsed (default: 3)
  showMoreLabel?: string; // default "Show more"
  showLessLabel?: string; // default "Show less"
  className?: string; // optional additional class names
};

export default function TextWithToggle({
  text,
  lines = 3,
  showMoreLabel = "Show more",
  showLessLabel = "Show less",
  className = "",
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if the text overflows the clamped container
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const checkOverflow = () => {
      // Temporarily remove line-clamp to measure full height
      el.style.webkitLineClamp = "unset";
      const fullHeight = el.scrollHeight;
      el.style.webkitLineClamp = String(lines);

      // The clamped height is the max allowed by line-clamp
      const clampedHeight = el.clientHeight;
      setIsOverflowing(fullHeight > clampedHeight);
    };

    checkOverflow();

    // Re-check on window resize (debounced with requestAnimationFrame)
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkOverflow);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [text, lines]);

  if (!text) return null;

  const toggle = () => setIsExpanded((prev) => !prev);

  return (
    <div className={`relative ${className}`}>
      {/* The actual text container */}
      <p
        ref={textRef}
        className={`text-gray-700 whitespace-pre-line transition-all duration-300 ${
          !isExpanded ? `line-clamp-${lines}` : ""
        }`}
        style={
          !isExpanded
            ? {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: lines,
                overflow: "hidden",
              }
            : undefined
        }
      >
        {text}
      </p>

      {/* Toggle button – only if text overflows */}
      {isOverflowing && (
        <button
          onClick={toggle}
          aria-expanded={isExpanded}
          className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          {isExpanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  );
}
