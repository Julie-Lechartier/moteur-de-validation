#Create MySQL Image for JSP Tutorial Application
FROM mysql:9.2
ENV MYSQL_ROOT_PASSWORD=ynovpwd
COPY ./sqlfiles/ /docker-entrypoint-initdb.d
EXPOSE 3306