import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

// This component is specifically for web platforms since it uses complex CSS 3D transforms
const OceanPulseBackground = () => {
  // Return null on non-web platforms
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Web-specific styling injected into the document head */}
      <style type="text/css">{`
        .ocean-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100%;
            background: linear-gradient(to bottom, #051425 0%, #062b4a 100%);
            overflow: hidden;
            z-index: 0;
        }
        
        /* Ocean waves using SVG shapes with animations */
        .ocean-wave {
            position: absolute;
            width: 200%;
            height: 100%;
            animation: wave-animation 15s infinite linear;
            transform-origin: center bottom;
        }
        
        .wave1 {
            bottom: -10%;
            opacity: 0.8;
            animation-duration: 20s;
        }
        
        .wave2 {
            bottom: -5%;
            opacity: 0.6;
            animation-duration: 13s;
            animation-delay: -5s;
        }
        
        .wave3 {
            bottom: -8%;
            opacity: 0.4;
            animation-duration: 17s;
            animation-delay: -2s;
        }
        
        @keyframes wave-animation {
            0% {
                transform: translateX(0) translateZ(0) scaleY(1);
            }
            50% {
                transform: translateX(-25%) translateZ(0) scaleY(1.1);
            }
            100% {
                transform: translateX(-50%) translateZ(0) scaleY(1);
            }
        }
        
        /* Pulse effect positioned to match phone location (right side) */
        .pulse-container {
            position: absolute;
            top: 50%;
            right: 25%; /* Positioned toward the right side where the phone is */
            transform: translate(0, -30%);
            z-index: 1;
        }
        
        .pulse-ring {
            position: absolute;
            border-radius: 50%;
            background: transparent;
            border: 2px solid rgba(77, 255, 170, 0.5);
            box-shadow: 0 0 20px rgba(77, 255, 170, 0.6);
            transform-origin: center center;
            opacity: 0;
            animation: pulse 6.75s infinite;
        }
        
        .pulse-ring:nth-child(1) {
            width: 100px;
            height: 100px;
            animation-delay: 0s;
        }
        
        .pulse-ring:nth-child(2) {
            width: 200px;
            height: 200px;
            animation-delay: 1.69s;
        }
        
        .pulse-ring:nth-child(3) {
            width: 300px;
            height: 300px;
            animation-delay: 3.38s;
        }
        
        .pulse-ring:nth-child(4) {
            width: 400px;
            height: 400px;
            animation-delay: 5.06s;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(0.1);
                opacity: 0.8;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        /* Circular ripple effect beneath the pulse */
        .ripple {
            position: absolute;
            top: 50%;
            right: 25%;
            transform: translate(0, -30%);
            width: 200px;
            height: 200px;
            background: radial-gradient(
                circle,
                rgba(77, 255, 170, 0.4) 0%,
                rgba(77, 255, 170, 0.1) 40%,
                rgba(77, 255, 170, 0) 70%
            );
            border-radius: 50%;
            animation: ripple 8s infinite alternate;
        }
        
        @keyframes ripple {
            0% {
                transform: translate(0, -30%) scale(1);
                opacity: 0.5;
            }
            50% {
                transform: translate(0, -30%) scale(1.5);
                opacity: 0.7;
            }
            100% {
                transform: translate(0, -30%) scale(1.2);
                opacity: 0.5;
            }
        }
        
        /* Floating particles */
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }
        
        .particle {
            position: absolute;
            display: block;
            background-color: rgba(77, 255, 170, 0.8);
            width: 2px;
            height: 2px;
            border-radius: 50%;
            animation: float-up 20s infinite linear;
        }
        
        ${Array.from({ length: 50 }).map((_, i) => `
            .particle:nth-child(${i + 1}) {
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                transform: scale(${0.5 + Math.random()});
                animation-duration: ${15 + Math.random() * 15}s;
                animation-delay: ${-Math.random() * 20}s;
                opacity: ${0.3 + Math.random() * 0.7};
            }
        `).join('')}
        
        @keyframes float-up {
            0% {
                transform: translateY(110vh) translateX(0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: var(--particle-opacity, 0.6);
            }
            100% {
                transform: translateY(-10vh) translateX(${Math.random() * 20 - 10}px) scale(0.5);
                opacity: 0;
            }
        }
        
        /* Ambient lighting and underwater rays */
        .ambient-light {
            position: absolute;
            top: 0;
            right: 25%;
            width: 300px;
            height: 100%;
            background: radial-gradient(
                ellipse at center,
                rgba(77, 255, 170, 0.15) 0%,
                rgba(77, 255, 170, 0) 70%
            );
            transform: translate(0, 0);
            z-index: 0;
            animation: ambient-pulse 8s infinite alternate;
        }
        
        @keyframes ambient-pulse {
            0% {
                opacity: 0.5;
                transform: scale(1);
            }
            100% {
                opacity: 0.8;
                transform: scale(1.2);
            }
        }
        
        .light-ray {
            position: absolute;
            background: linear-gradient(
                to bottom,
                rgba(77, 255, 170, 0.05),
                rgba(77, 255, 170, 0)
            );
            transform-origin: top center;
            z-index: 0;
        }
        
        ${Array.from({ length: 5 }).map((_, i) => `
            .light-ray:nth-child(${i + 1}) {
                top: 0;
                right: ${20 + (i * 10)}%;
                height: 100vh;
                width: ${20 + (i * 5)}px;
                transform: rotate(${-5 + (i * 2)}deg);
                opacity: ${0.3 - (i * 0.05)};
            }
        `).join('')}
      `}</style>

      <div className="ocean-container">
        {/* Ocean waves */}
        <svg className="ocean-wave wave1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(0, 100, 150, 0.7)" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,186.7C672,192,768,192,864,202.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        
        <svg className="ocean-wave wave2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(0, 150, 200, 0.5)" fillOpacity="1" d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,165.3C672,181,768,171,864,144C960,117,1056,75,1152,80C1248,85,1344,139,1392,165.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        
        <svg className="ocean-wave wave3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(0, 200, 255, 0.3)" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,144C672,117,768,107,864,128C960,149,1056,203,1152,218.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        
        {/* Pulsing effect positioned under the phone */}
        <div className="pulse-container">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
        </div>
        
        {/* Ripple effect */}
        <div className="ripple"></div>
        
        {/* Ambient lighting */}
        <div className="ambient-light"></div>
        
        {/* Light rays */}
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        
        {/* Floating particles */}
        <div className="particles">
          {Array.from({ length: 50 }).map((_, index) => (
            <div key={index} className="particle"></div>
          ))}
        </div>
      </div>
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
    backgroundColor: '#041510',
    zIndex: 0,
    marginLeft: 'calc(-50vw + 50%)',
  }
});

export default OceanPulseBackground; 