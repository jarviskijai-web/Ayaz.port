'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Database, Server, Globe, Laptop, Braces, Cpu, GitBranch, Layers } from 'lucide-react';

interface FloatingIconsProps {
  icons?: Array<{
    Icon: React.ElementType;
    color: string;
    size: number;
  }>;
  density?: 'low' | 'medium' | 'high';
  opacity?: [number, number, number]; // [min, max, min] for animation
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
}

export function FloatingIcons({
  icons,
  density = 'medium',
  opacity = [0.2, 0.7, 0.2],
  speed = 'medium',
  className = '',
}: FloatingIconsProps) {
  // Default tech icons if none provided
  const defaultIcons = [
    { Icon: Code, color: "#d4af75", size: 28 },
    { Icon: Terminal, color: "#e4c98a", size: 32 },
    { Icon: Database, color: "#b88938", size: 24 },
    { Icon: Server, color: "#f1dfb0", size: 30 },
    { Icon: Globe, color: "#d4af75", size: 26 },
    { Icon: Laptop, color: "#e4c98a", size: 28 },
    { Icon: Braces, color: "#b88938", size: 32 },
    { Icon: Cpu, color: "#f1dfb0", size: 24 },
    { Icon: GitBranch, color: "#d4af75", size: 28 },
    { Icon: Layers, color: "#e4c98a", size: 30 }
  ];

  const techIcons = icons || defaultIcons;
  
  // Adjust number of icons based on density
  const iconCount = {
    low: Math.min(5, techIcons.length),
    medium: Math.min(10, techIcons.length),
    high: Math.min(15, techIcons.length)
  }[density];
  
  const displayIcons = techIcons.slice(0, iconCount);
  
  // Adjust animation speed
  const durationMultiplier = {
    slow: 1.5,
    medium: 1,
    fast: 0.7
  }[speed];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {displayIcons.map((tech, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ 
            x: Math.random() * 100 - 50 + '%', 
            y: Math.random() * 100 - 50 + '%',
            opacity: 0 
          }}
          animate={{ 
            x: [
              Math.random() * 80 - 40 + '%', 
              Math.random() * 80 - 40 + '%', 
              Math.random() * 80 - 40 + '%'
            ],
            y: [
              Math.random() * 80 - 40 + '%', 
              Math.random() * 80 - 40 + '%', 
              Math.random() * 80 - 40 + '%'
            ],
            opacity: opacity
          }}
          transition={{
            duration: (15 + Math.random() * 20) * durationMultiplier,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.2
          }}
          style={{ zIndex: -1 }}
        >
          <tech.Icon size={tech.size} color={tech.color} />
        </motion.div>
      ))}
    </div>
  );
} 