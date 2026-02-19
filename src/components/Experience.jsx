import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './Experience.css';

const Experience = () => {
    const experiences = [
        {
            role: "Cloud Engineer",
            company: "CGI Inc",
            duration: "Oct 2024 - Present",
            description: "Automated AWS GovCloud infrastructure using Terraform and Ansible, cutting provisioning time by 50%. Administered and automated AWS environments (EKS, ECS, API Gateway, CloudTrail), achieving 99.99% uptime.",
            tech: ["AWS GovCloud", "Terraform", "Jenkins", "EKS", "Ansible"],
            logo: <Building2 className="company-logo" size={24} />
        },
        {
            role: "Cloud Engineer",
            company: "Kingstone Insurance Company",
            duration: "Mar 2024 - Oct 2024",
            description: "Led Tier 3 cloud operations for 200+ production workloads. Engineered microservices migration to AWS EKS using Kubernetes and Helm. Orchestrated enterprise-wide Disaster Recovery strategy leveraging AWS DRS.",
            tech: ["AWS EKS", "Terraform", "Kubernetes", "Splunk", "AWS DRS"],
            logo: <Building2 className="company-logo" size={24} />
        },
        {
            role: "Cloud Engineer",
            company: "Patterson-UTI Management Services",
            duration: "May 2021 - Nov 2023",
            description: "Architected multi-region AWS infrastructure using Terraform and CloudFormation, enabling high availability. Delivered Tier 3 support for 150+ AWS-hosted enterprise systems.",
            tech: ["AWS", "Terraform", "CloudFormation", "CloudWatch", "Splunk"],
            logo: <Building2 className="company-logo" size={24} />
        }
    ];

    return (
        <section id="experience" className="experience">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    Experience
                </motion.h2>
                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            className="timeline-item"
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, type: "spring", delay: 0.1 * index }}
                        >
                            <div className="timeline-dot"></div>
                            <div className="timeline-content glass-panel">
                                <span className="timeline-date text-gradient">{exp.duration}</span>
                                <div className="timeline-header">
                                    {exp.logo}
                                    <div>
                                        <h3 className="timeline-role">{exp.role}</h3>
                                        <h4 className="timeline-company">{exp.company}</h4>
                                    </div>
                                </div>
                                <p className="timeline-desc">{exp.description}</p>
                                <div className="timeline-tech">
                                    {exp.tech.map((tech, i) => (
                                        <span key={i} className="tech-badge">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
