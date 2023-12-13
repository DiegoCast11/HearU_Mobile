-- Crear una base de datos o esquema
CREATE SCHEMA IF NOT EXISTS hearudb;

-- Usar la base de datos o esquema recién creada
USE hearudb;

create table autores
(
    idAutor     int auto_increment
        primary key,
    nombreAutor varchar(50)  null,
    foto        varchar(255) null
)
    engine = InnoDB;

create table generos
(
    idGenero     int auto_increment
        primary key,
    nombreGenero varchar(50) null
)
    engine = InnoDB;

create table albumes
(
    idAlbum          int auto_increment
        primary key,
    titulo           varchar(100) null,
    idAutor          int          null,
    idGenero         int          null,
    disquera         varchar(100) null,
    portada          varchar(255) null,
    fechaLanzamiento date         null,
    constraint albumes_ibfk_1
        foreign key (idAutor) references autores (idAutor),
    constraint albumes_ibfk_2
        foreign key (idGenero) references generos (idGenero)
)
    engine = InnoDB;

create index idAutor
    on albumes (idAutor);

create index idGenero
    on albumes (idGenero);

create table canciones
(
    idCancion int auto_increment
        primary key,
    nombre    varchar(100) null,
    idAutor   int          null,
    idGenero  int          null,
    idAlbum   int          null,
    duracion  time         null,
    constraint canciones_ibfk_1
        foreign key (idAutor) references autores (idAutor),
    constraint canciones_ibfk_2
        foreign key (idGenero) references generos (idGenero),
    constraint canciones_ibfk_3
        foreign key (idAlbum) references albumes (idAlbum)
)
    engine = InnoDB;

create index idAlbum
    on canciones (idAlbum);

create index idAutor
    on canciones (idAutor);

create index idGenero
    on canciones (idGenero);

create table usuarios
(
    nombreUsuario varchar(50)                                    not null
        primary key,
    nombre        varchar(50)                                    null,
    correo        varchar(50)                                    null,
    contrasena    varchar(50)                                    null,
    profilePic    varchar(255) default '/profilePic/default.jpg' not null
)
    engine = InnoDB;

create table amistades
(
    id_amistad  int auto_increment
        primary key,
    no_usuario1 varchar(50) null,
    no_usuario2 varchar(50) null,
    constraint amistades_ibfk_1
        foreign key (no_usuario1) references usuarios (nombreUsuario),
    constraint amistades_ibfk_2
        foreign key (no_usuario2) references usuarios (nombreUsuario)
)
    engine = InnoDB;

create index no_usuario1
    on amistades (no_usuario1);

create index no_usuario2
    on amistades (no_usuario2);

create table favoritos
(
    idFavorito    int auto_increment
        primary key,
    nombreUsuario varchar(50) null,
    idCancion     int         null,
    constraint favoritos_ibfk_1
        foreign key (nombreUsuario) references usuarios (nombreUsuario),
    constraint favoritos_ibfk_2
        foreign key (idCancion) references canciones (idCancion)
)
    engine = InnoDB;

create index idCancion
    on favoritos (idCancion);

create index nombreUsuario
    on favoritos (nombreUsuario);

create table follows
(
    id       int auto_increment
        primary key,
    follower varchar(255) null,
    followed varchar(255) null,
    constraint follows_ibfk_1
        foreign key (follower) references usuarios (nombreUsuario),
    constraint follows_ibfk_2
        foreign key (followed) references usuarios (nombreUsuario)
)
    engine = InnoDB;

create index followed
    on follows (followed);

create index follower
    on follows (follower);

create table publicaciones
(
    idPublicacion    int auto_increment
        primary key,
    nombreUsuario    varchar(50) null,
    fechaPublicacion datetime    null,
    score            int         null,
    descripcion      text        null,
    idAlbum          int         null,
    idCancion        int         null,
    idAutor          int         null,
    constraint publicaciones_ibfk_1
        foreign key (nombreUsuario) references usuarios (nombreUsuario),
    constraint publicaciones_ibfk_2
        foreign key (idAlbum) references albumes (idAlbum),
    constraint publicaciones_ibfk_3
        foreign key (idCancion) references canciones (idCancion),
    constraint publicaciones_ibfk_4
        foreign key (idAutor) references autores (idAutor)
)
    engine = InnoDB;

