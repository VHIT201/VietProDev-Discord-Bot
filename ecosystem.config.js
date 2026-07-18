module.exports = {
  apps: [
    {
      name: 'discord-bot',
      script: './src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      wait_ready: false,
      min_uptime: '10s',
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production'
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
