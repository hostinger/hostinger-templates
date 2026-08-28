type LightboxImage = {
  src: string;
  alt: string;
  caption: string;
};

const comparisons = document.querySelectorAll<HTMLElement>('[data-comparison]');

comparisons.forEach((comparison) => {
  const input = comparison.querySelector<HTMLInputElement>('input[type="range"]');
  if (!input) return;

  const update = () => {
    comparison.style.setProperty('--position', `${input.value}%`);
    input.setAttribute('aria-valuetext', `${input.value} percent after image`);
  };

  input.addEventListener('input', update);
  update();
});

const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
const triggers = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-lightbox-trigger]'),
);

if (dialog && triggers.length) {
  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]');
  const count = dialog.querySelector<HTMLElement>('[data-lightbox-count]');
  const dataNode = dialog.querySelector<HTMLElement>('[data-lightbox-data]');
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  const nextButton = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]');
  const previousButton = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
  const images = dataNode
    ? (JSON.parse(dataNode.textContent || '[]') as LightboxImage[])
    : [];
  let currentIndex = 0;
  let returnFocus: HTMLButtonElement | null = null;

  const render = () => {
    const current = images[currentIndex];
    if (!current || !image || !caption || !count) return;
    image.src = current.src;
    image.alt = current.alt;
    caption.textContent = current.caption;
    count.textContent = `${currentIndex + 1} / ${images.length}`;
  };

  const move = (step: number) => {
    currentIndex = (currentIndex + step + images.length) % images.length;
    render();
  };

  const close = () => dialog.close();

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      currentIndex = index;
      returnFocus = trigger;
      render();
      dialog.showModal();
      closeButton?.focus();
    });
  });

  closeButton?.addEventListener('click', close);
  nextButton?.addEventListener('click', () => move(1));
  previousButton?.addEventListener('click', () => move(-1));
  dialog.addEventListener('close', () => returnFocus?.focus());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  });
}

