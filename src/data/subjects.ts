export interface Subject {
  id: string;
  title: string;
  description: string;
  overview: string;
  icon: string;
}

export const subjects: Subject[] = [
  {
    id: 'devops',
    title: 'DevOps & Infrastructure',
    description: 'Exploring containerization, CI/CD pipelines, and infrastructure automation.',
    icon: '🚀',
    overview: `
      <h2>About DevOps</h2>
      <p>DevOps combines software development and IT operations to shorten the development lifecycle and deliver high-quality software continuously. In this section, I share my experiences with containerization technologies, CI/CD pipeline implementation, and infrastructure automation.</p>
      
      <h3>What You'll Find Here</h3>
      <ul>
        <li><strong>Container Technologies</strong>: Docker, Kubernetes, and orchestration strategies</li>
        <li><strong>CI/CD Pipelines</strong>: Automated testing, building, and deployment workflows</li>
        <li><strong>Infrastructure as Code</strong>: Terraform, Ansible, and configuration management</li>
        <li><strong>Cloud Platforms</strong>: AWS, Azure, GCP deployment patterns</li>
      </ul>
      
      <h3>My Approach</h3>
      <p>I focus on practical, production-ready solutions that I've tested in real-world scenarios. Each article includes working examples, best practices, and lessons learned from actual implementations.</p>
    `
  },
  {
    id: 'database',
    title: 'Database Management',
    description: 'Deep dives into database optimization, scaling strategies, and data modeling.',
    icon: '🗄️',
    overview: `
      <h2>About Database Management</h2>
      <p>Databases are the backbone of most applications. Whether you're working with SQL or NoSQL, understanding performance optimization, proper indexing, and scaling strategies is crucial. Here I document my experiments and findings with various database technologies.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li><strong>Performance Tuning</strong>: Query optimization, indexing strategies, and configuration</li>
        <li><strong>Scaling Strategies</strong>: Replication, sharding, and distributed databases</li>
        <li><strong>Data Modeling</strong>: Schema design, normalization, and best practices</li>
        <li><strong>Database Technologies</strong>: PostgreSQL, MySQL, MongoDB, Redis, and more</li>
      </ul>
      
      <h3>Practical Focus</h3>
      <p>Each post includes real performance metrics, actual configuration examples, and benchmarks from my testing environments. I believe in showing both successes and failures to provide a complete picture.</p>
    `
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Observability',
    description: 'Building comprehensive monitoring solutions and gaining insights into system behavior.',
    icon: '📊',
    overview: `
      <h2>About Monitoring & Observability</h2>
      <p>You can't improve what you don't measure. Monitoring and observability are essential for maintaining reliable systems and understanding how your applications behave in production. This section covers everything from metrics collection to alerting strategies.</p>
      
      <h3>Key Areas</h3>
      <ul>
        <li><strong>Metrics Collection</strong>: Prometheus, Grafana, and time-series databases</li>
        <li><strong>Logging</strong>: Centralized logging, log aggregation, and analysis</li>
        <li><strong>Tracing</strong>: Distributed tracing and request flow analysis</li>
        <li><strong>Alerting</strong>: Intelligent alert configuration and incident response</li>
      </ul>
      
      <h3>Building Observability</h3>
      <p>I share my journey building observability into applications and infrastructure, including dashboard designs, alert configurations, and the metrics that actually matter in production environments.</p>
    `
  },
  {
    id: 'security',
    title: 'Security & Hardening',
    description: 'Security best practices, server hardening, and protecting your infrastructure.',
    icon: '🔒',
    overview: `
      <h2>About Security & Hardening</h2>
      <p>Security should never be an afterthought. From server hardening to application security, implementing proper security measures is essential for any production system. Here I share security practices, configurations, and tools that help protect infrastructure and data.</p>
      
      <h3>Security Topics</h3>
      <ul>
        <li><strong>Server Hardening</strong>: Linux security, SSH configuration, firewall rules</li>
        <li><strong>Authentication & Authorization</strong>: Implementing secure access controls</li>
        <li><strong>Network Security</strong>: VPNs, SSL/TLS, and encrypted communications</li>
        <li><strong>Security Auditing</strong>: Tools and processes for regular security assessments</li>
      </ul>
      
      <h3>Practical Security</h3>
      <p>Security can seem overwhelming, but I break it down into actionable steps. Each article provides practical checklists, configuration examples, and scripts you can adapt for your own infrastructure.</p>
    `
  }
];

export function getSubjectById(id: string): Subject | undefined {
  return subjects.find(subject => subject.id === id);
}

export function getCategoryIdFromName(categoryName: string): string {
  const mapping: Record<string, string> = {
    'DevOps': 'devops',
    'Database': 'database',
    'Monitoring': 'monitoring',
    'Security': 'security'
  };
  return mapping[categoryName] || categoryName.toLowerCase();
}
