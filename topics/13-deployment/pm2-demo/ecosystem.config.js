// PM2 reads this file to know how to run and supervise the app.
// Start with: npx pm2 start ecosystem.config.js
// Inspect with: npx pm2 status / npx pm2 logs app-demo
// Stop with: npx pm2 delete app-demo
module.exports = {
  apps: [
    {
      name: 'app-demo',
      script: './app.js',
      env: {
        PORT: 3000,
      },
      // Restart automatically if the process crashes...
      autorestart: true,
      // ...but stop trying after this many restarts in a short window,
      // so a permanently broken app doesn't restart-loop forever.
      max_restarts: 10,
      // Restart if memory usage grows past this — a safety net against
      // memory leaks in long-running processes.
      max_memory_restart: '200M',
    },
  ],
};
