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
