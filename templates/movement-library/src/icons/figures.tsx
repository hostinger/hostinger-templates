import type { ReactNode } from 'react';

/**
 * Original line-figure illustrations, one per exercise. Each drawing keeps
 * the same visual grammar: a 120×120 viewBox, round-capped ink strokes for
 * the body, thinner faded strokes for props (walls, chairs, door frames),
 * and green "fig-accent" strokes for the direction of movement.
 */

type FigureProps = {
  className?: string;
};

type FigureBaseProps = FigureProps & {
  children: ReactNode;
};

const FigureBase = ({ children, className }: FigureBaseProps) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    {children}
  </svg>
);

const Ground = ({ d }: { d: string }) => (
  <path d={d} className="fig-ground" stroke="currentColor" strokeWidth={3} />
);

const Body = ({ children }: { children: ReactNode }) => (
  <g stroke="currentColor" strokeWidth={5}>
    {children}
  </g>
);

const Prop = ({ children }: { children: ReactNode }) => (
  <g className="fig-prop" stroke="currentColor" strokeWidth={3.5}>
    {children}
  </g>
);

const Accent = ({ children }: { children: ReactNode }) => (
  <g className="fig-accent" strokeWidth={4} stroke="currentColor">
    {children}
  </g>
);

const ChinTuckFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Prop>
      <circle cx="79" cy="36" r="10" strokeDasharray="4 6" />
    </Prop>
    <Body>
      <circle cx="52" cy="34" r="10" />
      <path d="M50 45c-2 14-2 28 0 43" />
      <path d="M51 64h34" />
    </Body>
    <Accent>
      <path d="M88 14H60" />
      <path d="m67 7-8 7 8 7" />
    </Accent>
  </FigureBase>
);

const NeckSideStretchFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Body>
      <circle cx="70" cy="42" r="10" />
      <path d="M61 70l4-19" />
      <path d="M32 72h56" />
      <path d="M60 72v26" />
      <path d="M32 72l-5 22" />
      <path d="M88 72c9-17 3-32-9-38" />
    </Body>
    <Accent>
      <path d="M40 26c8-10 21-13 32-7" strokeDasharray="2 7" />
      <path d="m72 20-9-1" />
      <path d="m72 20-1-9" />
    </Accent>
  </FigureBase>
);

const WallSlideFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Ground d="M26 106h68" />
    <Body>
      <circle cx="60" cy="26" r="10" />
      <path d="M60 36v42" />
      <path d="M60 78 48 104" />
      <path d="M60 78l12 26" />
      <path d="M60 46 42 54 38 34" />
      <path d="M60 46l18 8 4-20" />
    </Body>
    <Accent>
      <path d="M34 28 28 12" strokeDasharray="1 7" />
      <path d="m23 19 5-8 6 6" />
      <path d="m86 28 6-16" strokeDasharray="1 7" />
      <path d="m86 17 6-8 5 9" />
    </Accent>
  </FigureBase>
);

const DoorwayChestStretchFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Prop>
      <path d="M24 108V14h72v94" />
    </Prop>
    <Body>
      <circle cx="60" cy="31" r="9" />
      <path d="M60 40v34" />
      <path d="M60 48 42 44 32 24" />
      <path d="m60 48 18-4 10-20" />
      <path d="M60 74 46 92l-2 14" />
      <path d="m60 74 14 20 6 12" />
    </Body>
    <Accent>
      <path d="M46 56c-3 5-3 9 0 14" />
      <path d="M74 56c3 5 3 9 0 14" />
    </Accent>
  </FigureBase>
);

const CatCamelFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Ground d="M16 100h88" />
    <Body>
      <circle cx="26" cy="64" r="9" />
      <path d="M36 66c8-16 32-16 42 0" />
      <path d="M37 68 35 96" />
      <path d="M79 68l3 28" />
      <path d="M82 96H70" />
    </Body>
    <Prop>
      <path d="M36 66c10 12 32 12 42 0" strokeDasharray="4 6" />
    </Prop>
    <Accent>
      <path d="M57 42V26" />
      <path d="m51 32 6-7 6 7" />
      <path d="M57 84v16" />
      <path d="m51 94 6 7 6-7" />
    </Accent>
  </FigureBase>
);

const BirdDogFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Ground d="M28 98h64" />
    <Body>
      <circle cx="36" cy="57" r="9" />
      <path d="M44 62l31 4" />
      <path d="M48 66 46 96" />
      <path d="M75 68l-2 28" />
      <path d="M73 96H61" />
      <path d="M44 63 16 57" />
      <path d="m75 66 29-8" />
    </Body>
    <Accent>
      <path d="m22 44-10 3 4 10" />
      <path d="m100 44 10 4-5 9" />
    </Accent>
  </FigureBase>
);

const GluteBridgeFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Ground d="M12 102h96" />
    <Body>
      <circle cx="20" cy="91" r="9" />
      <path d="M30 96l36-24" />
      <path d="M66 72l18 12" />
      <path d="M84 84l2 16" />
      <path d="M80 100h14" />
      <path d="M34 96l16 2" />
    </Body>
    <Accent>
      <path d="M62 58V40" />
      <path d="m55 48 7-9 7 9" />
    </Accent>
  </FigureBase>
);

const HipFlexorStretchFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Ground d="M14 104h92" />
    <Body>
      <circle cx="55" cy="34" r="9" />
      <path d="M58 74l-2-31" />
      <path d="M58 74 34 78l-4 24" />
      <path d="M26 102h12" />
      <path d="m58 74 22 28" />
      <path d="m80 102 20-3" />
      <path d="M57 52l-11 14" />
    </Body>
    <Accent>
      <path d="M52 88H34" />
      <path d="m41 81-8 7 8 7" />
    </Accent>
  </FigureBase>
);

const SitToStandFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Ground d="M14 104h92" />
    <Prop>
      <path d="M68 76h28" />
      <path d="M72 76v28" />
      <path d="M92 76v28" />
      <path d="M96 76 99 46" />
    </Prop>
    <Body>
      <circle cx="42" cy="37" r="9" />
      <path d="M66 72 48 46" />
      <path d="M66 72 50 78" />
      <path d="M50 78l-4 26" />
      <path d="M40 104h12" />
      <path d="M56 58 34 62" />
    </Body>
    <Accent>
      <path d="M32 30 20 16" />
      <path d="M20 26V15h11" />
    </Accent>
  </FigureBase>
);

const HeelRaiseFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Ground d="M24 106h82" />
    <Prop>
      <path d="M30 14v76" />
    </Prop>
    <Body>
      <circle cx="64" cy="22" r="9" />
      <path d="M64 31v39" />
      <path d="M64 44 36 48" />
      <path d="M63 70l-4 24" />
      <path d="M67 70l-1 24" />
      <path d="m59 94 10 10" />
      <path d="m66 94 10 10" />
    </Body>
    <Accent>
      <path d="M46 98V80" />
      <path d="m39 88 7-9 7 9" />
    </Accent>
  </FigureBase>
);

const FallbackFigure = ({ className }: FigureProps) => (
  <FigureBase className={className}>
    <Ground d="M22 106h76" />
    <Body>
      <circle cx="60" cy="26" r="10" />
      <path d="M60 36v40" />
      <path d="M60 76 46 104" />
      <path d="m60 76 14 28" />
      <path d="M60 48 38 58" />
      <path d="m60 48 22 10" />
    </Body>
  </FigureBase>
);

const EXERCISE_FIGURES: Record<string, (props: FigureProps) => ReactNode> = {
  'chin-tuck': ChinTuckFigure,
  'neck-side-stretch': NeckSideStretchFigure,
  'wall-slide': WallSlideFigure,
  'doorway-chest-stretch': DoorwayChestStretchFigure,
  'cat-camel': CatCamelFigure,
  'bird-dog': BirdDogFigure,
  'glute-bridge': GluteBridgeFigure,
  'hip-flexor-stretch': HipFlexorStretchFigure,
  'sit-to-stand': SitToStandFigure,
  'heel-raise': HeelRaiseFigure,
};

type ExerciseFigureProps = FigureProps & {
  figure: string;
};

export const ExerciseFigure = ({ figure, className }: ExerciseFigureProps) => {
  const Figure = EXERCISE_FIGURES[figure] ?? FallbackFigure;

  return <Figure className={className} />;
};
