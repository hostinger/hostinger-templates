import boilerServiceImage from '../assets/images/boiler-service.jpg';
import pipeInstallationImage from '../assets/images/pipe-installation.jpg';

export const WorkGallery = () => (
  <section className="work-gallery" aria-labelledby="work-gallery-title">
    <div className="gallery-heading">
      <span className="kicker">On the job</span>
      <h2 id="work-gallery-title">Careful work.<br />Built to last.</h2>
      <p>
        We show up prepared, protect your home, and leave everything tidy when
        the job is done.
      </p>
    </div>

    <figure className="gallery-photo gallery-photo-large">
      <img
        alt="Plumber fitting metal pipes"
        src={pipeInstallationImage}
      />
      <figcaption>Pipework & installations</figcaption>
    </figure>

    <figure className="gallery-photo gallery-photo-small">
      <img
        alt="Technician servicing a boiler"
        src={boilerServiceImage}
      />
      <figcaption>Boiler servicing</figcaption>
    </figure>
  </section>
);
