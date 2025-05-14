/**
 * Retrowave-themed website script with music player
 * Optimized and improved version
 */

// Use modern JavaScript with strict mode
'use strict';

// DOM elements with selectors for performance
const domElements = {
  preloader: null,
  progress: null,
  header: null,
  menuToggle: null,
  nav: null,
  musicPlayer: null,
  playPauseBtn: null,
  volumeControl: null,
  playerToggle: null,
  cards: null,
  neonTexts: null,
  neonBtns: null
};

// Audio for background music
const backgroundMusic = new Audio('audio/retrowave.mp3');

// Cache elements once DOM is loaded
function cacheElements() {
  domElements.preloader = document.querySelector('.preloader');
  domElements.progress = document.querySelector('.progress');
  domElements.header = document.querySelector('header');
  domElements.menuToggle = document.querySelector('.menu-toggle');
  domElements.nav = document.querySelector('nav');
  domElements.musicPlayer = document.querySelector('.music-player');
  domElements.playPauseBtn = document.getElementById('play-pause');
  domElements.volumeControl = document.getElementById('volume');
  domElements.playerToggle = document.querySelector('.player-toggle');
  domElements.cards = document.querySelectorAll('.card');
  domElements.neonTexts = document.querySelectorAll('.neon-text');
  domElements.neonBtns = document.querySelectorAll('.neon-btn');
}

// Preloader functionality
function initPreloader() {
  if (!domElements.preloader || !domElements.progress) return;
  
  let loadProgress = 0;
  const loadingInterval = setInterval(() => {
    // Use a more realistic progressive loading curve
    const increment = Math.max(1, Math.floor((100 - loadProgress) / 10));
    loadProgress += increment;
    
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadingInterval);
      
      // Use a Promise for better animation timing
      const fadeOut = () => {
        return new Promise(resolve => {
          domElements.preloader.style.opacity = '0';
          setTimeout(() => {
            domElements.preloader.style.display = 'none';
            resolve();
          }, 500);
        });
      };
      
      setTimeout(() => fadeOut(), 500);
    }
    
    domElements.progress.style.width = `${loadProgress}%`;
  }, 150);
}

// Header scroll effect
function initHeaderScroll() {
  if (!domElements.header) return;
  
  // Use throttling for better performance
  let lastScrollTime = 0;
  const throttleDelay = 20; // ms
  
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < throttleDelay) return;
    lastScrollTime = now;
    
    const scrolled = window.scrollY > 50;
    domElements.header.classList.toggle('scrolled', scrolled);
  });
}

// Mobile menu toggle
function initMobileMenu() {
  if (!domElements.menuToggle || !domElements.nav) return;
  
  domElements.menuToggle.addEventListener('click', () => {
    domElements.nav.classList.toggle('active');
    
    // Toggle menu icon
    const icon = domElements.menuToggle.querySelector('i');
    if (icon) {
      const isActive = domElements.nav.classList.contains('active');
      icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
    }
  });
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      domElements.nav.classList.remove('active');
      
      const icon = domElements.menuToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });
}

// Music player functionality
function initMusicPlayer() {
  if (!domElements.musicPlayer) return;
  
  // Initialize music settings
  backgroundMusic.loop = true;
  backgroundMusic.volume = domElements.volumeControl ? domElements.volumeControl.value : 0.5;
  
  // Make the minimized player clickable to expand
  domElements.musicPlayer.addEventListener('click', function() {
    if (this.classList.contains('minimized')) {
      this.classList.remove('minimized');
    }
  });
  
  // Initialize minimize button
  if (domElements.playerToggle) {
    domElements.playerToggle.addEventListener('click', e => {
      e.stopPropagation();
      domElements.musicPlayer.classList.add('minimized');
    });
  }
  
  // Start with player minimized on mobile
  if (window.innerWidth <= 480) {
    domElements.musicPlayer.classList.add('minimized');
  }
  
  // Play/pause functionality
  if (domElements.playPauseBtn) {
    domElements.playPauseBtn.addEventListener('click', e => {
      e.stopPropagation();
      const icon = domElements.playPauseBtn.querySelector('i');
      
      if (backgroundMusic.paused) {
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (icon) {
                icon.className = 'fas fa-pause';
              }
              
              // Maximize player when starting music
              if (domElements.musicPlayer.classList.contains('minimized')) {
                domElements.musicPlayer.classList.remove('minimized');
              }
            })
            .catch(error => {
              console.warn("Autoplay blocked, requires user interaction:", error);
            });
        }
      } else {
        backgroundMusic.pause();
        if (icon) {
          icon.className = 'fas fa-play';
        }
      }
    });
  }
  
  // Volume control
  if (domElements.volumeControl) {
    domElements.volumeControl.addEventListener('input', e => {
      e.stopPropagation();
      const volumeValue = parseFloat(domElements.volumeControl.value);
      backgroundMusic.volume = volumeValue;
      
      // Update volume icon
      const volumeIcon = document.querySelector('.volume-control i');
      if (volumeIcon) {
        volumeIcon.className = volumeValue === 0 ? 'fas fa-volume-mute' :
                             volumeValue < 0.5 ? 'fas fa-volume-down' :
                             'fas fa-volume-up';
      }
    });
  }
}

