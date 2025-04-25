import { JSX, useEffect, useState } from "react";

function Home() {
    const [messages, setMessages] = useState<JSX.Element[]>(Array(20).fill(<h1>Welcome to the home page.</h1>));

    useEffect(() => {
        const handleScroll = () => {
            setMessages(prev => [...prev, ...Array(200).fill(<h1>Welcome to the home page.</h1>)]);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div>
            {messages}
        </div>
    );
}

export default Home;