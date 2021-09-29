# NodeJs Assignment

## Technology Used

--> Node Version v16.9.1 for backend

--> MongoDB for Database

--> HBS template for frontend

## How to Run ->

--> Clone This Repo

--> Do npm install

--> make .env file in source directory

--> make a variable JWT_SECRET & give some value to it

--> i have used local mongodb database link,it can be changed to cloud link in src/db/conn.js.

## Project Explanation:

--> User Can Register by providing his credentials.

--> User can login by providing username and password.

--> He Can upload files & at the time of upload he ll enter a file name.

--> A 6 digit code will be generated for every upload file automatically, which ll be stored in db.

--> at the time of getting file url you need to enter file name and the secret code of the file.

--> I have not separated files controller & route because, i was not getting proper error messages so for now i decided to keep everything in same file for now.