create table comentarios
(
    idComentario      int auto_increment
        primary key,
    nombreUsuario     varchar(50) null,
    idPublicacion     int         null,
    fecha             datetime    null,
    texto             text        null,
    idComentarioPadre int         null,
    constraint comentarios_ibfk_1
        foreign key (nombreUsuario) references usuarios (nombreUsuario),
    constraint comentarios_ibfk_2
        foreign key (idPublicacion) references publicaciones (idPublicacion),
    constraint comentarios_ibfk_3
        foreign key (idComentarioPadre) references comentarios (idComentario)
)
    engine = InnoDB;

create index idComentarioPadre
    on comentarios (idComentarioPadre);

create index idPublicacion
    on comentarios (idPublicacion);

create index nombreUsuario
    on comentarios (nombreUsuario);

create index idAlbum
    on publicaciones (idAlbum);

create index idAutor
    on publicaciones (idAutor);

create index idCancion
    on publicaciones (idCancion);

create index nombreUsuario
    on publicaciones (nombreUsuario);

create definer = root@localhost view artistasmaspopulares as
select `a`.`idAutor`              AS `idAutor`,
       `a`.`nombreAutor`          AS `nombreAutor`,
       `a`.`foto`                 AS `foto`,
       count(`p`.`idPublicacion`) AS `totalPublicaciones`
from ((`hearudb`.`publicaciones` `p` join `hearudb`.`canciones` `c`
       on ((`p`.`idCancion` = `c`.`idCancion`))) join `hearudb`.`autores` `a` on ((`c`.`idAutor` = `a`.`idAutor`)))
where ((`p`.`score` = 5) and (`p`.`fechaPublicacion` >= (curdate() - interval 30 day)))
group by `a`.`idAutor`
order by `totalPublicaciones` desc
limit 1;

create definer = root@localhost view rateavg as
select `c`.`idCancion` AS `idCancion`, avg(`p`.`score`) AS `scoreAverage`
from (`hearudb`.`canciones` `c` left join `hearudb`.`publicaciones` `p` on ((`p`.`idCancion` = `c`.`idCancion`)))
group by `c`.`idCancion`;

create definer = root@localhost view trendingavg as
select `hearudb`.`ts`.`idCancion`          AS `idCancion`,
       `hearudb`.`ts`.`totalPublicaciones` AS `totalPublicaciones`,
       `hearudb`.`ra`.`scoreAverage`       AS `scoreAverage`,
       `c`.`nombre`                        AS `nombreCancion`,
       `a`.`nombreAutor`                   AS `autorCancion`,
       `al`.`portada`                      AS `portadaAlbum`,
       `c`.`duracion`                      AS `duracion`
from ((((`hearudb`.`trendingsongs` `ts` join `hearudb`.`rateavg` `ra`
         on ((`hearudb`.`ts`.`idCancion` = `hearudb`.`ra`.`idCancion`))) join `hearudb`.`canciones` `c`
        on ((`hearudb`.`ts`.`idCancion` = `c`.`idCancion`))) join `hearudb`.`autores` `a`
       on ((`c`.`idAutor` = `a`.`idAutor`))) join `hearudb`.`albumes` `al` on ((`c`.`idAlbum` = `al`.`idAlbum`)));

create definer = root@localhost view trendingsongs as
select `c`.`idCancion` AS `idCancion`, count(`p`.`idPublicacion`) AS `totalPublicaciones`
from (`hearudb`.`canciones` `c` left join `hearudb`.`publicaciones` `p`
      on (((`p`.`idCancion` = `c`.`idCancion`) and (`p`.`fechaPublicacion` >= (curdate() - interval 30 day)))))
group by `c`.`idCancion`
order by `totalPublicaciones` desc
limit 50;

create
    definer = root@localhost procedure AddComment(IN p_username varchar(50), IN p_idPublicacion int, IN p_texto text,
                                                  IN p_idComentarioPadre int)
