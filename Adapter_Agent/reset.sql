USE museum_pool2;

DELETE FROM object_population;
ALTER TABLE object_population AUTO_INCREMENT = 1;

DELETE FROM visitor_log;
ALTER TABLE visitor_log AUTO_INCREMENT = 1;

DELETE FROM object_image;
ALTER TABLE object_image AUTO_INCREMENT = 1;

DELETE FROM object;
ALTER TABLE object AUTO_INCREMENT = 1;

DELETE FROM keyword;
ALTER TABLE keyword AUTO_INCREMENT = 1;