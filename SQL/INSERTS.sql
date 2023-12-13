INSERT INTO generos (nombreGenero)
VALUES
('Pop'),
('Rock'),
('Hip hop'),
('Electrónica'),
('Clásica'),
('Jazz'),
('Reggae'),
('Country'),
('Salsa'),
('Merengue'),
('Flamenco'),
('Tango'),
('Opera'),
('Balada'),
('Rumba'),
('Cumbia'),
('Música del mundo'),
('reggaeton'),
('Regional Mexicana');

select * from generos;

INSERT INTO autores (nombreAutor, foto)
VALUES ('Bad Bunny', '/artist/badbunny.png'),
       ('Grupo Marca Registrada','/artist/marcaregistrada.png'),
       ('Taylor Swift', '/artist/taylorswift.png'),
       ('Feid', '/artist/feid.png'),
       ('Rels B','/artist/relsb.png');

INSERT INTO albumes (titulo, idAutor, idGenero, disquera, portada, fechaLanzamiento)
VALUES
('Nadie sabe lo que va a pasar mañana', 1, 18, 'Rimas Entertainment', '', '2023-10-13');


INSERT INTO canciones (nombre, idAutor, idGenero, idAlbum, duracion)
VALUES
('FINA', 1, 18, 1, '03:37:00'),
('TELEFONO NUEVO', 1, 18, 1, '05:55:00'),
('MERCEDES CAROTA', 1, 18, 1, '03:23:00'),
('UN PREVIEW', 1, 18, 1, '02:46:00'),
('BABY NUEVA', 1, 18, 1, '04:01:00'),
('GRACIAS POR NADA', 1, 18, 1, '02:58:00'),
('LOS PITS', 1, 18, 1, '04:11:00'),
('VUELVE CANDY B', 1, 18, 1, '04:27:00'),
('THUNDER Y LIGHTNING', 1, 18, 1, '03:38:00'),
('ACHO PR', 1, 18, 1, '06:00:00'),
('PERRO NEGRO', 1, 18, 1, '02:43:00'),
('CYBERTRUCK', 1, 18, 1, '03:12:00'),
('WHERE SHE GOES', 1, 18, 1, '03:52:00'),
('EUROPA:(', 1, 18, 1, '00:12:00'),
('BATICANO', 1, 18, 1, '04:16:00'),
('HIBIKI', 1, 18, 1, '03:28:00'),
('SEDA', 1, 18, 1, '03:11:00'),
('MONACO', 1, 18, 1, '04:28:00'),
('NO ME QUIERO CASAR', 1, 18, 1, '03:46:00'),
('NADIE SABE', 1, 18, 1, '06:20:00'),
('VOU 787', 1, 18, 1, '02:04:00'),
('MR. OCTOBER', 1, 18, 1, '03:10:00');

INSERT INTO albumes (titulo, idAutor, idGenero, disquera, portada, fechaLanzamiento)
VALUES
('Corleone', 2, 19, 'Interscope Records', '/cover/corleone.jpeg', '2023-08-04');
INSERT INTO canciones (nombre, idAutor, idGenero, idAlbum, duracion)
VALUES
('Fui Marito Choklos', 2, 19, 2, '04:10:00'),
('El Paisa', 2, 19, 2, '02:53:00'),
('Hoy Todo Cambio', 2, 19, 2, '03:23:00'),
('La Que Me Espera En La Noche', 2, 19, 2, '03:46:00'),
('Quitasueños', 2, 19, 2, '02:54:00'),
('Que Guapo Estoy', 2, 19, 2, '02:41:00'),
('Sueños Y Realidades', 2, 19, 2, '03:44:00'),
('Te Fuiste', 2, 19, 2, '02:55:00'),
('Pinta De Estudiante', 2, 19, 2, '03:30:00'),
('Pobre No', 2, 19, 2, '02:24:00'),
('Ahí Te Va Mitotero', 2, 19, 2, '03:04:00'),
('Borrón Y Cuenta Nueva', 2, 19, 2, '02:24:00'),
('El Detallazo', 2, 19, 2, '03:43:00'),
('Corleone', 2, 19, 2, '02:47:00');


