import React, { useRef, useState, useEffect } from 'react';

const PlayIcon = ({ color, size, hover }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: hover ? 0.7 : 1, transition: 'opacity 0.3s ease' }}
  >
    <path 
      d="M13.8876 9.9348C14.9625 10.8117 15.5 11.2501 15.5 12C15.5 12.7499 14.9625 13.1883 13.8876 14.0652C13.5909 14.3073 13.2966 14.5352 13.0261 14.7251C12.7888 14.8917 12.5201 15.064 12.2419 15.2332C11.1695 15.8853 10.6333 16.2114 10.1524 15.8504C9.6715 15.4894 9.62779 14.7336 9.54038 13.2222C9.51566 12.7947 9.5 12.3757 9.5 12C9.5 11.6243 9.51566 11.2053 9.54038 10.7778C9.62779 9.26636 9.6715 8.51061 10.1524 8.1496C10.6333 7.78859 11.1695 8.11466 12.2419 8.76679C12.5201 8.93597 12.7888 9.10831 13.0261 9.27492C13.2966 9.46483 13.5909 9.69274 13.8876 9.9348Z" 
      stroke={color} 
      strokeWidth="1.5"
    />
    <path 
      d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = ({ color, size }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M6 18L18 6M6 6L18 18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

export default function App({ config }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [wasPlayingBeforeFullscreen, setWasPlayingBeforeFullscreen] = useState(false);
  const [isClosed, setIsClosed] = useState(() => {
    // Проверяем localStorage при инициализации
    return localStorage.getItem('videoWidgetClosed') === 'true';
  });

  const handleFullscreenClick = async () => {
    if (!videoRef.current) return;
    
    try {
      setWasPlayingBeforeFullscreen(!videoRef.current.paused);
      
      if (videoRef.current.requestFullscreen) {
        await videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        await videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        await videoRef.current.msRequestFullscreen();
      }

      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
      if (videoRef.current) {
        videoRef.current.muted = true;
        if (!wasPlayingBeforeFullscreen) {
          videoRef.current.pause();
        }
      }
    }
  };

  const handleCloseClick = (e) => {
    e.stopPropagation(); // Предотвращаем срабатывание клика на видео
    setIsClosed(true);
    // Сохраняем состояние в localStorage
    localStorage.setItem('videoWidgetClosed', 'true');
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [wasPlayingBeforeFullscreen]);

  if (isClosed) {
    return null; // Не рендерим виджет, если он закрыт
  }

  const styles = {
    appContainer: {
      position: 'relative'
    },
    videoContainer: {
      position: config.position.type === 'fixed' ? 'fixed' : 'relative',
      left: config.position.left,
      right: config.position.right,
      top: config.position.top,
      bottom: config.position.bottom,
      width: config.position.width,
      zIndex: 100,
      cursor: 'pointer'
    },
    cornerVideo: {
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      display: 'block'
    },
    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none'
    },
    closeButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '24px',
      height: '24px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 101,
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }
    }
  };

  return (
    <div style={styles.appContainer}>
      <div 
        style={styles.videoContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          src={config.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          style={styles.cornerVideo}
          onClick={handleFullscreenClick}
        />
        
        <div style={styles.playButton}>
          <PlayIcon 
            color={config.playButton.color} 
            size={config.playButton.size} 
            hover={isHovered}
          />
        </div>

        {config.position.type === 'fixed' && (
          <div 
            style={styles.closeButton}
            onClick={handleCloseClick}
            title="Закрыть"
          >
            <CloseIcon color="#ffffff" size="16px" />
          </div>
        )}
      </div>
    </div>
  );
}