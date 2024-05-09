import * as fs from 'fs';
const test_dir = "test-data/";
const test_data = [26171, 22586, 6573];
function sameArray(array1, array2) {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}
function processSingleFile(filename) {
    let successful_logins = 0;
    let sorted_by_user = 0;
    let failures = 0;
    const lines = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n');
    for (var line of lines) {
        switch (line.split('\t')[1]) {
            case "Login.Success": {
                successful_logins += 1;
                sorted_by_user += 1;
                break;
            }
            case "Login.Success.Relogin": {
                successful_logins += 1;
                break;
            }
            case "Login.Failure": {
                failures += 1;
                break;
            }
        }
    }
    return [successful_logins, sorted_by_user, failures];
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
    let test_run = processDirectory(test_dir);
    if (sameArray(test_run, test_data)) {
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
