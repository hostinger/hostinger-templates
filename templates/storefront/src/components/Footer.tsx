import Link from "next/link";
import site from "@/content/site.json";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-mark">KADO<span>物</span></p>
        <p className="footer-line">Objects that earn their place.</p>
      </div>
      <div className="footer-meta">
        <p>{site.location}</p>
        <a href={`mailto:${site.enquiryEmail}`}>{site.enquiryEmail}</a>
        <Link href="/#objects">Catalogue index</Link>
      </div>
      <p className="footer-copyright">© 2026 Kado Objects</p>
    </footer>
  );
}
