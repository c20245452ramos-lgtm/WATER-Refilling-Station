gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const html = document.documentElement;
  const darkModeToggle = document.getElementById('darkModeToggle');

  if (localStorage.getItem('pureflow-dark') === 'true') {
    html.classList.add('dark');
  }

  darkModeToggle?.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('pureflow-dark', html.classList.contains('dark'));
  });

  const replayBtn = document.getElementById('replayBtn');
  let introTimeline;

  replayBtn?.addEventListener('click', () => {
    introTimeline?.restart();
  });

  gsap.set('#scroll-bar', { scaleX: 0 });

  gsap.matchMedia().add(
    {
      reduceMotion: '(prefers-reduced-motion: reduce)',
      fullMotion: '(prefers-reduced-motion: no-preference)'
    },
    ({ conditions }) => {
      if (conditions.reduceMotion) {
        gsap.set('.reveal', { clearProps: 'all' });
        return;
      }

      // power2.out decelerates the intro smoothly instead of stopping abruptly.
      introTimeline = gsap.timeline({ defaults: { duration: 0.55, ease: 'power2.out' } });
      introTimeline
        .from('.brand', { y: -24, opacity: 0 })
        .from('.nav-link', { y: -16, opacity: 0, stagger: 0.1 }, '-=0.3')
        .from('.hero-copy h1', { y: 24, opacity: 0 })
        .from('.hero-copy p', { y: 16, opacity: 0 }, '-=0.3')
        .from('.cta-row > *', { y: 16, opacity: 0, stagger: 0.1 }, '-=0.3');

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      gsap.to('#scroll-bar', {
        scaleX: 1,
        
        ease: 'none',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
    }
  );
});