BEGIN
    IF p_idComentarioPadre IS NULL THEN
        -- Si p_idComentarioPadre es nulo, no especificamos el campo en la inserción
        INSERT INTO comentarios (nombreUsuario, idPublicacion, fecha, texto)
        VALUES (p_username, p_idPublicacion, NOW(), p_texto);
    ELSE
        -- Si p_idComentarioPadre tiene un valor, lo incluimos en la inserción
        INSERT INTO comentarios (nombreUsuario, idPublicacion, fecha, texto, idComentarioPadre)
        VALUES (p_username, p_idPublicacion, NOW(), p_texto, p_idComentarioPadre);
    END IF;
END;

create
    definer = root@localhost procedure CountFollowers(IN p_username varchar(50))
BEGIN
  SELECT COUNT(*) AS followers
  FROM follows
  WHERE followed = p_username;
END;

create
    definer = root@localhost procedure CountFollowing(IN p_username varchar(50))
BEGIN
  SELECT COUNT(*) AS following
  FROM follows
  WHERE follower = p_username;
END;

create
    definer = root@localhost procedure GetPostComments(IN p_idPublicacion int)
BEGIN
    SELECT
        c.*,
        u.profilePic
    FROM comentarios c
    LEFT JOIN usuarios u ON c.nombreUsuario = u.nombreUsuario
    WHERE c.idPublicacion = p_idPublicacion;
END;

create
    definer = root@localhost procedure GetPostInfo(IN p_idPublicacion int)
BEGIN
    SELECT
        p.idPublicacion,
        p.nombreUsuario,
        p.fechaPublicacion,
        p.score,
        p.descripcion,
        p.idAlbum,
        p.idCancion,
        p.idAutor,
        a.nombreAutor AS autor,
        al.titulo AS nombreAlbum,
        al.portada AS portadaAlbum,
        c.nombre AS nombreCancion,
        u.profilePic AS profilepic
    FROM publicaciones p
    LEFT JOIN autores a ON p.idAutor = a.idAutor
    LEFT JOIN albumes al ON p.idAlbum = al.idAlbum
    LEFT JOIN canciones c ON p.idCancion = c.idCancion
    LEFT JOIN usuarios u ON p.nombreUsuario = u.nombreUsuario
    WHERE p.idPublicacion = p_idPublicacion;
END;

create
    definer = root@localhost procedure GetRecommendedSongs(IN p_nombreUsuario varchar(50))
