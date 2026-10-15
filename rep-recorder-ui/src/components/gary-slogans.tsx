import { useEffect, useState } from "react";

const slogans = [
  "No pain no gain",
  "Max the envelope",
  "Feel the Burn",
  "Believe to Achieve",
  "Push it to the limit",
  "The Final countdown",
  "L'Oréal, because you're worth it",
  "You can do it if you B & Q it",
];

const showFor = 5000; // how long each slogan stays up
const fadeFor = 600;  // matches the .slogan transition in index.css

// Gary the gorilla, top left, shouting a new slogan every 5 seconds
export default function GarySlogans() {
  const [index, setIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setFadingOut(true);
      swap = setTimeout(() => {
        setIndex(i => (i + 1) % slogans.length);
        setFadingOut(false);
      }, fadeFor);
    }, showFor);

    return () => {
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, []);

  return (
    <div className="gary">
      <img src={`${import.meta.env.BASE_URL}gary.png`} alt="Gary the gorilla" />
      <div className="speech" aria-live="polite">
        <span className={fadingOut ? "slogan out" : "slogan"}>
          “{slogans[index]}”
        </span>
      </div>
    </div>
  );
}
