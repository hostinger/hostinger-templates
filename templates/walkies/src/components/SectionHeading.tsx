import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  id?: string;
  as?: 'h1' | 'h2';
  children?: ReactNode;
}

export function SectionHeading({ eyebrow, title, id, as: Heading = 'h2', children }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <Heading id={id} className="section-heading__title">
        {title}
      </Heading>
      {children}
    </div>
  );
}