BEGIN
    (
    SELECT
        a.idAlbum,
        a.titulo AS tituloAlbum,
        au.nombreAutor AS nombreAutor,
        a.portada AS portadaAlbum,
        AVG(p.score) AS promedioScore
    FROM favoritos f
    JOIN canciones c ON f.idCancion = c.idCancion
    JOIN albumes a ON c.idAlbum = a.idAlbum
    JOIN autores au ON a.idAutor = au.idAutor
    LEFT JOIN publicaciones p ON c.idCancion = p.idCancion
    WHERE f.nombreUsuario = p_nombreUsuario AND a.fechaLanzamiento >= CURDATE() - INTERVAL 15 DAY
    GROUP BY a.idAlbum
    ORDER BY MAX(p.fechaPublicacion) DESC
    LIMIT 30
    )
    UNION
    (
    SELECT
        a.idAlbum,
        a.titulo AS tituloAlbum,
        au.nombreAutor AS nombreAutor,
        a.portada AS portadaAlbum,
        AVG(p.score) AS promedioScore
    FROM albumes a
    JOIN autores au ON a.idAutor = au.idAutor
    LEFT JOIN canciones c ON a.idAlbum = c.idAlbum
    LEFT JOIN favoritos f ON c.idCancion = f.idCancion AND f.nombreUsuario = p_nombreUsuario
    LEFT JOIN publicaciones p ON c.idCancion = p.idCancion
    WHERE a.fechaLanzamiento >= CURDATE() - INTERVAL 15 DAY
        AND (f.nombreUsuario = p_nombreUsuario OR f.idCancion IS NULL)
    GROUP BY a.idAlbum
    ORDER BY COUNT(DISTINCT f.idCancion) DESC
    LIMIT 30
    )
    UNION
    (
    SELECT
        a.idAlbum,
        a.titulo AS tituloAlbum,
        au.nombreAutor AS nombreAutor,
        a.portada AS portadaAlbum,
        AVG(p.score) AS promedioScore
    FROM albumes a
    JOIN autores au ON a.idAutor = au.idAutor
    LEFT JOIN canciones c ON a.idAlbum = c.idAlbum
    LEFT JOIN favoritos f ON c.idCancion = f.idCancion AND f.nombreUsuario = p_nombreUsuario
    LEFT JOIN publicaciones p ON c.idCancion = p.idCancion
    WHERE a.fechaLanzamiento >= CURDATE() - INTERVAL 15 DAY
        AND (f.nombreUsuario = p_nombreUsuario OR f.idCancion IS NULL)
    GROUP BY a.idAlbum
    ORDER BY COUNT(DISTINCT f.idCancion) DESC
    LIMIT 30
    )
    UNION
    (
    SELECT
        a.idAlbum,
        a.titulo AS tituloAlbum,
        au.nombreAutor AS nombreAutor,
        a.portada AS portadaAlbum,
        AVG(p.score) AS promedioScore
    FROM albumes a
    JOIN autores au ON a.idAutor = au.idAutor
    LEFT JOIN canciones c ON a.idAlbum = c.idAlbum
    LEFT JOIN favoritos f ON c.idCancion = f.idCancion AND f.nombreUsuario = p_nombreUsuario
    LEFT JOIN publicaciones p ON c.idCancion = p.idCancion
    WHERE a.fechaLanzamiento IS NOT NULL
        AND (f.nombreUsuario = p_nombreUsuario OR f.idCancion IS NULL)
    GROUP BY a.idAlbum
    ORDER BY a.fechaLanzamiento DESC
    LIMIT 30
    )
    ORDER BY promedioScore DESC, idAlbum
    LIMIT 30;
END;

create
    definer = root@localhost procedure GetTopRatedSongs(IN p_nombreUsuario varchar(50))
BEGIN
    SELECT c.idCancion,
           c.nombre AS nombreCancion,
           a.nombreAutor AS nombreAutor,
           al.titulo AS nombreAlbum,
           al.portada AS portadaAlbum,
           AVG(p.score) AS promedioScore,
           EXISTS (SELECT 1 FROM favoritos f WHERE f.idCancion = c.idCancion AND f.nombreUsuario = p_nombreUsuario) AS enFavoritos
    FROM publicaciones p
    JOIN canciones c ON p.idCancion = c.idCancion
    JOIN albumes al ON c.idAlbum = al.idAlbum
    JOIN autores a ON c.idAutor = a.idAutor
    WHERE p.fechaPublicacion >= CURDATE() - INTERVAL 30 DAY
    GROUP BY c.idCancion
    ORDER BY promedioScore DESC
    LIMIT 30;
END;

create
    definer = root@localhost procedure GetTrendingSongs(IN p_nombreUsuario varchar(50))
BEGIN
    SELECT ts.idCancion,
           ts.totalPublicaciones,
           ra.scoreAverage,
           c.nombre AS nombreCancion,
           a.nombreAutor AS autorCancion,
           al.portada AS portadaAlbum,
           c.duracion,
           CASE WHEN f.idFavorito IS NOT NULL THEN true ELSE false END AS enFavoritos
    FROM trendingSongs ts
    JOIN rateAvg ra ON ts.idCancion = ra.idCancion
    JOIN canciones c ON ts.idCancion = c.idCancion
    JOIN autores a ON c.idAutor = a.idAutor
    JOIN albumes al ON c.idAlbum = al.idAlbum
    LEFT JOIN favoritos f ON ts.idCancion = f.idCancion AND f.nombreUsuario = p_nombreUsuario
    LIMIT 50;
END;

create
    definer = root@localhost procedure Search(IN p_query varchar(255))
