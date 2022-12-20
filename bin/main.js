let JobsProcess = require('../obj/src/container/JobsProcess').JobsProcess;

try {
    let proc = new JobsProcess();
    proc._configPath = "./config/config.yml";
    proc.run(process.argv);
} catch (ex) {
    console.error(ex);
}
