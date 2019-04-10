@echo off
mongodump -h 127.0.0.1:27017 -d tms-intl-library -o D:/tms-intl-library/db_data/%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%/