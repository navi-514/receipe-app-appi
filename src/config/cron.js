import cron from "cron";
import https from "https";

const job = new cron.CronJob("14 * * * *", function () {
    https
        .get(process.env.API_URL || "", (res) => {
            if(res.statusCode === 200){
                console.log(`Cron Job: Pinged ${process.env.API_URL} successfully at ${new Date().toISOString()}`);
            } else {
                console.error(`Cron Job: Failed to ping ${process.env.API_URL}. Status Code: ${res.statusCode}`);
            }
        })
        .on("error", (err) => {
            console.error(`Cron Job: Error pinging ${process.env.API_URL}:`, err);
        });
});

job.start();

export { job };