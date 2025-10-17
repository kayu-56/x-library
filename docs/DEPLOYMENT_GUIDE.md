# Deployment Guide

## Overview
This guide provides instructions for deploying the Leafline Library platform to production environments, as well as setting up development and staging environments.

## Environment Requirements

### Development Environment
- **Node.js**: 18.x or later
- **npm**: 9.x or later
- **PostgreSQL**: 14.x or later (for backend)
- **MongoDB**: 6.x or later (for backend)
- **Git**: For version control

### Production Environment
- **Server**: Linux-based (Ubuntu 22.04 LTS recommended)
- **RAM**: Minimum 4GB, 8GB+ recommended
- **Storage**: Minimum 50GB SSD
- **SSL Certificate**: For HTTPS
- **Domain Name**: Configured with DNS

## Deployment Options

### Option 1: AWS Deployment

#### Frontend (S3 + CloudFront)

1. **Build the application**:
```bash
npm run build
```

2. **Create S3 bucket**:
```bash
aws s3 mb s3://leafline-library-frontend
aws s3 website s3://leafline-library-frontend --index-document index.html --error-document index.html
```

3. **Configure bucket policy** (make public):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::leafline-library-frontend/*"
    }
  ]
}
```

4. **Upload build files**:
```bash
aws s3 sync dist/ s3://leafline-library-frontend --delete
```

5. **Create CloudFront distribution**:
- Origin: S3 bucket
- Viewer protocol: Redirect HTTP to HTTPS
- Compress objects: Yes
- Cache behavior: Use CloudFront caching
- SSL certificate: ACM certificate for custom domain

#### Backend (EC2 + RDS + DocumentDB)

1. **Launch EC2 instance**:
- Instance type: t3.medium or larger
- AMI: Ubuntu 22.04 LTS
- Security group: Allow SSH (22), HTTP (80), HTTPS (443)

2. **Set up RDS PostgreSQL**:
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier leafline-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 14.7 \
  --master-username admin \
  --master-user-password <secure-password> \
  --allocated-storage 100 \
  --backup-retention-period 7 \
  --multi-az
```

3. **Set up DocumentDB (MongoDB-compatible)**:
```bash
# Create DocumentDB cluster
aws docdb create-db-cluster \
  --db-cluster-identifier leafline-comments \
  --engine docdb \
  --master-username admin \
  --master-user-password <secure-password>
```

4. **Configure EC2 instance**:
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@<ec2-public-ip>

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-org/leafline-library.git
cd leafline-library/server

# Install dependencies
npm install --production

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=<rds-endpoint>
DB_PORT=5432
DB_NAME=leafline
DB_USER=admin
DB_PASSWORD=<secure-password>
MONGO_URI=mongodb://<docdb-endpoint>:27017/leafline
JWT_SECRET=<generate-secure-secret>
CORS_ORIGIN=https://leafline-library.com
EOF

# Start application with PM2
pm2 start server.js --name leafline-api
pm2 save
pm2 startup
```

5. **Configure Nginx as reverse proxy**:
```bash
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/leafline-api

# Add configuration:
server {
    listen 80;
    server_name api.leafline-library.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/leafline-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Set up SSL with Let's Encrypt**:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.leafline-library.com
```

### Option 2: DigitalOcean Deployment

#### Frontend (App Platform)

1. **Build application**:
```bash
npm run build
```

2. **Create App Platform app**:
- Connect GitHub repository
- Select "Static Site" type
- Build command: `npm run build`
- Output directory: `dist`
- Enable automatic deploys from main branch

#### Backend (Droplet + Managed Database)

1. **Create Droplet**:
- Distribution: Ubuntu 22.04
- Plan: Basic ($24/month - 4GB RAM, 2 vCPUs)
- Add SSH keys
- Enable monitoring and backups

2. **Create Managed PostgreSQL Database**:
- Version: PostgreSQL 14
- Plan: Basic ($15/month)
- Enable connection pooling

3. **Create Managed MongoDB Database**:
- Version: MongoDB 6
- Plan: Basic ($15/month)

4. **Configure Droplet** (same as EC2 setup above)

### Option 3: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd /path/to/project
vercel --prod
```

Or connect GitHub repository via Vercel dashboard.

#### Backend on Render

1. **Create account on Render.com**
2. **Create Web Service**:
- Connect GitHub repository
- Environment: Node
- Build command: `cd server && npm install`
- Start command: `cd server && node server.js`
3. **Add environment variables**
4. **Create PostgreSQL database** (Render provides managed PostgreSQL)
5. **Set up MongoDB Atlas** (free tier) for MongoDB

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://api.leafline-library.com
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://leafline-library.com

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leafline
DB_USER=postgres
DB_PASSWORD=secure-password
DB_POOL_MIN=2
DB_POOL_MAX=10

# MongoDB
MONGO_URI=mongodb://localhost:27017/leafline
MONGO_POOL_SIZE=10

# Authentication
JWT_SECRET=generate-a-secure-random-string
JWT_EXPIRATION=24h
REFRESH_TOKEN_EXPIRATION=30d

# Auth0 (if using)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# File Upload (S3)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=leafline-uploads

# Email (SendGrid, Mailgun, etc.)
EMAIL_FROM=noreply@leafline-library.com
SENDGRID_API_KEY=your-sendgrid-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

## Database Setup

### PostgreSQL Migration

1. **Install migration tool** (e.g., node-pg-migrate):
```bash
npm install node-pg-migrate
```

2. **Run migrations**:
```bash
npm run migrate up
```

3. **Seed data**:
```bash
npm run seed
```

### MongoDB Indexes

1. **Connect to MongoDB**:
```bash
mongo <connection-string>
```

2. **Create indexes**:
```javascript
use leafline;

db.comments.createIndex({ bookId: 1, createdAt: -1 });
db.comments.createIndex({ userId: 1 });
db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
db.user_activity.createIndex({ userId: 1, timestamp: -1 });
db.recommendations.createIndex({ userId: 1 });
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run test
  
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: 'dist'
      - name: Invalidate CloudFront
        uses: chetan/invalidate-cloudfront-action@v2
        env:
          DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          PATHS: '/*'
          AWS_REGION: 'us-east-1'
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /var/www/leafline-library/server
            git pull origin main
            npm install --production
            pm2 restart leafline-api
```

## Monitoring & Logging

### Application Monitoring

1. **Sentry for Error Tracking**:
```bash
npm install @sentry/node @sentry/integrations
```

2. **Configure in server.js**:
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Logging

1. **Winston for logging**:
```bash
npm install winston
```

2. **Configure logger**:
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### Performance Monitoring

1. **New Relic or DataDog**:
```bash
npm install newrelic
```

2. **Add to server startup**:
```javascript
require('newrelic');
```

## Backup Strategy

### PostgreSQL Backups

1. **Automated daily backups**:
```bash
# Add to crontab
0 2 * * * pg_dump -U postgres leafline | gzip > /backups/leafline_$(date +\%Y\%m\%d).sql.gz
```

2. **Backup retention**:
- Daily backups: Keep for 7 days
- Weekly backups: Keep for 4 weeks
- Monthly backups: Keep for 12 months

### MongoDB Backups

1. **Automated daily backups**:
```bash
# Add to crontab
0 3 * * * mongodump --uri="mongodb://localhost:27017/leafline" --out=/backups/mongo_$(date +\%Y\%m\%d)
```

### S3 Backup Storage

```bash
# Sync backups to S3
aws s3 sync /backups s3://leafline-backups/
```

## Security Checklist

- [ ] Enable HTTPS for all domains
- [ ] Configure CORS properly
- [ ] Set secure HTTP headers (Helmet.js)
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable database encryption at rest
- [ ] Configure firewall rules
- [ ] Set up VPC (AWS) or Private Network (DigitalOcean)
- [ ] Enable automatic security updates
- [ ] Configure fail2ban for SSH protection
- [ ] Set up database connection pooling
- [ ] Enable API request logging
- [ ] Configure Content Security Policy
- [ ] Use prepared statements for SQL queries
- [ ] Sanitize user inputs
- [ ] Implement CSRF protection

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**:
- AWS: Application Load Balancer
- DigitalOcean: Load Balancer
- Self-hosted: Nginx

2. **Multiple API Servers**:
- Use PM2 cluster mode
- Or deploy multiple instances behind load balancer

3. **Database Read Replicas**:
- PostgreSQL: Read replicas for read-heavy queries
- MongoDB: Replica sets

### Caching

1. **Redis for session storage and caching**:
```bash
npm install redis ioredis
```

2. **CDN for static assets**:
- CloudFront (AWS)
- DigitalOcean Spaces CDN
- Cloudflare

### Performance Optimization

1. **Enable gzip compression**
2. **Implement database query caching**
3. **Use connection pooling**
4. **Optimize images and assets**
5. **Enable HTTP/2**
6. **Implement lazy loading**
7. **Use service workers for PWA features**

## Rollback Procedure

1. **Frontend Rollback** (S3/Vercel):
```bash
# Restore previous S3 version or redeploy previous git commit
aws s3 sync s3://leafline-backups/frontend-20240115 s3://leafline-library-frontend
```

2. **Backend Rollback**:
```bash
# SSH to server
git checkout <previous-commit>
npm install
pm2 restart leafline-api
```

3. **Database Rollback**:
```bash
# Restore from backup
pg_restore -U postgres -d leafline /backups/leafline_20240115.sql
```

## Health Checks

### API Health Endpoint

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});
```

### Monitoring Service

Set up uptime monitoring with:
- UptimeRobot
- Pingdom
- StatusCake

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test frontend loads correctly
- [ ] Test API endpoints
- [ ] Verify database connections
- [ ] Check SSL certificates
- [ ] Test user registration/login
- [ ] Verify email sending works
- [ ] Check error logging
- [ ] Review performance metrics
- [ ] Test mobile responsiveness
- [ ] Verify backups are running
- [ ] Check monitoring dashboards
- [ ] Update DNS if needed
- [ ] Test rollback procedure