BEGIN
    -- Buscar entre autores
    SELECT idAutor AS id, nombreAutor AS nombre, foto AS foto, NULL AS autor, 'artista' AS descripcion,
           CASE WHEN nombreAutor LIKE p_query THEN 3
                WHEN nombreAutor LIKE CONCAT(p_query, '%') THEN 2
                WHEN nombreAutor LIKE CONCAT('%', p_query, '%') THEN 1
                ELSE 0
           END AS likeness
    FROM autores
    WHERE nombreAutor LIKE CONCAT('%', p_query, '%')

    UNION

    -- Buscar entre álbumes
    SELECT idAlbum AS id, titulo AS nombre, portada AS foto, (
        SELECT nombreAutor FROM autores WHERE idAutor = albumes.idAutor
    ) AS autor, 'album' AS descripcion,
           CASE WHEN titulo LIKE p_query THEN 3
                WHEN titulo LIKE CONCAT(p_query, '%') THEN 2
                WHEN titulo LIKE CONCAT('%', p_query, '%') THEN 1
                ELSE 0
           END AS likeness
    FROM albumes
    WHERE titulo LIKE CONCAT('%', p_query, '%')

    UNION

    -- Buscar entre canciones
    SELECT c.idCancion AS id, c.nombre AS nombre, a.portada AS foto, au.nombreAutor AS autor, 'cancion' AS descripcion,
           CASE WHEN c.nombre LIKE p_query THEN 3
                WHEN c.nombre LIKE CONCAT(p_query, '%') THEN 2
                WHEN c.nombre LIKE CONCAT('%', p_query, '%') THEN 1
                ELSE 0
           END AS likeness
    FROM canciones c
    LEFT JOIN albumes a ON c.idAlbum = a.idAlbum
    LEFT JOIN autores au ON c.idAutor = au.idAutor
    WHERE c.nombre LIKE CONCAT('%', p_query, '%')

    UNION

    -- Buscar entre usuarios
    SELECT nombreUsuario AS id, nombreUsuario AS nombre, usuarios.profilePic AS foto, NULL AS autor, 'usuario' AS descripcion,
           CASE WHEN nombreUsuario LIKE p_query THEN 3
                WHEN nombreUsuario LIKE CONCAT(p_query, '%') THEN 2
                WHEN nombreUsuario LIKE CONCAT('%', p_query, '%') THEN 1
                ELSE 0
           END AS likeness
    FROM usuarios
    WHERE nombreUsuario LIKE CONCAT('%', p_query, '%')

    ORDER BY likeness DESC;
END;

create
    definer = root@localhost procedure addToFavorites(IN nombreUsuario varchar(50), IN idCancion int)
BEGIN
    INSERT INTO favoritos(nombreUsuario, idCancion)
    VALUES (nombreUsuario, idCancion);
END;

create
    definer = root@localhost procedure authenticate(IN nombreUsuario varchar(50), IN contrasena varchar(50))
BEGIN
    SELECT *
    FROM usuarios u
    WHERE u.nombreUsuario = nombreUsuario AND u.contrasena = contrasena;
END;

create
    definer = root@localhost procedure checkEmail(IN correo varchar(50))
BEGIN
    SELECT *
    FROM usuarios u
    WHERE u.correo = correo;
END;

create
    definer = root@localhost procedure checkUsername(IN nombreUsuario varchar(50))
BEGIN
    SELECT *
    FROM usuarios u
    WHERE u.nombreUsuario = nombreUsuario;
END;

create
    definer = root@localhost procedure followUser(IN p_follower varchar(50), IN p_followed varchar(50))
BEGIN
    -- Verifica si la relación ya existe
    IF NOT EXISTS (
        SELECT 1
        FROM follows
        WHERE follower = p_follower AND followed = p_followed
    ) THEN
        -- Agrega el registro a la tabla follows
        INSERT INTO follows (follower, followed)
        VALUES (p_follower, p_followed);
    END IF;
END;

create
    definer = root@localhost procedure getAlbum(IN idAlbum int)
