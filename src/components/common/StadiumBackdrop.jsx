import { useEffect, useState } from "react";

// Rotating stadium photos used behind match banners — cross-faded on a timer so
// switches are seamless. A paper scrim on top keeps the dark score/text legible;
// pass a lighter/darker `scrimClassName` to tune how much the photo shows through.
const STADIUMS = ["/stadiums/stadium-1.png", "/stadiums/stadium-2.png", "/stadiums/stadium-3.png"];
const ROTATE_MS = 6000;

export default function StadiumBackdrop({ scrimClassName = "bg-paper/55" }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % STADIUMS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {STADIUMS.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-in-out"
          style={{ backgroundImage: `url(${src})`, opacity: i === active ? 1 : 0 }}
        />
      ))}
      <div className={`absolute inset-0 ${scrimClassName}`} />
    </div>
  );
}
