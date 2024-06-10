-- CREATE DATABASE IF NOT EXISTS u211881118_disturbia;

-- USE u211881118_disturbia;

CREATE TABLE products (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) DEFAULT NULL,
  category VARCHAR(45) DEFAULT NULL,
  price INT(11) DEFAULT NULL, 
  stock IN(11) DEFAULT NULL,
  images TEXT DEFAULT NULL,
  accesorios BOOLEAN DEFAULT NULL,
  celulares BOOLEAN DEFAULT NULL,
  tecnologia BOOLEAN DEFAULT NULL;
  descripcion VARCHAR(501) DEFAULT NULL
  masvendidos BOOLEAN DEFAULT NULL,
  novedades BOOLEAN DEFAULT NULL,
  promociones BOOLEAN DEFAULT NULL;
  PRIMARY KEY(id)
);

