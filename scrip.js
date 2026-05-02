const images = document.querySelectorAll('.hero-gallery img');
let current = 0;

// Rotación automática cada 3 segundos
function showNextImage() {
  images[current].classList.remove('active');
  current = (current + 1) % images.length;
  images[current].classList.add('active');
}
setInterval(showNextImage, 3000);

// Hacer las imágenes clickeables
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    // Redirigir a secciones específicas
    if(index === 0) window.location.href = "#servicios";
    if(index === 1) window.location.href = "#reservar";
    if(index === 2) window.location.href = "#contacto";
    if(index === 3) window.location.href = "#boutique";
  });
});