INSERT INTO albumes (titulo, idAutor, idGenero, disquera, portada, fechaLanzamiento)
VALUES
('Midnights', 3, 1, 'Republic Records', '/Cover/Midnights.jpeg', '2022-10-21');

INSERT INTO canciones (nombre, idAutor, idGenero, idAlbum, duracion)
VALUES
    ('Lavender Haze', 3, 1, 3, '03:22:00'),
    ('Maroon', 3, 1, 3, '03:38:00'),
    ('Anti-Hero', 3, 1, 3, '03:20:00'),
    ('Snow On The Beach (feat. Lana Del Rey)', 3, 1, 3, '04:16:00'),
    ('You''re On Your Own, Kid', 3, 1, 3, '03:14:00'),
    ('Midnight Rain', 3, 1, 3, '02:54:00'),
    ('Question...?', 3, 1, 3, '03:30:00'),
    ('Vigilante Shit', 3, 1, 3, '02:44:00'),
    ('Bejeweled', 3, 1, 3, '03:14:00'),
    ('Labyrinth', 3, 1, 3, '04:07:00'),
    ('Karma', 3, 1, 3, '03:24:00'),
    ('Sweet Nothing', 3, 1, 3, '03:08:00'),
    ('Mastermind', 3, 1, 3, '03:11:00'),
    ('Meet me at midnight', 3, 1, 3, '00:08:00');


INSERT INTO albumes (titulo, idAutor, idGenero, disquera, portada, fechaLanzamiento)
VALUES
('MOR, No Le Temas a La Oscuridad', 4, 20, 'Universal Music Latino', '/Cover/MOR,NLTALO.jpg', '2023-09-29');

INSERT INTO canciones (nombre, idAutor, idGenero, idAlbum, duracion)
VALUES
    ('FERXXO 30', 4, 20, 4, '02:53:00'),
    ('VOL 2', 4, 20, 4, '01:10:00'),
    ('VENTE CONMIGO', 4, 20, 4, '03:06:00'),
    ('Niña Bonita', 4, 20, 4, '03:07:00'),
    ('GANGSTERS Y PISTOLAS', 4, 20, 4, '02:50:00'),
    ('FERXXO 151', 4, 20, 4, '03:15:00'),
    ('BUBALU', 4, 20, 4, '03:48:00'),
    ('RITMO DE MEDALLO', 4, 20, 4, '01:58:00'),
    ('FERXXO EDITION', 4, 20, 4, '02:41:00'),
    ('NX TX SIENTAS SOLX', 4, 20, 4, '02:01:00'),
    ('LUCES DE TECNO', 4, 20, 4, '02:44:00'),
    ('EY CHORY', 4, 20, 4, '02:58:00'),
    ('VELOCIDAD CRUCERO', 4, 20, 4, '02:16:00'),
    ('ROMÁNTICOS DE LUNES', 4, 20, 4, '04:02:00'),
    ('el único tema del ferxxo', 4, 20, 4, '03:02:00'),
    ('PRIVILEGIOS', 4, 20, 4, '03:06:00');


UPDATE usuarios SET foto = '/profilePic/default.jpg' WHERE foto IS NULL;

ALTER TABLE usuarios
CHANGE COLUMN foto profilePic VARCHAR(255) DEFAULT '/profilePic/default.jpg' NOT NULL;

SELECT * FROM usuarios;

CREATE TABLE Follows (
    id INT PRIMARY KEY AUTO_INCREMENT,
    follower VARCHAR(255),
    followed VARCHAR(255),
    FOREIGN KEY (follower) REFERENCES usuarios(nombreUsuario),
    FOREIGN KEY (followed) REFERENCES usuarios(nombreUsuario)
);