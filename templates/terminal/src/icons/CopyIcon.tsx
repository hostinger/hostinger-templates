type CopyIconProps = {
  copied?: boolean;
};

export const CopyIcon = ({ copied = false }: CopyIconProps) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    {copied ? (
      <path d="m5 12 4 4L19 6" />
    ) : (
      <>
        <rect x="8" y="8" width="11" height="11" />
        <path d="M16 8V5H5v11h3" />
      </>
    )}
  </svg>
);
