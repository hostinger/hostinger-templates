import type { ComponentDoc } from '../types/content';

/**
 * The documented kit. Each entry drives one component page: the playground
 * controls, the generated snippet, the prop table, and the usage notes.
 *
 * `initial` is where the playground starts; `default` is the component's real
 * default (omitted from snippets when the value matches). Required props have
 * no default and always appear in the snippet.
 */
export const components: ComponentDoc[] = [
  {
    id: 'button',
    name: 'Button',
    tag: 'VButton',
    kicker: 'Actions',
    summary:
      'One action per screen gets the primary variant. Everything else steps back.',
    intro:
      'The only element the kit fills with the accent color. Three variants cover every case we have met: primary for the single loudest action on a screen, secondary for the actions beside it, and ghost for controls inside dense chrome.',
    slotText: 'Save changes',
    guidance: [
      'One primary per view. If two actions compete, one of them is secondary.',
      'Ghost belongs inside toolbars and card corners — never as the main call to action.',
      'Disabled is a state, not a decoration: pair it with a hint that says how to unlock the action.',
    ],
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost'",
        control: 'select',
        options: ['primary', 'secondary', 'ghost'],
        default: 'primary',
        initial: 'primary',
        description:
          'Visual weight. Primary is filled with the accent, secondary is an inked outline, ghost stays quiet until hovered.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        control: 'select',
        options: ['sm', 'md', 'lg'],
        default: 'md',
        initial: 'md',
        description:
          'Control height — 32, 40, or 48 px. Neighbouring buttons always share one size.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        control: 'toggle',
        default: false,
        initial: false,
        description:
          'Blocks the action and removes the button from the tab order. The label stays readable.',
      },
    ],
  },
  {
    id: 'input',
    name: 'Input',
    tag: 'VInput',
    kicker: 'Forms',
    summary:
      'A labelled text field whose state is spelled out — never color alone.',
    intro:
      'One field, one visible label, one line of feedback. State changes the focus ring, the hint color, and the hint marker together, so error and success still read in grayscale — and screen readers hear what changed.',
    guidance: [
      'Write hints that say what fixes the field, not what went wrong.',
      'Success is for verified values — an address that passed a check — not for merely non-empty ones.',
      'Keep labels under four words and move everything else into the hint.',
    ],
    props: [
      {
        name: 'label',
        type: 'string',
        control: 'text',
        required: true,
        initial: 'Work email',
        description:
          'Visible label above the field. Required — placeholder text is not a label.',
      },
      {
        name: 'state',
        type: "'default' | 'error' | 'success'",
        control: 'select',
        options: ['default', 'error', 'success'],
        default: 'default',
        initial: 'default',
        description:
          'Feedback state. Error marks the field invalid for assistive tech; success confirms without shouting.',
      },
      {
        name: 'hint',
        type: 'string',
        control: 'text',
        default: '',
        initial: 'We only email receipts.',
        description:
          'One line under the field. In the error state, write the fix; leave empty to render nothing.',
      },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    tag: 'VCard',
    kicker: 'Layout',
    summary:
      'A bordered surface for one subject. Elevation is earned, not default.',
    intro:
      'The kit’s only container: flat by default with a hairline border. Elevation is reserved for surfaces that genuinely float above the page — pickers, previews, confirmations — and padding has three stops chosen by density, not taste.',
    slotPlaceholder: '<!-- your content -->',
    stageBody:
      'Sent 4 Aug · due 18 Aug. Autopay clears it two days early, so nobody has to remember.',
    guidance: [
      'Cards do not nest. If a card wants a card inside it, the inner one is a list row.',
      'Elevation means overlap, not importance — a grid of elevated cards is a grid of shouting.',
      'An empty title removes the header row entirely; the body starts at the top edge.',
    ],
    props: [
      {
        name: 'title',
        type: 'string',
        control: 'text',
        default: '',
        initial: 'Quarterly invoice',
        description:
          'Optional header row above the body, separated by a hairline. Empty means no header.',
      },
      {
        name: 'padding',
        type: "'sm' | 'md' | 'lg'",
        control: 'select',
        options: ['sm', 'md', 'lg'],
        default: 'md',
        initial: 'md',
        description:
          'Inner spacing for header and body — 14, 20, or 28 px. Pick per screen density.',
      },
      {
        name: 'elevated',
        type: 'boolean',
        control: 'toggle',
        default: false,
        initial: true,
        description:
          'Adds the kit’s single shadow. Use it for surfaces that overlap the page, never for emphasis.',
      },
    ],
  },
];
