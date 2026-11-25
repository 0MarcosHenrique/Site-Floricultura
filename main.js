const nav = document.querySelector('.floating-nav');
const links = [...nav.querySelectorAll('a[href^="#"]')];
const sections = links.map((link) => document.querySelector(link.getAttribute('href')));
let scheduled = false;

function updateCurrentSection() {
  const readingLine = window.innerHeight * 0.45;
  let current = sections[0];

  for (const section of sections) {
    if (section.getBoundingClientRect().top <= readingLine) current = section;
  }

  nav.dataset.current = current.id;
  for (const link of links) {
    if (link.getAttribute('href') === `#${current.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  scheduled = false;
}

function scheduleUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateCurrentSection);
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
updateCurrentSection();


const arrangementTrack = document.querySelector('.arrangements-track');
const arrangementCards = [...arrangementTrack.querySelectorAll('.arrangement-card')];
const previousArrangement = document.querySelector('[data-carousel-prev]');
const nextArrangement = document.querySelector('[data-carousel-next]');
const currentArrangement = document.querySelector('[data-carousel-current]');
let activeArrangement = 0;
let carouselScheduled = false;

function updateArrangementControls() {
  const trackLeft = arrangementTrack.getBoundingClientRect().left;
  let closestDistance = Infinity;

  arrangementCards.forEach((card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
    if (distance < closestDistance) {
      closestDistance = distance;
      activeArrangement = index;
    }
  });

  currentArrangement.textContent = String(activeArrangement + 1).padStart(2, '0');
  previousArrangement.disabled = activeArrangement === 0;
  nextArrangement.disabled = activeArrangement === arrangementCards.length - 1;
  carouselScheduled = false;
}

function goToArrangement(index) {
  const target = arrangementCards[Math.max(0, Math.min(index, arrangementCards.length - 1))];
  const left = target.offsetLeft - arrangementCards[0].offsetLeft;
  arrangementTrack.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

previousArrangement.addEventListener('click', () => goToArrangement(activeArrangement - 1));
nextArrangement.addEventListener('click', () => goToArrangement(activeArrangement + 1));
arrangementTrack.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    goToArrangement(activeArrangement + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
arrangementTrack.addEventListener('scroll', () => {
  if (carouselScheduled) return;
  carouselScheduled = true;
  requestAnimationFrame(updateArrangementControls);
}, { passive: true });
window.addEventListener('resize', updateArrangementControls);
updateArrangementControls();
