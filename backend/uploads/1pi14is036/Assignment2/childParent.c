//       Process Program
// Program to show that the child process kills the parent process

#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
 
   void response (int);
   void response (int sig_no)
   {
       // printf("%s\n",sys_siglist[sig_no]);
       // printf("This is singal handler\n");
        printf("Signal Caught\n");
        printf("Process ID = %d\n",getpid());
        printf("Process Parent ID = %d\n",getppid());
   }
   int main()
   {
       pid_t child;
       int status;
       child = fork();
       switch (child){
           case -1 :
               perror("fork");
               exit (1);
           case 0 :
              // printf("Process Parent ID = %d\n",getppid());
               kill(getppid(),SIGKILL);
               printf("I am an orphan process because my parent has been killed by me\n");
               printf("Process ID = %d\n",getpid());
               printf("Process Parent ID = %d\n",getppid());
               // char cmd[50];
               // strcpy(cmd,"ps -f ");
               // strcat(cmd,getpid());
               // printf("%s\n",cmd);
               system("ps -l");
               //printf("Handler failed\n");
               break;
           default :
               signal(SIGKILL,response);
               //wait(&status);
              pid_t w = waitpid(getpid(), &status, WUNTRACED | WCONTINUED);
           		if (w == -1) {
	                perror("waitpid");
	                exit(1);
            }
               printf("The parent process is still alive\n");
               break;
       }
       return 0;
   }
