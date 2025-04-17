import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

// This component is specifically for web platforms since it uses complex CSS 3D transforms
const SoundWaveBackground = () => {
  // Return null on non-web platforms
  if (Platform.OS !== 'web') {
    return null;
  }
  
  // Create arrays for wave rows and bars
  const waveRows = Array.from({ length: 10 });
  const waveBars = Array.from({ length: 28 });

  return (
    <View style={styles.container}>
      {/* Web-specific styling injected into the document head */}
      <style type="text/css">{`
        .scene {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateX(60deg) rotateZ(175deg);
          z-index: 0;
          left: 50%;
          transform-origin: center;
          margin-left: -50vw;
        }
        
        .waves-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 150%;
          transform: translate(-50%, -50%);
          transform-style: preserve-3d;
        }
        
        .wave-row {
          position: absolute;
          width: 120%;
          height: 4px;
          left: -10%;
          background: transparent;
          transform-style: preserve-3d;
        }
        
        ${waveRows.map((_, i) => `
          .wave-row:nth-child(${i + 1}) { 
            top: ${5 + i * 5}%; 
            transform: translateZ(${-20 * i}px); 
          }
        `).join('')}
        
        .wave-bar {
          position: absolute;
          top: 0;
          width: 8px;
          height: 100%;
          background: #4dffaa;
          transform-origin: bottom center;
          animation: wave-animation 2s ease-in-out infinite;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(77, 255, 170, 0.7);
        }
        
        ${waveBars.map((_, i) => `
          .wave-bar:nth-child(${i + 1}) { 
            left: ${2 + (i * 3.5)}%; 
            animation-delay: ${(i * 0.1) % 2}s; 
          }
        `).join('')}
        
        @keyframes wave-animation {
          0%, 100% {
            transform: scaleY(1);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(8);
            opacity: 1;
          }
        }
        
        .wave-row:nth-child(odd) .wave-bar {
          background: #4dffaa;
        }
        
        .wave-row:nth-child(even) .wave-bar {
          background: #33ee99;
        }
        
        ${waveRows.map((_, i) => `
          .wave-row:nth-child(${i + 1}) .wave-bar { 
            opacity: ${1 - (i * 0.05)}; 
          }
        `).join('')}
        
        .ground-plane {
          position: absolute;
          width: 300%;
          height: 200%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotateX(90deg) translateZ(-10px);
          background: linear-gradient(90deg, 
              rgba(0, 20, 10, 0.8) 0%,
              rgba(0, 50, 30, 0.5) 50%,
              rgba(0, 20, 10, 0.8) 100%);
          background-size: 100% 100%;
          box-shadow: 0 0 100px rgba(77, 255, 170, 0.3);
        }
        
        .ground-plane::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
              linear-gradient(90deg, transparent 98%, rgba(77, 255, 170, 0.2) 98%),
              linear-gradient(180deg, transparent 98%, rgba(77, 255, 170, 0.2) 98%);
          background-size: 40px 40px;
        }
        
        .scan-line {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: -100%;
          background: linear-gradient(90deg, 
              rgba(77, 255, 170, 0) 0%,
              rgba(77, 255, 170, 0.05) 40%,
              rgba(77, 255, 170, 0.1) 50%,
              rgba(77, 255, 170, 0.05) 60%,
              rgba(77, 255, 170, 0) 100%);
          animation: scan 8s linear infinite;
          pointer-events: none;
        }
        
        @keyframes scan {
          0% {
              left: -100%;
          }
          100% {
              left: 100%;
          }
        }
        
        .ambient-light {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: radial-gradient(circle at center, 
              rgba(77, 255, 170, 0.1) 0%, 
              rgba(0, 0, 0, 0) 70%);
          pointer-events: none;
        }
      `}</style>
      
      {/* 3D scene container */}
      <div className="scene">
        {/* Ground plane with grid */}
        <div className="ground-plane"></div>
        
        {/* 3D waves container */}
        <div className="waves-container">
          {/* Wave rows */}
          {waveRows.map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="wave-row">
              {waveBars.map((_, barIndex) => (
                <div key={`bar-${rowIndex}-${barIndex}`} className="wave-bar"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Scan line effect */}
      <div className="scan-line"></div>
      
      {/* Ambient lighting */}
      <div className="ambient-light"></div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100vw',
    height: 'calc(100% + 100px)',
    overflow: 'hidden',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a1a12',
    zIndex: 0,
    marginLeft: 'calc(-50vw + 50%)',
  }
});

export default SoundWaveBackground; 