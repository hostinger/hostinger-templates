<script lang="ts">
  import type { BookMeta } from '../lib/types';

  interface Props {
    book: BookMeta;
  }

  const { book }: Props = $props();
</script>

<figure
  class="cover"
  role="img"
  aria-label={`Front cover of ${book.title}, ${book.coverSubtitle.toLowerCase()} by ${book.author}`}
>
  <div class="cover__board" aria-hidden="true">
    <span class="cover__spine">{book.title}</span>
    <div class="cover__face">
      <p class="cover__imprint">{book.imprint}</p>
      <p class="cover__title">{book.title}</p>
      <p class="cover__subtitle">{book.coverSubtitle}</p>
      <svg class="cover__art" viewBox="0 0 220 150" role="presentation" focusable="false">
        <defs>
          <clipPath id="cover-water">
            <rect x="0" y="85" width="220" height="65" />
          </clipPath>
        </defs>
        <g
          fill="none"
          stroke="var(--cover-ivory)"
          stroke-width="1.8"
          stroke-linejoin="round"
          stroke-linecap="round"
          transform="rotate(-3 110 84)"
        >
          <path d="M96 84 L110 30 L124 84" />
          <path d="M104 62 h12" />
          <path d="M101 72 h18" />
          <path d="M110 30 V17" />
          <path d="M110 18 l10 3.2 -10 3.2 Z" />
        </g>
        <path d="M6 84 H214" stroke="var(--cover-brass)" stroke-width="2" fill="none" />
        <g clip-path="url(#cover-water)" fill="none" stroke="var(--cover-ivory)" stroke-width="1.5">
          <path d="M110 86 L100 122 M110 86 L120 122" opacity="0.32" stroke-dasharray="3 4" />
          <ellipse cx="110" cy="89" rx="16" ry="3.4" opacity="0.5" />
          <ellipse cx="110" cy="93" rx="32" ry="5.5" opacity="0.36" />
          <ellipse cx="110" cy="98" rx="53" ry="8" opacity="0.25" />
          <ellipse cx="110" cy="104" rx="78" ry="11" opacity="0.16" />
        </g>
      </svg>
      <p class="cover__author">{book.author}</p>
    </div>
  </div>
</figure>
