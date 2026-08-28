import { BUSINESS, SERVICES } from '../constants/business';
import { ArrowIcon, ServiceIcon } from '../icons';
import type { Service } from '../types/business';

const ServiceCard = ({ service }: { service: Service }) => (
  <article className="service-card">
    <span className="service-number">{service.number}</span>
    <div className="service-icon">
      <ServiceIcon name={service.icon} />
    </div>
    <h3>{service.title}</h3>
    <p>{service.description}</p>
    <a
      aria-label={`Call about ${service.title}`}
      href={BUSINESS.phoneHref}
    >
      Ask about this <ArrowIcon />
    </a>
  </article>
);

export const Services = () => (
  <section className="services" id="services">
    <div className="section-heading">
      <span className="kicker">What we fix</span>
      <h2>
        Small drip. Big emergency.
        <br />
        We’ve got it.
      </h2>
    </div>
    <div className="service-grid">
      {SERVICES.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  </section>
);
