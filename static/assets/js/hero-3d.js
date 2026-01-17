document.addEventListener("DOMContentLoaded", () => {
    // Only run on homepage
    if (window.location.pathname !== "/" && window.location.pathname !== "/index.html") {
        const container = document.getElementById("hero-3d");
        if (container) container.style.display = 'none';
        return;
    }

    const container = document.getElementById("hero-3d");
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Starscape Geometry - Pure White Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const posArray = new Float32Array(starsCount * 3);

    for(let i = 0; i < starsCount * 3; i+=3) {
        // Cylinder-like distribution for tunnel effect
        const theta = Math.random() * Math.PI * 2;
        const radius = 200 + Math.random() * 800;
        posArray[i] = Math.cos(theta) * radius;
        posArray[i+1] = Math.sin(theta) * radius;
        posArray[i+2] = (Math.random() - 0.5) * 6000; // Long depth
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 2,
        color: 0xffffff, // Pure white
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    camera.position.z = 1000;

    // Infinite Scroll - Auto-movement
    let speed = 2; // Base speed
    let scrollBoost = 0;

    window.addEventListener('scroll', () => {
        // Scroll boosts speed
        scrollBoost = window.scrollY * 0.01;
    });

    // Animation Loop - Continuously fly through stars
    const animate = () => {
        requestAnimationFrame(animate);

        // Move camera forward (or starfield backward)
        starField.position.z += speed + scrollBoost;

        // Reset stars when they pass behind camera (infinite loop)
        if (starField.position.z > 3000) {
            starField.position.z = 0;
        }

        // Subtle rotation for elegance
        starField.rotation.z += 0.0001;

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
