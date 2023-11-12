# tabnine_queue

This is an implementation of a basic queue using redis.
This could be easily scale horizontally by adding more api servers running nodejs.
This could also be easily scale in case the amount of messages is to big by defining a redis cluster and changing the configuration in the nodejs to a redis cluster - see example in the .env file.


Access:

http://164.90.132.246:3000/

GET: 
http://164.90.132.246:3000/api/queue_name?timeout={ms}

POST:
http://164.90.132.246:3000/api/queue_name
