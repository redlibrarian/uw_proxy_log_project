import * as fs from 'fs';
import * as rd from 'readline';

function processSingleFile(filename){
	let successful_logins = []; // refactor: these no longer need to be arrays, just counts.
	let sorted_by_user = [];
	let failures = [];
	const lines = fs.readFileSync(filename, {encoding: 'utf8', flag: 'r'}).split('\n');
	for(var line of lines){
		var tokens = line.split('\t');
		var event = tokens[1];
		if(event == "Login.Success" || event == "Login.Success.Relogin"){
			successful_logins.push(event);
		}
		if(event == "Login.Success"){
		  sorted_by_user.push(event);
		}
		if(event == "Login.Failure"){
			failures.push(event);
		}
	}
	console.log(`${filename} successes: ${successful_logins.length}`);
	console.log(`${filename}: sorted_by_user: ${sorted_by_user.length}`);
	return [successful_logins.length, sorted_by_user.length, failures.length];
}


let data = [];
let total_successful_logins = 0;
let total_unique_users = 0;
let total_failures = 0;

let filenames = fs.readdirSync(process.argv[2]);
for(var file of filenames){
	data = processSingleFile(`${process.argv[2]}${file}`);
	total_successful_logins += data[0];
	total_unique_users += data[1];
	total_failures += data[2];
}


console.log(`Total successful logins: ${total_successful_logins} / Total unique users: ${total_unique_users} / Total failure: ${total_failures}.`);
