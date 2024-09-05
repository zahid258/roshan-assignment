module.exports = {
  apps: [
    {
      name: 'app1',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '5G', // Set the maximum heap size to 2GB
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
