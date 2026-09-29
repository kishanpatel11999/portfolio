document.getElementById('year').textContent = new Date().getFullYear();

const canvas = document.getElementById('signal-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && window.THREE && !reduceMotion) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / Math.max(window.innerHeight, 1), 0.1, 100);
  camera.position.z = 7;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const count = window.innerWidth < 700 ? 560 : 1050;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [new THREE.Color('#c8ff58'), new THREE.Color('#9d7cff'), new THREE.Color('#6e78ff')];
  for (let i = 0; i < count; i += 1) {
    const radius = 1.7 + Math.random() * 4.7;
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(theta) * radius + 0.7;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4.8;
    positions[i * 3 + 2] = Math.sin(theta) * radius - 1.5;
    const color = palette[i % palette.length];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 0.028, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
  const field = new THREE.Points(geometry, material);
  scene.add(field);

  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 2), new THREE.MeshBasicMaterial({ color: '#c8ff58', wireframe: true, transparent: true, opacity: 0.13 }));
  orb.position.set(1.8, -0.35, -1.3);
  scene.add(orb);

  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();
    field.rotation.y = t * 0.025;
    field.rotation.x = Math.sin(t * 0.12) * 0.04;
    orb.rotation.x = t * 0.12;
    orb.rotation.y = t * 0.18;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
} else if (canvas) {
  canvas.classList.add('fallback-canvas');
}

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.transform = `translate3d(${event.clientX - 140}px, ${event.clientY - 140}px, 0)`;
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('is-visible');
}), { threshold: 0.14 });
revealItems.forEach((item) => observer.observe(item));
