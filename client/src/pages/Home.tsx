import { useEffect, useState } from "react";

function Home() {
    const [ipAddress, setIpAddress] = useState('');
  
    useEffect(() => {
      const getIpAddress = async () => {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          setIpAddress(data.ip);
        } catch (e) {}
      }
      getIpAddress();
    }, []);

    return (
        <div>
            <h1>welsome to the g³ scout-o-matic made by g³</h1>
            <br />
            <br />
            <h1>;)</h1>
            <br />
            <br />
            <h1>{ipAddress}</h1>
        </div>
    );
}

export default Home;