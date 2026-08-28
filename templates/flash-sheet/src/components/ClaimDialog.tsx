import { useEffect, useRef } from 'react';
import { makeEnquiryUrl, site } from '../constants/content';
import type { FlashDesign } from '../types/content';

type ClaimDialogProps = {
  design: FlashDesign | null;
  onClose: () => void;
};

export function ClaimDialog({ design, onClose }: ClaimDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (design && dialog && !dialog.open) dialog.showModal();
    if (!design && dialog?.open) dialog.close();
  }, [design]);

  return (
    <dialog className="claim-dialog" ref={dialogRef} onClose={onClose}>
      {design && (
        <div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close enquiry">×</button>
          <p className="kicker">No payment taken</p>
          <h2>Enquire about<br />{design.name}</h2>
          <p>
            This opens your email app with the piece, size, placement and guide price already filled in.
            Sending it asks about availability—it does not reserve the design.
          </p>
          <dl className="dialog-details">
            <div><dt>Size</dt><dd>{design.size}</dd></div>
            <div><dt>Guide price</dt><dd>{design.price}</dd></div>
          </dl>
          <a className="primary-button" href={makeEnquiryUrl(design)}>Open filled enquiry ↗</a>
          <small>To: {site.email}</small>
        </div>
      )}
    </dialog>
  );
}
