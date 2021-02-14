const ENV_VARS = require('./.env.js');

module.exports = {
  apps: [
    {
      name: 'Reclamation Server',
      script: './app.js',
      watch: false,
      instances: 1, // TODO: change to max for production
      exec_mode: 'cluster',
      max_memmory_restart: '500M',
      time: false,
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-app.log',
      combine_logs: false,
      kill_timeout: 2000,
      min_uptime: '1m',
      max_restarts: 5,
      restart_delay: 1000,
      autorrestart: true,
      cron_restart: '15 3 * * *',
      ...ENV_VARS,
    },
  ],
  deploy: {
    staging: {
      user: 'mm',
      host: 'server1.dashnet.in',
      ref: 'origin/development',
      repo: 'git@github.com:Monday-Morning/project-reclamation.git',
      path: '~/www',
      'post-deploy':
        'git secret reveal -f; cd server; rm -rf node_modules; npm install; npm run start:stage; pm2 dump;',
    },
    production: {
      user: 'github',
      host: 'mm.nitrkl.ac.in',
      ref: 'origin/production',
      repo: 'git@github.com:Monday-Morning/project-reclamation.git',
      path: '/var/www',
      'post-deploy':
        'git secret reveal -f; cd server; rm -rf node_modules; npm install --only=production; npm run start:prod; pm2 dump;',
    },
  },
};