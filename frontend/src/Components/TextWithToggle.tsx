import { useEffect, useState } from "react";

type Props = {
  text: string | null;
};

function useDeviceMaxLength() {
  const [maxLength, setMaxLength] = useState(100);

  useEffect(() => {
    function updateMaxLength() {
      const width = window.innerWidth;
      console.log("hello");
      if (width < 640) {
        setMaxLength(30);
      } else {
        setMaxLength(200);
      }
    }

    updateMaxLength();
    window.addEventListener("resize", updateMaxLength);

    return () => window.removeEventListener("resize", updateMaxLength);
  }, []);

  return maxLength;
}

export default function TextWithToggle({ text }: Props) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = useDeviceMaxLength();

  if (!text) return null;

  const isLong = text.length > maxLength;
  const displayText = expanded
    ? text
    : text.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <>
      <p  className="text-gray-700 mb-4">{displayText}</p>
      {isLong && (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Меньше" : "Больше"}
        </button>
      )}
    </>
  );
}
