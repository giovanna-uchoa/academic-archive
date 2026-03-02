export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Setting Up a Production-Ready Docker Environment',
    excerpt: 'A comprehensive guide to configuring Docker for production workloads, including security best practices and optimization techniques.',
    date: 'Nov 24, 2025',
    readTime: '8 min read',
    category: 'DevOps',
    content: `
      <h2>Introduction</h2>
      <p>Docker has become an essential tool in modern development workflows. However, moving from development to production requires careful consideration of security, performance, and reliability.</p>
      
      <h2>Key Considerations</h2>
      <p>When setting up Docker for production, there are several critical aspects to consider:</p>
      <ul>
        <li><strong>Image Security</strong>: Always use official base images and keep them updated</li>
        <li><strong>Resource Limits</strong>: Set appropriate CPU and memory limits for containers</li>
        <li><strong>Logging</strong>: Implement centralized logging for better monitoring</li>
        <li><strong>Health Checks</strong>: Define proper health check endpoints</li>
      </ul>
      
      <h2>Docker Compose Configuration</h2>
      <p>Here's a production-ready docker-compose.yml example:</p>
      <pre><code>version: '3.8'
services:
  app:
    image: myapp:latest
    restart: always
    mem_limit: 512m
    cpus: 0.5
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"</code></pre>
      
      <h2>Security Best Practices</h2>
      <p>Never run containers as root. Create a dedicated user in your Dockerfile:</p>
      <pre><code>RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs</code></pre>
      
      <h2>Conclusion</h2>
      <p>Setting up Docker for production requires attention to detail, but following these practices will help ensure your containerized applications run smoothly and securely.</p>
    `
  },
  {
    id: 2,
    title: 'PostgreSQL Performance Tuning: What I Learned',
    excerpt: 'After weeks of optimizing our PostgreSQL database, here are the techniques that made the biggest impact on query performance.',
    date: 'Nov 18, 2025',
    readTime: '6 min read',
    category: 'Database',
    content: `
      <h2>The Problem</h2>
      <p>Our application started experiencing slow query times as our database grew beyond 10 million rows. Here's what I did to optimize it.</p>
      
      <h2>Index Optimization</h2>
      <p>The first step was analyzing which queries were slow using EXPLAIN ANALYZE:</p>
      <pre><code>EXPLAIN ANALYZE 
SELECT * FROM users 
WHERE email = 'user@example.com';</code></pre>
      
      <p>I found several queries doing sequential scans. Adding proper indexes made a huge difference:</p>
      <pre><code>CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);</code></pre>
      
      <h2>Connection Pooling</h2>
      <p>Implementing connection pooling with PgBouncer reduced connection overhead significantly. This is especially important for applications with many concurrent users.</p>
      
      <h2>Query Optimization</h2>
      <p>Some key learnings:</p>
      <ul>
        <li>Use LIMIT when you don't need all results</li>
        <li>Avoid SELECT * - only fetch columns you need</li>
        <li>Use JOIN instead of multiple queries</li>
        <li>Consider materialized views for complex aggregations</li>
      </ul>
      
      <h2>Configuration Tuning</h2>
      <p>Adjusting postgresql.conf settings based on your hardware:</p>
      <pre><code>shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB</code></pre>
      
      <h2>Results</h2>
      <p>After these optimizations, our average query time dropped from 450ms to 45ms - a 10x improvement!</p>
    `
  },
  {
    id: 3,
    title: 'Building a CI/CD Pipeline with GitHub Actions',
    excerpt: 'How I automated our deployment process using GitHub Actions, reducing deployment time from hours to minutes.',
    date: 'Nov 12, 2025',
    readTime: '10 min read',
    category: 'DevOps',
    content: `
      <h2>Why GitHub Actions?</h2>
      <p>GitHub Actions provides a simple yet powerful way to automate your software workflows directly in your repository. No need for external CI/CD services.</p>
      
      <h2>Basic Workflow Structure</h2>
      <p>Here's a simple workflow that runs tests on every push:</p>
      <pre><code>name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test</code></pre>
      
      <h2>Deployment Workflow</h2>
      <p>For production deployments, I use a separate workflow triggered on tags:</p>
      <pre><code>name: Deploy
on:
  push:
    tags:
      - 'v*'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t myapp:\${{ github.ref_name }} .
      - name: Push to registry
        run: docker push myapp:\${{ github.ref_name }}
      - name: Deploy to server
        run: ssh user@server 'docker pull myapp:\${{ github.ref_name }} && docker-compose up -d'</code></pre>
      
      <h2>Advanced Features</h2>
      <ul>
        <li><strong>Matrix builds</strong>: Test against multiple Node.js versions</li>
        <li><strong>Caching</strong>: Speed up builds by caching dependencies</li>
        <li><strong>Secrets</strong>: Securely store API keys and credentials</li>
        <li><strong>Environments</strong>: Separate staging and production deployments</li>
      </ul>
      
      <h2>Best Practices</h2>
      <p>Some tips I've learned along the way:</p>
      <ul>
        <li>Keep workflows DRY using reusable workflows</li>
        <li>Use appropriate permissions for each job</li>
        <li>Always test workflows in a separate branch first</li>
        <li>Monitor workflow execution times and optimize slow steps</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>GitHub Actions has transformed our deployment process. What used to take manual intervention and hours now happens automatically in minutes.</p>
    `
  },
  {
    id: 4,
    title: 'Monitoring Your Infrastructure with Prometheus',
    excerpt: 'A practical guide to setting up Prometheus and Grafana for comprehensive infrastructure monitoring.',
    date: 'Nov 5, 2025',
    readTime: '7 min read',
    category: 'Monitoring',
    content: `
      <h2>Why Monitoring Matters</h2>
      <p>You can't fix what you can't see. Proper monitoring helps you detect issues before they become critical problems.</p>
      
      <h2>Setting Up Prometheus</h2>
      <p>Prometheus is an open-source monitoring solution that's become the standard in cloud-native environments. Here's a basic prometheus.yml:</p>
      <pre><code>global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
  
  - job_name: 'application'
    static_configs:
      - targets: ['localhost:3000']</code></pre>
      
      <h2>Key Metrics to Monitor</h2>
      <ul>
        <li><strong>System Metrics</strong>: CPU, memory, disk usage</li>
        <li><strong>Application Metrics</strong>: Request rate, error rate, response time</li>
        <li><strong>Database Metrics</strong>: Connection pool, query performance</li>
        <li><strong>Network Metrics</strong>: Bandwidth, packet loss</li>
      </ul>
      
      <h2>Creating Alerts</h2>
      <p>Set up alerts for critical conditions:</p>
      <pre><code>groups:
  - name: example
    rules:
    - alert: HighMemoryUsage
      expr: (node_memory_MemTotal - node_memory_MemAvailable) / node_memory_MemTotal > 0.9
      for: 5m
      annotations:
        summary: "High memory usage detected"</code></pre>
      
      <h2>Visualizing with Grafana</h2>
      <p>Grafana provides beautiful dashboards for your Prometheus data. Import community dashboards or create custom ones to visualize your specific metrics.</p>
      
      <h2>Lessons Learned</h2>
      <p>Start simple and add complexity as needed. Too many metrics can be overwhelming. Focus on what matters for your use case.</p>
    `
  },
  {
    id: 5,
    title: 'Securing Your Linux Server: A Checklist',
    excerpt: 'Essential security practices every Linux administrator should implement to protect their servers.',
    date: 'Oct 29, 2025',
    readTime: '9 min read',
    category: 'Security',
    content: `
      <h2>Security Is Not Optional</h2>
      <p>With the increasing number of automated attacks, securing your Linux server is more important than ever. Here's my essential checklist.</p>
      
      <h2>SSH Hardening</h2>
      <p>The first line of defense. Edit /etc/ssh/sshd_config:</p>
      <pre><code>PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222  # Change from default 22
AllowUsers your_username</code></pre>
      
      <h2>Firewall Configuration</h2>
      <p>Use ufw (Uncomplicated Firewall) for simple firewall management:</p>
      <pre><code>ufw default deny incoming
ufw default allow outgoing
ufw allow 2222/tcp  # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable</code></pre>
      
      <h2>Automatic Security Updates</h2>
      <p>Keep your system patched automatically:</p>
      <pre><code>apt install unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades</code></pre>
      
      <h2>Fail2Ban</h2>
      <p>Protect against brute force attacks:</p>
      <pre><code>apt install fail2ban
systemctl enable fail2ban
systemctl start fail2ban</code></pre>
      
      <h2>Additional Security Measures</h2>
      <ul>
        <li>Use strong passwords and consider 2FA</li>
        <li>Regular backups (test restores too!)</li>
        <li>Monitor logs with tools like logwatch</li>
        <li>Keep services updated</li>
        <li>Use SELinux or AppArmor</li>
        <li>Implement least privilege principle</li>
      </ul>
      
      <h2>Regular Audits</h2>
      <p>Schedule regular security audits. Tools like lynis can help automate this process.</p>
      
      <h2>Final Thoughts</h2>
      <p>Security is an ongoing process, not a one-time setup. Stay informed about new vulnerabilities and best practices.</p>
    `
  }
];
