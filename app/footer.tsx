import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-8 text-center text-sm opacity-70">
      <p>
        Pondered by{" "}
        <a
          href="https://www.rizwanakhan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 transition-opacity"
        >
          Rizwana Khan
        </a>
        {" | "}
        <a
          href="https://x.com/rizbizkits"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 transition-opacity"
        >
          @rizbizkits
        </a>
      </p>
    </footer>
  );
};

export default Footer;