BEGIN
    SELECT
        a.titulo AS tituloAlbum,
        au.nombreAutor AS nombreAutor,
        g.nombreGenero AS nombreGenero,
        a.disquera,
        a.portada,
        a.fechaLanzamiento,
        AVG(ra.scoreAverage) AS promedioRateAlbum
    FROM albumes a
    LEFT JOIN autores au ON a.idAutor = au.idAutor
    LEFT JOIN generos g ON a.idGenero = g.idGenero
    LEFT JOIN rateAvg ra ON ra.idCancion IN (SELECT idCancion FROM canciones WHERE idAlbum = a.idAlbum)
    WHERE a.idAlbum = idAlbum
    GROUP BY a.idAlbum;
END;

create
    definer = root@localhost procedure getAlbumSongs(IN idAlbum int, IN nombreUsuario varchar(50))
BEGIN
    SELECT
        c.idCancion,
        c.nombre AS nombreCancion,
        c.duracion AS duracionCancion,
        ra.scoreAverage AS promedioRateCancion,
        CASE WHEN f.idFavorito IS NOT NULL THEN TRUE ELSE FALSE END AS enFavoritos
    FROM canciones c
    LEFT JOIN rateAvg ra ON ra.idCancion = c.idCancion
    LEFT JOIN favoritos f ON f.idCancion = c.idCancion AND f.nombreUsuario = nombreUsuario
    WHERE c.idAlbum = idAlbum;
END;

create
    definer = root@localhost procedure getArtistSongs(IN idAutor int, IN nombreUsuario varchar(50))
BEGIN
    SELECT
        c.idCancion,
        c.nombre AS nombreCancion,
        a.portada AS portadaAlbum,
        c.duracion AS duracionCancion,
        AVG(p.score) AS RateAvg,
        MAX(CASE WHEN f.idFavorito IS NOT NULL THEN TRUE ELSE FALSE END) AS enFavoritos
    FROM canciones c
    LEFT JOIN publicaciones p ON c.idCancion = p.idCancion
    LEFT JOIN albumes a ON c.idAlbum = a.idAlbum
    LEFT JOIN favoritos f ON c.idCancion = f.idCancion AND f.nombreUsuario = nombreUsuario
    WHERE c.idAutor = idAutor
    GROUP BY c.idCancion
    ORDER BY RateAvg DESC;
END;

create
    definer = root@localhost procedure getCancionInfo(IN p_idCancion int)
BEGIN
    -- Devuelve el idAlbum y idAutor de la canción
    SELECT idAlbum, idAutor
    FROM canciones
    WHERE idCancion = p_idCancion;
END;

create
    definer = root@localhost procedure getFeed(IN p_nombreUsuario varchar(50))
BEGIN
    SELECT
        p.idPublicacion,
        p.nombreUsuario AS nombreUsuarioPublicacion,
        u.profilePic AS profilepic,
        c.nombre AS tituloCancion,
        p.fechaPublicacion,
        a.portada AS portadaAlbum,
        c.nombre AS nombreCancion,
        p.score
    FROM follows f
    JOIN publicaciones p ON f.followed = p.nombreUsuario
    JOIN usuarios u ON p.nombreUsuario = u.nombreUsuario
    LEFT JOIN albumes a ON p.idAlbum = a.idAlbum
    LEFT JOIN canciones c ON p.idCancion = c.idCancion
    WHERE f.follower = p_nombreUsuario
    ORDER BY p.fechaPublicacion DESC;
END;

create
    definer = root@localhost procedure getSongDetails(IN p_idCancion int)
BEGIN
    -- Devuelve información detallada sobre la canción, incluyendo la portada del álbum
    SELECT
        c.idCancion,
        c.nombre AS nombreCancion,
        a.nombreAutor AS autor,
        g.nombreGenero AS genero,
        c.duracion,
        al.portada AS portadaAlbum,
        AVG(p.score) AS promedioScore
    FROM canciones c
    LEFT JOIN autores a ON c.idAutor = a.idAutor
    LEFT JOIN generos g ON c.idGenero = g.idGenero
    LEFT JOIN albumes al ON c.idAlbum = al.idAlbum
    LEFT JOIN publicaciones p ON c.idCancion = p.idCancion
    WHERE c.idCancion = p_idCancion
    GROUP BY c.idCancion;
