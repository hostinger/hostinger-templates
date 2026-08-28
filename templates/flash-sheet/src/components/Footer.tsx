import { site } from '../constants/content';

export function Footer() {
  return (
    <footer className="footer" id="studio">
      <div>
        <p className="kicker">Blackwork · oddities · botanicals</p>
        <h2>Come as you are.<br />Leave with a story.</h2>
      </div>
      <div className="footer-details">
        <p>{site.address}</p>
        <p>{site.hours}</p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">{site.instagram}</a>
      </div>
      <p className="footer-mark">BT<br />✦<br />25</p>
    </footer>
  );
}
