import * as fs from 'fs';
const testDir = "test-data/";
function sameArray(array1, array2) {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}
function processSingleFile(filename) {
    let successful_logins = []; // refactor: these no longer need to be arrays, just counts.
    let sorted_by_user = [];
    let failures = [];
    const lines = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n');
    for (var line of lines) {
        var tokens = line.split('\t');
        var event = tokens[1];
        if (event == "Login.Success" || event == "Login.Success.Relogin") {
            successful_logins.push(event);
        }
        if (event == "Login.Success") {
            sorted_by_user.push(event);
        }
        if (event == "Login.Failure") {
            failures.push(event);
        }
    }
    //	console.log(`${filename} successes: ${successful_logins.length}`);
    //	console.log(`${filename}: sorted_by_user: ${sorted_by_user.length}`);
    return [successful_logins.length, sorted_by_user.length, failures.length];
}
function processDirectory(dir) {
    let data = [];
    let total_successful_logins = 0;
    let total_unique_users = 0;
    let total_failures = 0;
    let filenames = fs.readdirSync(dir);
    for (var file of filenames) {
        data = processSingleFile(`${dir}${file}`);
        total_successful_logins += data[0];
        total_unique_users += data[1];
        total_failures += data[2];
    }
    return [total_successful_logins, total_unique_users, total_failures];
}
function runTest() {
    console.log("Running test...");
    let test_run = processDirectory(testDir);
    if (sameArray(test_run, [26171, 22586, 6573])) {
        console.log("%c Test passed.", "color:green");
    }
    else {
        console.log("%c Test failed.", "color:red");
    }
}
function pretty_print(proxy_data) {
    console.log(`Total successful logins: ${proxy_data[0]}; sorted by users: ${proxy_data[1]}; failures: ${proxy_data[2]}.`);
}
if (process.argv[2]) {
    pretty_print(processDirectory(process.argv[2]));
}
else {
    runTest();
}