// Animation effects using Intersection Observer
function initAnimations() {
  // Only create observer if needed
  if (!domElements.cards || domElements.cards.length === 0) return;
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -5% 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Add a slight delay for each card to create a cascade effect
        const index = Array.from(domElements.cards).indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all cards
  domElements.cards.forEach(card => observer.observe(card));
}

// Neon effects for text and buttons
function initNeonEffects() {
  // Neon hover effect for cards
  domElements.cards?.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = 'var(--neon-box-shadow)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = 'none';
    });
  });
  
  // Random flicker effect for neon texts
  domElements.neonTexts?.forEach(text => {
    // Apply flicker to random elements
    if (Math.random() > 0.65) {
      text.classList.add('flicker');
      
      // Randomize flicker animation duration
      const duration = 2 + Math.random() * 3;
      text.style.animationDuration = `${duration}s`;
    }
  });
  
  // Enhanced neon button effects
  domElements.neonBtns?.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 0 10px var(--primary-color), 0 0 20px var(--primary-color)';
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'all 0.3s ease';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.boxShadow = 'var(--neon-box-shadow)';
      this.style.transform = 'scale(1)';
    });
  });
}

// Check browser compatibility
function checkCompatibility() {
  const supportsBackdropFilter = 'backdropFilter' in document.documentElement.style || 
                               '-webkit-backdrop-filter' in document.documentElement.style;
  
  // Fallback for browsers that don't support backdrop-filter
  if (!supportsBackdropFilter) {
    document.querySelectorAll('.music-player, header, nav').forEach(el => {
      el.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
    });
  }
}

// Smooth scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // Skip empty anchors
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = domElements.header ? domElements.header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Easter egg: Konami Code
function initKonamiCode() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  let lastKeyTime = 0;
  
  document.addEventListener('keydown', (e) => {
    const currentTime = Date.now();
    
    // Reset if too much time passed between keys
    if (currentTime - lastKeyTime > 2000) {
      konamiIndex = 0;
    }
    
    lastKeyTime = currentTime;
    
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      if (konamiIndex === konamiCode.length) {
        triggerKonamiEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
  
  function triggerKonamiEasterEgg() {
    // Activate easter egg
    document.body.classList.add('konami-activated');
    
    // Create visual effect
    const easterEgg = document.createElement('div');
    easterEgg.className = 'easter-egg';
    easterEgg.innerHTML = `
      <h2 class="neon-text">¡CÓDIGO KONAMI ACTIVADO!</h2>
      <p>¡Has encontrado un secreto!</p>
      <p>🎮 🕹️ 👾</p>
    `;
    document.body.appendChild(easterEgg);
    
    // Add sound effect
    const konamiSound = new Audio('audio/konami.mp3');
    konamiSound.volume = 0.5;
    konamiSound.play().catch(() => {
      // Handle autoplay block
      console.log('Konami sound effect blocked by browser');
    });
    
    // Remove after delay
    setTimeout(() => {
      easterEgg.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(easterEgg);
        document.body.classList.remove('konami-activated');
      }, 1000);
    }, 4000);
  }
}

// Add CSS styles for animations
function addAnimationStyles() {
  const animationStyle = document.createElement('style');
  animationStyle.textContent = `
    .card {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .card.in-view {
      opacity: 1;
      transform: translateY(0);
    }
    
    .neon-text.flicker {
      animation: flicker 3s infinite alternate;
    }
    
    @keyframes flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
        opacity: 1;
        text-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color);
      }
      20%, 24%, 55% {
        opacity: 0.5;
        text-shadow: none;
      }
    }
    
    .easter-egg {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
      z-index: 9999;
      animation: appear 0.5s ease;
      transition: opacity 1s ease;
      box-shadow: var(--neon-box-shadow);
    }
    
    @keyframes appear {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    .konami-activated .neon-text, .konami-activated .neon-btn {
      animation: rainbow 2s linear infinite;
    }
    
    @keyframes rainbow {
      0% { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
      17% { color: #ff8000; text-shadow: 0 0 10px #ff8000; }
      33% { color: #ffff00; text-shadow: 0 0 10px #ffff00; }
      50% { color: #00ff00; text-shadow: 0 0 10px #00ff00; }
      67% { color: #0000ff; text-shadow: 0 0 10px #0000ff; }
      83% { color: #8000ff; text-shadow: 0 0 10px #8000ff; }
      100% { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
    }
  `;
  document.head.appendChild(animationStyle);
}

// Add resize event listener
function initResizeHandler() {
  let resizeTimer;
  
  window.addEventListener('resize', () => {
    // Debounce the resize event
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Adjust music player on resize
      if (domElements.musicPlayer) {
        if (window.innerWidth <= 480) {
          domElements.musicPlayer.classList.add('minimized');
        } else {
          // Only expand on larger screens if it was minimized
          if (!backgroundMusic.paused) {
            domElements.musicPlayer.classList.remove('minimized');
          }
        }
      }
    }, 200);
  });
}

// Main initialization function
function init() {
  cacheElements();
  initPreloader();
  initHeaderScroll();
  initMobileMenu();
  initMusicPlayer();
  initAnimations();
  initNeonEffects();
  checkCompatibility();
  initSmoothScroll();
  initKonamiCode();
  addAnimationStyles();
  initResizeHandler();
  
  // Check for dark mode preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  }
  
  // Listen for dark mode changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    document.body.classList.toggle('dark-mode', e.matches);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