END;

CREATE DEFINER = root@localhost PROCEDURE getSongInfo(IN p_idCancion INT, IN p_nombreUsuario VARCHAR(50))
BEGIN
    -- Devuelve información detallada sobre la canción, incluyendo la foto de portada del álbum
    SELECT
        c.*,
        a.portada AS portadaAlbum,
        CASE WHEN f.idFavorito IS NOT NULL THEN TRUE ELSE FALSE END AS enFavoritos
    FROM canciones c
    LEFT JOIN favoritos f ON c.idCancion = f.idCancion AND f.nombreUsuario = p_nombreUsuario
    LEFT JOIN albumes a ON c.idAlbum = a.idAlbum
    WHERE c.idCancion = p_idCancion;
END;

create
    definer = root@localhost procedure getSongPosts(IN p_idCancion int, IN p_nombreUsuario varchar(50))
BEGIN
    -- Devuelve las publicaciones de la canción ordenadas por criterios específicos
    SELECT
        p.idPublicacion,
        u.profilepic,
        p.nombreUsuario,
        p.descripcion,
        p.score
    FROM publicaciones p
    JOIN usuarios u ON p.nombreUsuario = u.nombreUsuario
    WHERE p.idCancion = p_idCancion
    ORDER BY
        CASE WHEN p.nombreUsuario IN (SELECT followed FROM follows WHERE follower = p_nombreUsuario) THEN 0 ELSE 1 END,
        p.fechaPublicacion DESC;
END;

create
    definer = root@localhost procedure getUserPublications(IN nombreUsuario varchar(50))
BEGIN
    SELECT
        p.idPublicacion,
        p.nombreUsuario,
        c.nombre AS nombreCancion,
        a.portada AS portadaAlbum,
        au.nombreAutor AS nombreAutor,
        p.score AS rate,
        p.fechaPublicacion
    FROM publicaciones p
    JOIN canciones c ON p.idCancion = c.idCancion
    LEFT JOIN albumes a ON c.idAlbum = a.idAlbum
    LEFT JOIN autores au ON c.idAutor = au.idAutor
    WHERE p.nombreUsuario = nombreUsuario
    ORDER BY p.fechaPublicacion DESC;
END;

create
    definer = root@localhost procedure insertUser(IN nombreUsuario varchar(50), IN nombre varchar(50),
                                                  IN correo varchar(50), IN contrasena varchar(50))
BEGIN
    INSERT INTO usuarios(nombreUsuario, nombre, correo, contrasena)
    VALUES (nombreUsuario, nombre, correo, contrasena);
END;

create
    definer = root@localhost procedure onfollow(IN p_follower varchar(50), IN p_followed varchar(50))
BEGIN
    DECLARE followerCount INT;

    -- Verifica si el primer usuario sigue al segundo
    SELECT COUNT(*) INTO followerCount
    FROM follows
    WHERE follower = p_follower AND followed = p_followed;

    -- Devuelve el resultado
    SELECT followerCount > 0 AS onfollow;
END;

create
    definer = root@localhost procedure publishRate(IN nombreUsuario varchar(50), IN fechaPublicacion datetime,
                                                   IN score int, IN descripcion text, IN idAlbum int, IN idCancion int,
                                                   IN idAutor int)
BEGIN
    INSERT INTO publicaciones(nombreUsuario, fechaPublicacion, score, descripcion, idAlbum, idCancion, idAutor)
    VALUES (nombreUsuario, fechaPublicacion, score, descripcion, idAlbum, idCancion, idAutor);
END;

create
    definer = root@localhost procedure removeFromFavorites(IN nombreUsuario varchar(50), IN idCancion int)
BEGIN
    DELETE FROM favoritos
    WHERE nombreUsuario = nombreUsuario AND idCancion = idCancion;
END;

create
    definer = root@localhost procedure unfollowUser(IN p_follower varchar(50), IN p_followed varchar(50))
BEGIN
    -- Elimina el registro de la tabla follows
    DELETE FROM follows
    WHERE follower = p_follower AND followed = p_followed;
END;