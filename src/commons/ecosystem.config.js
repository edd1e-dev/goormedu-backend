// pm2 start src/commons/ecosystem.config.js --attach --env production
// pm2 list: Listing Applications
// pm2 monit: Terminal Dashboard
// pm2 stop
// pm2 delete
module.exports = {
    apps : [
        {
            name: "goormedu-clone",
            script: "build/index.js",
            // watch: true, // automatically restart your application when a file is modified in the current directory or its subdirectories
            //instances: 0, // to spread the app across all CPUs - 1
            // exec_mode : "cluster", // PM2 know you want to load balance between each instances
            // wait_ready: true, // Sometimes you might need to wait for your application to have etablished connections with your DBs/caches/workers/whatever. PM2 needs to wait, before considering your application as online
            // listen_timeout: 50000, // PM2 wait 50000ms for the ready signal.
            // kill_timeout: 5000, // PM2 will wait 5000ms before sending a final SIGKILL signal
        }
    ]
}