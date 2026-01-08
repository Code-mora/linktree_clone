// Magnetic Hover Effect for Avatar
document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.querySelector('.avatar');
    
    if (!avatar) return;
    
    // Track mouse movement on avatar
    avatar.addEventListener('mousemove', function(e) {
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
        // Limit rotation to make it subtle but noticeable
        const rotateY = offsetX * 15; // Max 15deg rotation
        const rotateX = -offsetY * 15; // Negative for natural tilt
        
        // Apply transform with smooth transition
        avatar.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    // Reset on mouse leave
    avatar.addEventListener('mouseleave', function() {
        avatar.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
});
