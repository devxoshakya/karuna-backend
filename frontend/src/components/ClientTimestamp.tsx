"use client";

import { useState, useEffect } from "react";

interface ClientTimestampProps {
  timestamp: Date;
  className?: string;
}

export function ClientTimestamp({ timestamp, className }: ClientTimestampProps) {
  const [timeString, setTimeString] = useState("--:--");

  useEffect(() => {
    // Only update the time string on the client side
    setTimeString(timestamp.toLocaleTimeString());
  }, [timestamp]);

  return <span className={className}>{timeString}</span>;
}
