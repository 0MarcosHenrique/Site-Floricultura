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
let activeArrangement = 0;
let carouselScheduled = false;

function updateArrangementControls() {
  const previousIndex = activeArrangement;
  const trackLeft = arrangementTrack.getBoundingClientRect().left;
  let closestDistance = Infinity;

  arrangementCards.forEach((card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
    if (distance < closestDistance) {
      closestDistance = distance;
      activeArrangement = index;
    }
  });

  if (previousIndex !== activeArrangement) {
    arrangementCards[previousIndex].classList.remove('bouquet-entering');
    arrangementCards[activeArrangement].classList.add('bouquet-entering');
  }

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

// Preencher com DDI + DDD + número quando o WhatsApp da Floria for definido.
const FLORIA_WHATSAPP = '';
let selectedArrangement = '';
const chosenArrangement = document.querySelector('.chosen-arrangement');
const envelopeBouquet = document.querySelector('.envelope-flowers img');
const selectedName = document.querySelector('[data-selected-name]');
const whatsappButton = document.querySelector('[data-whatsapp]');

document.querySelectorAll('[data-arrangement]').forEach((link) => {
  link.addEventListener('click', () => {
    selectedArrangement = link.dataset.arrangement;
    selectedName.textContent = selectedArrangement;
    envelopeBouquet.src = link.closest('.arrangement-card').querySelector('.arrangement-image img').src;
    chosenArrangement.hidden = false;
  });
});

if (/^\d{10,15}$/.test(FLORIA_WHATSAPP)) {
  whatsappButton.disabled = false;
  whatsappButton.addEventListener('click', () => {
    const message = selectedArrangement
      ? `Olá, Beatriz! Gostaria de saber mais sobre o arranjo ${selectedArrangement}. Podemos conversar sobre valores e disponibilidade?`
      : 'Olá, Beatriz! Conheci a Floria pelo site e gostaria de escolher um arranjo. Podemos conversar?';
    window.open(`https://wa.me/${FLORIA_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

// Anima cada bloco apenas na primeira vez em que aparece na tela.
if ('IntersectionObserver' in window) {
  const entryObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-entering');
        entryObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.arrangements-heading, .about-portrait, .about-copy, .occasion-heading, .occasion-covers li, .vase-scene, .note-copy, .note-studio'
  ).forEach((block) => entryObserver.observe(block));
}

// Cada ocasião aponta para o próprio arranjo da galeria.
document.querySelectorAll('[data-gallery-choice]').forEach((link) => {
  link.addEventListener('click', () => {
    const index = arrangementCards.findIndex((card) =>
      card.querySelector('[data-arrangement]').dataset.arrangement === link.dataset.galleryChoice
    );
    if (index >= 0) goToArrangement(index);
  });
});

// O destaque acompanha aria-current, inclusive ao navegar com o teclado.
for (const link of links) {
  const flower = document.createElement('span');
  flower.className = 'nav-flower';
  flower.setAttribute('aria-hidden', 'true');
  for (let petal = 0; petal < 5; petal++) {
    const leaf = document.createElement('i');
    leaf.style.setProperty('--turn', petal * 72 + 'deg');
    flower.append(leaf);
  }
  link.prepend(flower);
}
