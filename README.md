# tms-intl-library
# 备份mongoDB数据库命令
mongodump -h 127.0.0.1:27017 -d tms-intl-library -o D:/snowden-study/tms-intl-library/db_data/
# 还原mongoDB数据库命令
mongorestore -h 127.0.0.1:27017 -d tms-intl-library --drop D:/snowden-study/tms-intl-library/db_data/tms-intl-library/
