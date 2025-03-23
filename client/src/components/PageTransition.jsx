import React, { useState, useEffect } from "react";

export default function PageTransition({ children, isLoading }) {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setContentVisible(true), 100);
    } else {
      setContentVisible(false);
    }
  }, [isLoading]);

  return (
    <div
      className={`transition-opacity duration-500 ${
        contentVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
