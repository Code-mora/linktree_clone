// Magnetic Hover Effect for Avatar (Desktop & Mobile)
document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.querySelector('.avatar');
    
    if (!avatar) return;
    
    let isUsingGyroscope = false;
    
    // ========== DESKTOP: Mouse Tracking ==========
    avatar.addEventListener('mousemove', function(e) {
        if (isUsingGyroscope) return; // Skip if gyroscope is active
        
        const rect = avatar.getBoundingClientRect();
        const avatarCenterX = rect.left + rect.width / 2;
        const avatarCenterY = rect.top + rect.height / 2;
        
        // Calculate mouse position relative to avatar center
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate offset from center (normalized to -1 to 1)
        const offsetX = (mouseX - avatarCenterX) / (rect.width / 2);
        const offsetY = (mouseY - avatarCenterY) / (rect.height / 2);
        
        // Apply 3D tilt based on mouse position
        const rotateY = offsetX * 15; // Max 15deg rotation
        const rotateX = -offsetY * 15; // Negative for natural tilt
        
        // Apply transform
        avatar.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    // Reset on mouse leave
    avatar.addEventListener('mouseleave', function() {
        if (isUsingGyroscope) return;
        avatar.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
    
    // ========== MOBILE: Touch Tracking ==========
    avatar.addEventListener('touchmove', function(e) {
        e.preventDefault(); // Prevent scrolling while touching avatar
        
        const touch = e.touches[0];
        const rect = avatar.getBoundingClientRect();
        const avatarCenterX = rect.left + rect.width / 2;
        const avatarCenterY = rect.top + rect.height / 2;
        
        // Calculate touch position relative to avatar center
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        
        // Calculate offset from center
        const offsetX = (touchX - avatarCenterX) / (rect.width / 2);
        const offsetY = (touchY - avatarCenterY) / (rect.height / 2);
        
        // Apply 3D tilt
        const rotateY = offsetX * 20; // Slightly more rotation for touch
        const rotateX = -offsetY * 20;
        
        avatar.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    });
    
    // Reset on touch end
    avatar.addEventListener('touchend', function() {
        if (!isUsingGyroscope) {
            avatar.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        }
    });
    
    // ========== MOBILE: Gyroscope/Device Orientation (PREMIUM FEATURE!) ==========
    // Request permission for iOS 13+ devices
    function requestMotionPermission() {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        enableGyroscope();
                    }
                })
                .catch(console.error);
        } else {
            // Android or older iOS - no permission needed
            enableGyroscope();
        }
    }
    
    function enableGyroscope() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
            isUsingGyroscope = true;
        }
    }
    
    function handleOrientation(event) {
        // beta: front-to-back tilt (X axis) - range: -180 to 180
        // gamma: left-to-right tilt (Y axis) - range: -90 to 90
        
        const beta = event.beta;   // X axis rotation
        const gamma = event.gamma; // Y axis rotation
        
        if (beta === null || gamma === null) return;
        
        // Normalize values for subtle effect
        // Limit to reasonable range for natural look
        const maxTilt = 30; // degrees
        const rotateX = Math.max(-maxTilt, Math.min(maxTilt, beta - 90)) * 0.5; // Center around 90deg (landscape hold)
        const rotateY = Math.max(-maxTilt, Math.min(maxTilt, gamma)) * 0.5;
        
        avatar.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Auto-enable gyroscope on mobile devices (detect by touch support)
    if ('ontouchstart' in window) {
        // For iOS 13+, need user interaction first
        avatar.addEventListener('touchstart', function enableOnFirstTouch() {
            requestMotionPermission();
            avatar.removeEventListener('touchstart', enableOnFirstTouch);
        }, { once: true });
    }
});
