import { Award } from 'lucide-react';
import './Certifications.css';

const Certifications = () => {
    const certs = [
        {
            name: "HashiCorp Certified: Terraform Associate",
            issuer: "HashiCorp",
            date: "Mar 2025",
            icon: <Award size={40} className="cert-icon-svg" />
        },
        {
            name: "AWS Certified Developer – Associate",
            issuer: "Amazon Web Services",
            date: "Feb 2025",
            icon: <Award size={40} className="cert-icon-svg" />
        },
        {
            name: "AWS Certified SysOps Administrator – Associate",
            issuer: "Amazon Web Services",
            date: "Mar 2024",
            icon: <Award size={40} className="cert-icon-svg" />
        },
        {
            name: "AWS Certified Solutions Architect – Associate",
            issuer: "Amazon Web Services",
            date: "Feb 2021",
            icon: <Award size={40} className="cert-icon-svg" />
        },
        {
            name: "AWS Certified Cloud Practitioner",
            issuer: "Amazon Web Services",
            date: "Mar 2021",
            icon: <Award size={40} className="cert-icon-svg" />
        }
    ];

    return (
        <section id="certifications" className="certifications">
            <div className="container">
                <h2 className="section-title">Certifications</h2>
                <div className="certs-grid">
                    {certs.map((cert, index) => (
                        <div key={index} className="cert-card glass-panel">
                            <div className="cert-icon">{cert.icon}</div>
                            <div className="cert-info">
                                <h3>{cert.name}</h3>
                                <p>{cert.issuer}</p>
                                <span className="cert-date text-gradient">{cert.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
