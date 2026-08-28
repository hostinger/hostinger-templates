import { BUSINESS } from '../constants/business';

type BrandProps = {
  footer?: boolean;
};

export const Brand = ({ footer = false }: BrandProps) => (
  <a
    aria-label={`${BUSINESS.name} home`}
    className={`brand${footer ? ' brand-footer' : ''}`}
    href="#top"
  >
    <span className="brand-mark">
      <span />
    </span>
    <span className="brand-name">
      Copper <i>&</i> Co.
    </span>
    <span className="brand-trade">{BUSINESS.trade}</span>
  </a>
);
