#include <stdio.h>
#include <stdlib.h>
#include <string.h>


struct ProxyLogins{
	int successes;
	int users;
	int failures;
};

void processSingleFile(char* filename, struct ProxyLogins* proxy_logins){

	FILE *fp;
	char * line = NULL;
	size_t len = 0;
	ssize_t read;

	fp = fopen(filename, "r");
	if(fp == NULL)
		exit(EXIT_FAILURE);

	while((read == getline(&line, &len, fp)) != -1){
		strtok(line, "\t");
		char * status = strtok(NULL, "\t");
		if(status != NULL){
			printf("%s\n", status);
			if(strcmp("Login.Success", status) == 0){
				proxy_logins->successes += 1;
				proxy_logins->users += 1;
			} else if(strcmp("Login.Success.Relogin", status) == 0){
				proxy_logins->successes += 1;
			} else if(strcmp("Login.Failure", status) == 0){
				proxy_logins->failures += 1;
			} 

		} else {
			break;
		}

	}

	fclose(fp);
	if(line)
		free(line);
}


int main(int argc, char *argv[]){

	struct ProxyLogins proxy_logins;
	proxy_logins.successes = 0;
	proxy_logins.users = 0;
	proxy_logins.failures = 0;

	struct ProxyLogins test_logins;
	test_logins.successes = 870;
	test_logins.users = 739;
	test_logins.failures = 270;

	processSingleFile(argv[1], &proxy_logins);

		printf("Running test...\n");

	if(proxy_logins.successes == test_logins.successes && 
			proxy_logins.users == test_logins.users &&
			proxy_logins.failures == test_logins.failures){
		printf("Test passed!\n");
	} else {
		printf("Test failed!\n");
	}

}

