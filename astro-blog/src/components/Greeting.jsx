import { useState } from 'preact/hooks';

export default function Greeting({messages}) {

  const randomMessage = () => 
    messages[(Math.floor(Math.random() * messages.length))];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
      <h3>{greeting}! Welcome to my Astro blog!</h3>
      <button onClick={() => setGreeting(randomMessage())}>
        new greeting
      </button>
    </div>
  );
}