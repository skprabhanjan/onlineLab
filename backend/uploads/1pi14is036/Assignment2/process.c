// 		Signals program
//show that exec preserves some signal settings (e.g., SIG_IGN).

#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>
int main()
{
pid_t pid;
signal(SIGINT, SIG_IGN);
pid = fork();
if (pid == 0){
	printf("Child id = %d\n",getpid());
	execl("./waitsignal1", "waitsignal1", 0);
}
else{
	printf("Parent id = %d\n",getpid());
	execl("./waitsignal2", "waitsignal2", 0);
}
return 0;

}
