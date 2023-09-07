create database if not exists mfmathpaint;
use mfmathpaint;
drop table if exists data;
create table data (instr_id INT(5) PRIMARY KEY AUTO_INCREMENT, origin SMALLINT(5) NOT NULL, instr VARCHAR(5) NOT NULL, obj_id INT(5), data1 INT(5), data2 INT(5), data3 INT(5), data4 INT(5), text TEXT, ttl INT(11));
