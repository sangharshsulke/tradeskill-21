-- TradeSkill database: schema + demo data
-- Import in phpMyAdmin: select your database -> Import -> choose this file -> Go
-- (Do NOT include a CREATE DATABASE; Hostinger creates the database for you.)
-- Demo login: elena@tradeskill.dev / password123 (all demo members use password123)
-- WARNING: drops and recreates all TradeSkill tables.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS exchange_requests;
DROP TABLE IF EXISTS listing_curriculum;
DROP TABLE IF EXISTS skill_listings;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Members (login + public profile)
CREATE TABLE users (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name                VARCHAR(120) NOT NULL,
  email               VARCHAR(190) NOT NULL UNIQUE,
  password_hash       VARCHAR(100) NOT NULL,
  role                VARCHAR(160) NOT NULL DEFAULT '',
  title               VARCHAR(80)  NOT NULL DEFAULT 'New Member',
  badge               VARCHAR(40)  NULL,
  company             VARCHAR(120) NULL,
  location            VARCHAR(120) NOT NULL DEFAULT '',
  timezone            VARCHAR(20)  NOT NULL DEFAULT 'UTC+0',
  availability        VARCHAR(60)  NOT NULL DEFAULT 'Flexible',
  avatar_url          VARCHAR(500) NOT NULL DEFAULT '',
  bio                 TEXT NULL,
  verified            TINYINT(1)   NOT NULL DEFAULT 0,
  trust_score         TINYINT UNSIGNED NOT NULL DEFAULT 80,
  mutual_match_pct    TINYINT UNSIGNED NOT NULL DEFAULT 80,
  rating              DECIMAL(3,2) NOT NULL DEFAULT 0,
  rating_count        INT UNSIGNED NOT NULL DEFAULT 0,
  swaps_count         INT UNSIGNED NOT NULL DEFAULT 0,
  credential_title    VARCHAR(160) NULL,
  credential_issuer   VARCHAR(160) NULL,
  available_this_week TINYINT(1)   NOT NULL DEFAULT 1,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- A member's own Teach / Learn skill profile (Dashboard > My Skills, People > Expertise)
CREATE TABLE user_skills (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  type         ENUM('teach','learn') NOT NULL,
  title        VARCHAR(160) NOT NULL,
  description  TEXT NOT NULL,
  hours_spent  DECIMAL(6,1) NOT NULL DEFAULT 0,
  status       ENUM('active','paused') NOT NULL DEFAULT 'active',
  metric_note  VARCHAR(120) NOT NULL DEFAULT '',
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_skills_user (user_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Marketplace listings (Skills page)
CREATE TABLE skill_listings (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id             INT UNSIGNED NOT NULL,
  teaches             VARCHAR(200) NOT NULL,
  wants               VARCHAR(200) NOT NULL,
  category            ENUM('tech','creative','languages','music','business') NOT NULL,
  tier_badge          VARCHAR(40)  NOT NULL DEFAULT 'Intermediate',
  tier_badge_bg       VARCHAR(120) NOT NULL DEFAULT 'bg-primary-fixed text-on-primary-fixed-variant',
  ratio_label         VARCHAR(60)  NOT NULL DEFAULT '1:1 Mutual Exchange',
  hours_per_week      VARCHAR(40)  NOT NULL DEFAULT '1 hr / week',
  cycle_weeks         VARCHAR(40)  NULL,
  format_badge        VARCHAR(60)  NOT NULL DEFAULT '1:1 Video Call',
  prerequisites       VARCHAR(255) NULL,
  mutual_deliverable  VARCHAR(255) NULL,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_listings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_listings_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE listing_curriculum (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id   INT UNSIGNED NOT NULL,
  num          TINYINT UNSIGNED NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  VARCHAR(500) NOT NULL DEFAULT '',
  CONSTRAINT fk_curriculum_listing FOREIGN KEY (listing_id) REFERENCES skill_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exchange requests ("Request Trade" -> Dashboard > Requests)
CREATE TABLE exchange_requests (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  from_user_id  INT UNSIGNED NOT NULL,
  to_user_id    INT UNSIGNED NOT NULL,
  listing_id    INT UNSIGNED NULL,
  offers        VARCHAR(200) NOT NULL,
  wants         VARCHAR(200) NOT NULL,
  note          TEXT NULL,
  ratio_type    VARCHAR(40) NOT NULL DEFAULT '1:1 Direct',
  status        ENUM('pending','accepted','declined') NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_req_from FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_req_to   FOREIGN KEY (to_user_id)   REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_req_listing FOREIGN KEY (listing_id) REFERENCES skill_listings(id) ON DELETE SET NULL,
  INDEX idx_req_to (to_user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Scheduled exchange sessions (Sessions page). Stored from the proposer's side;
-- the API flips "you"/"peer" fields depending on who is asking.
CREATE TABLE sessions (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  proposer_id      INT UNSIGNED NOT NULL,
  partner_id       INT UNSIGNED NOT NULL,
  request_id       INT UNSIGNED NULL,
  proposer_teaches VARCHAR(200) NOT NULL,
  partner_teaches  VARCHAR(200) NOT NULL,
  proposer_mins    SMALLINT UNSIGNED NOT NULL DEFAULT 45,
  partner_mins     SMALLINT UNSIGNED NOT NULL DEFAULT 45,
  time_label       VARCHAR(120) NOT NULL,
  date_group       VARCHAR(60)  NULL,
  status           ENUM('pending','confirmed','starting-soon','rescheduled','needs-rescheduling','completed','declined','cancelled') NOT NULL DEFAULT 'pending',
  note             TEXT NULL,
  completed_at     DATETIME NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sess_proposer FOREIGN KEY (proposer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_sess_partner  FOREIGN KEY (partner_id)  REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_sess_request  FOREIGN KEY (request_id)  REFERENCES exchange_requests(id) ON DELETE SET NULL,
  INDEX idx_sess_proposer (proposer_id, status),
  INDEX idx_sess_partner (partner_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ratings of learning partners
CREATE TABLE reviews (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id   INT UNSIGNED NULL,
  reviewer_id  INT UNSIGNED NOT NULL,
  reviewee_id  INT UNSIGNED NOT NULL,
  rating       DECIMAL(2,1) NOT NULL,
  comment      TEXT NOT NULL,
  swapped_for  VARCHAR(200) NOT NULL DEFAULT '',
  session_mins SMALLINT UNSIGNED NOT NULL DEFAULT 60,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rev_session  FOREIGN KEY (session_id)  REFERENCES sessions(id) ON DELETE SET NULL,
  CONSTRAINT fk_rev_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
  UNIQUE KEY uq_review_once (session_id, reviewer_id),
  INDEX idx_rev_reviewee (reviewee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contact page support form
CREATE TABLE support_tickets (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_code  VARCHAR(20) NOT NULL UNIQUE,
  user_id      INT UNSIGNED NULL,
  full_name    VARCHAR(120) NOT NULL,
  email        VARCHAR(190) NOT NULL,
  category     VARCHAR(60)  NOT NULL,
  message      TEXT NOT NULL,
  status       ENUM('open','closed') NOT NULL DEFAULT 'open',
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------- Demo data ----------------
SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `title`, `badge`, `company`, `location`, `timezone`, `availability`, `avatar_url`, `bio`, `verified`, `trust_score`, `mutual_match_pct`, `rating`, `rating_count`, `swaps_count`, `credential_title`, `credential_issuer`, `available_this_week`, `created_at`) VALUES (1,'Elena Rostova','elena@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Senior Frontend Lead','Exchange Pioneer',NULL,NULL,'Lisbon (UTC+0)','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuCqYkvUVDx90OoMqyUCT73GI1Co1tq7PlgE8pCbafW-s5bhJ7c_l2JIs92y7OpPo1VYBymEAJWQa9P2De8Q_0VeLughqetvKz0BkfXlQfsuI1vHcEO2xvqTBxAu87yMK_ss4Xteq1Js6WYUgBfPqCK2oo-xqYSwdy9QU0kJiLmqrQcvpYwOZFlGscV8UXFDIXd20j9E-ODfY45xbgYfh7QGd4fE22ZaAgDuzMFFdXbQnnmd3jDukoA',NULL,1,98,85,4.95,19,19,NULL,NULL,1,'2026-10-22 15:12:43'),
(2,'Elena Vance','elena.vance@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Staff Product Designer','Exchange Member','Pro','FinCorp','Berlin (UTC+1)','UTC+1','Available Sat','https://lh3.googleusercontent.com/aida-public/AB6AXuBiC7FCA0Bj4QwGnU9OD1KdSSMqS3t2_UtTbnDR_buOnQtp4OwT7U7DJar0T_6T70HLeglDGr2m_saQyTgc_naw7vUhdWnKyMCCubBEzTWOzHigYisXtaTdjdCPOn9MsJ5T75vdWrmUqIzZ9Vv4NKslnHm1FuKgJRSj6AgyU9c2rvqjh4WjyJrsuVHQmZgy31ZrpObvdbBQcGSoYihTYxp7Xg9kNHuutucqv_xExT5-SS8Ou0tyCU0','\"I believe design systems should bridge engineers and creatives seamlessly. I\'m patient with code beginners, and I want an exchange partner who enjoys breaking down algorithmic problem-solving step by step.\"',1,90,98,4.95,31,31,'Design Tokens 2.0 Certified','Figma Guild Official',1,'2026-10-22 15:12:43'),
(3,'Tariq Mansour','tariq.mansour@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Senior Engineer','Exchange Member','Verified','CloudBase','London (UTC+0)','UTC+0','Weekday eves','https://lh3.googleusercontent.com/aida-public/AB6AXuCvszd_QyZDOFuEQZWUwtGZN1SIJXFom_cngY-N8pMRLceKQjvuln9xBmmPVDnOiy4HgbSQHQnXYeXjL2I3pO3PjUOSDqb2jz2UHa-mYaBqJGDjUx7F6jEQY89XcHuVZegxwtfdYSOLPtogBEOF62nYPsHJeA-HdusDr48I_qb4GyOaeOhBzVys0lIU9trAKNfik16GBWyJYd6e8gHcF6TsNHtIHlHej9CwEcPRIPrAXkQP5N4rbgc','\"Building infrastructure shouldn\'t be intimidating. I offer clean mental models for Docker, async queues, and APIs. Looking to level up my UX validation to make my open-source tools friendlier.\"',1,90,94,4.89,19,19,'Certified Kubernetes Administrator (CKA)','Linux Foundation',1,'2026-10-22 15:12:43'),
(4,'Maya Lin','maya.lin@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Lead UX Researcher','Exchange Member','Mentor','HealthScale','Amsterdam (UTC+1)','UTC+1','Instant Match','https://lh3.googleusercontent.com/aida-public/AB6AXuBf3eKkhXS9LqrZ5DKojtYMNZSMJYPQ1ovw2GyDFNhLR08XS8I6_hJEvJv4v9ehkXk9FRnMQ1TP4bpWclBe4sTTT4wQZTMF2B7Ghg8Q0wzz0SXrhWRJq4rttA6w2B3InUbLTe7AJYn64DOGgc8alBEEBgCfvssEJHzZKv3PHX_HgDGJMzcgxEoaI6CMQWooeIMFMFA1o-XA1LrVt9gubjHA-NZ24c6wm08E5QlI4qFqqcx1NK2xC20','\"Qualitative research is a superpower. I\'ll teach you how to write interview scripts that avoid bias. In return, I want to conquer SQL subqueries and automate my own dashboard pipelines!\"',1,90,91,5.00,27,27,'Human-Centered Research Fellow','MIT Media Lab',1,'2026-10-22 15:12:43'),
(5,'Julian Morales','julian.morales@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Concert Guitarist & Composer','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuAGlvAi8kZKsN2Xbzp3xZ1NuUypqlbAPDHT9qrvhKZsOMqYvQVJdoJiewJL5ahEbflrLxPsYO6zc89fTi65QMsDQdMaQOho1H5xT_WAFkD8EUO8oP8l22412xL6CO9DC0gg6TsQQ3ZWXqUh_upiA6zJGnycduhXN-lpDxWXu7znBgc1-sx7G3q7UesHeswJswdSq5ZXBKvgKKc7MjcIzmJNFDQZNzRKSt1cIlM4inYBv0GBhxEIuuk',NULL,1,90,88,4.90,42,42,NULL,NULL,1,'2026-10-22 15:12:43'),
(6,'Mateo Silva','mateo.silva@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Concert Guitarist & Educator','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuCpEqpkXnnphGckSsuyc-tS5SO-rW7M3ewnsTYxYZvBtOT5gI0le7t7kRZZ4XmFcuUwqjHKb8BB_oe2g81gLhVrwJIkC6scaxQfUykLghXDqn5uXk7BmjY2eQ1K9SO-NBf_ZSFrF_V9aEvglwkYL8oe5CGE0SsocJMKnmyiJgU3RtjxrH9t4tfgncq-nfDhKPNyfgrvZtoXhPC4p4I_H9uDlN7N0o_xcaFhieTnN0WBDsRzMQ7yB_M',NULL,1,90,88,4.80,31,31,NULL,NULL,1,'2026-10-22 15:12:43'),
(7,'Kenji Takahashi','kenji.takahashi@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Design Systems Architect','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuDi9a3oDf26lGVFZU0YfEdf282taP7MkaxgL6dRoBuMczdz1eUmTeacPz9gTHIn9NSsJsQrdrJRuZvDHNLH0OjWga2yk5Q38IIIsgjaSLoxTASf9mtReGY2G6YvRw3vKeKd_Z4oTPQFrSrGE9Tg7WOCXrpyE7r4pKytCPZ-i7rvijiaOVifhqCaMPNwCyhq4aLYjADWxNpe6mQm4sH3AJxPjrbvBddr5Hu-u8_t2xemq5nPgfW82yc',NULL,1,90,88,5.00,18,18,NULL,NULL,1,'2026-10-22 15:12:43'),
(8,'Marcus Thorne','marcus.thorne@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Audio Engineer & Sound Designer','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuDTJlFIoJLodsNxNP9sRPQ7WaFoEMRLqXQcT0hgpnHeflHbQPkCNL7FzvYUeXgcPHS85X8lFXuuXY__JgjyFpKWiP9LNIvFigBy9ydJwFBa9x4sNoCT-VdH2Dtg0rETpFEtC8bWsY73FoY_o2iC0urUAgu8GGsmQNcTCjCqIS9y1pSAUmC4v2rt1DTTyzCJpMASfojS9AmJMtkRvBRGVF-2vWELZ7lxuFS0q17op3WFQAXNrTi0fpk',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(9,'Chloe Chen','chloe.chen@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Tech Founder & Mobile Architect','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuAWag059AbfWK49fMEWnb3iwBYks4G2hiPqNHiRPsWWLvj2_zo8tRZ99P3TW8bCD0fgdg7X5mDo8-4oJYwphVOJLH4zvk4QSSObpypSOOGmQpWlDokgmrriG5mVufl_MdFgCxHKdjfI4nisSdtdqw0PyEX5BQ-1EuzJ6UcvO6PfeZG__bocoslTQ2wFGQM_98W0UlAkc1VvqWlSRJ9yWxOmoIU7I8lGCKPFVpX0nzBx9CaqgCTRHW8',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(10,'Liam Vance','liam.vance@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Senior Product Designer @ Neobank','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuASk3KxJaOcZGvpeQZ0LcBnfFe3sg_EnaDJBgJ-Jcl3BpH1Bzr4O_pi2OKhEUXZcMj5FNF6C6iD3lVKAiPb6wDQN4rNqKP9MNQ6wdPt6pfwDg83tTu4Tr4bdFelPx8k-SGTYZzWN3kQ7KZMXBuBlzG8eGhmEzvUi9zCYVQQHMkpxWvwZwzlJ6VcqKg0BcApQXpKTpJQfP_to9eBGc7yJv_mE1Nc_1U8JtIcsigchHfv6kueYB_wb60',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(11,'Samir Kulkarni','samir.kulkarni@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Data Scientist & ML Researcher','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuClMnvkyZ73pS01HKC9KpNuUimtV38U2Awd0usCgC4ds8MJwtPvL__EMa-7swjaypS0pX78lyvFTnL3D_ZsCmleldB7HrMaONnm_qUWmmeZ_Hl0woxfahwsdSOuQeTY1BMDZVS8guw7tUxYTV3YanJVzd8WRCie5x5ohFKlvgaz27xt0k0xWbGAzawau_l-4bspI7aelh9yj2laSZJlF-Kk7_k-OSfgiqEjdcMvAkFmIKKAHOHWu5E',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(12,'Elena Rossi','elena.rossi@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Senior Frontend Lead','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuAzLf_34q9bLcL0uIu4mXfL_tZWlebpPLOYN9dD3wCIypf2GekFZYNnCL5WAuPyPr3tXUYf4aVa18muJDDmqnhM394HtPKIXa38q3dhlCNHXy2FcKbAw6gHhwcs-xKBPwuhv4oS6HWOeNigGhFf67a6hf1c0XxlD6MNjZzY4yToT5PWN-vaYHXb0_dXNFYZYaSGVc6aiu0FnUkPMaWMxU6H-m7hjjdJpcKvkvzO5fTIcIKeN1yBtGw',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(13,'David O\'Reilly','david.oreilly@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Senior Copywriter & Brand Strategist','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuCUYgN2uQm7c8M2CF2kcqyGARa9gzoa9ajdqmw3wH2VSNHADFXaZJxw4JOR9PRSy8dDtOg8ybDhbxLbFa419CgQIo-76sIQjjXy6pF4bgJibuqlPSh7K65nnIboziJxnhuBjDYYMOo4_7iKQ5Pdkl2R9zxHYQByts7iY-57ulQbNimkiQaqe8VX3v2QFQ-CPxbLt_-2yc0XjQJ1KzVV6WhTVEV7mYe0oLubxsTahkgVobkb7UanJLs',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(14,'Sarah Jenkins','sarah.jenkins@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Watercolor Illustrator','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuAUeU4vNriV4xRHmLaWWi2t3RISzN4DUQ36qtln9n77kpe15x96nYDodJt9okhsCMh_bNV8VLLIpquTT9Uw_emwChxgrmSfveWwCQMrKPjZCIol69DhwoGfwDbXPl_reCZtg-tMpCtrzHK92HzJaZJDXDPjuKNjIkRY7XDLglGfmQ51Q4denX_LF2MpT2R2hYrtSebGT9cFGPqKSIlee177mvMllvKqP3QO4nn3DghZW0OU7NrtA6M',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(15,'Soraya Chen','soraya.chen@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Compiler Engineer','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuA3YNqvuWa24KUxsrByQg7UoNY8X4OszOHhloJTQCtxtqWfe8tO-7rZ9rhKuQZGtBPWVXu-bfjL93b3Lu13r0aEvfEYHj1ot80fh54Rf63G9qs7-9RcbRlVIdJ3G60jZkOr3K0CrM_CLCnw4NyxwrQ4HD4KMM3cb7oEOkeNOLd2DJd-QAW1AW99s8TIB4TybG11AGCeroAer7bjuoin_ESp_KdD4QJO6H24I1ZY3mq3j6nWgm7IG64',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(16,'Julian K.','julian.k@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','TradeSkill Member','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://ui-avatars.com/api/?background=random&name=Julian%20K.',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(17,'Sven B.','sven.b@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','TradeSkill Member','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://ui-avatars.com/api/?background=random&name=Sven%20B.',NULL,1,90,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43'),
(18,'Marcus Vance','marcus.vance@tradeskill.dev','$2b$10$HRCnwYmmmTIMVpsGTMcZTujHClCnyrcjxRKqgvG6suDZGWuC/.rsm','Design Lead','Exchange Member',NULL,NULL,'','UTC+0','Flexible','https://lh3.googleusercontent.com/aida-public/AB6AXuB2iQcjddADLrTAqm3fEKpiZQ_hEWnyaP8laiBu4BtZsB9ykSAEIrjHL0s1wJeA9-QMLYEglCvcWrkL2r4aKZeISfE3wqAas5FhmiOWVfkdd13nSY_LBX1ZHirgJu8D-L2sciB_JpMaWBrIDRtpnFhnxHpAi4292TucFty6qGCBOVujvV_p_iXcKVMCyNUDJS8pThMm36uLeiohlvV-JlMRnp8VGmMzbimWz2ldUF2_ZJY5i5XRYn8',NULL,1,99,85,4.80,10,10,NULL,NULL,1,'2026-10-22 15:12:43');
INSERT INTO `user_skills` (`id`, `user_id`, `type`, `title`, `description`, `hours_spent`, `status`, `metric_note`, `created_at`, `updated_at`) VALUES (1,1,'learn','Japanese N5 Conversational','Pronunciation nuances, practical restaurant and transit dialogues, and Hiragana/Katakana daily drills.',16.0,'active','2 Active Mentors','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(2,1,'teach','UI Prototyping','Figma component variants, advanced physics curves, realistic handoff specs, and delightful micro-interactions.',8.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(3,1,'teach','Senior React Mentoring','Deep-dive architecture, custom hooks, SSR debugging, and state machines with real-world codebase walk-throughs.',14.0,'active','1:1 Hour Credit Equivalence','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(4,2,'teach','Figma Tokens','Teaching Figma Tokens.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(5,2,'teach','Design Systems','Teaching Design Systems.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(6,2,'teach','Design Handoff','Teaching Design Handoff.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(7,2,'learn','Python Data Analysis','Learning Python Data Analysis.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(8,2,'learn','Pandas','Learning Pandas.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(9,2,'learn','Jupyter Workflows','Learning Jupyter Workflows.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(10,3,'teach','FastAPI Architecture','Teaching FastAPI Architecture.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(11,3,'teach','Dockerization','Teaching Dockerization.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(12,3,'teach','CI/CD Pipelines','Teaching CI/CD Pipelines.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(13,3,'learn','UX Prototyping','Learning UX Prototyping.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(14,3,'learn','User Testing','Learning User Testing.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(15,3,'learn','Figma Wireframing','Learning Figma Wireframing.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(16,4,'teach','Usability Testing','Teaching Usability Testing.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(17,4,'teach','Journey Mapping','Teaching Journey Mapping.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(18,4,'teach','User Interviews','Teaching User Interviews.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(19,4,'learn','SQL for Analytics','Learning SQL for Analytics.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(20,4,'learn','Dashboarding','Learning Dashboarding.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(21,4,'learn','PostgreSQL Basics','Learning PostgreSQL Basics.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(22,5,'teach','Classical & Flamenco Guitar Technique','Teaching Classical & Flamenco Guitar Technique.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(23,5,'learn','SEO & Technical Website Audit','Learning SEO & Technical Website Audit.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(24,6,'teach','Fingerstyle Acoustic Guitar & Chord Voicings','Teaching Fingerstyle Acoustic Guitar & Chord Voicings.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(25,6,'learn','Audio Editing & Podcast Mastering (Logic Pro)','Learning Audio Editing & Podcast Mastering (Logic Pro).',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(26,7,'teach','Design Systems & Figma Component Mastery','Teaching Design Systems & Figma Component Mastery.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(27,7,'learn','B2B SaaS Growth & GTM Positioning','Learning B2B SaaS Growth & GTM Positioning.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(28,8,'teach','Podcast Audio','Teaching Podcast Audio.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(29,8,'learn','SEO Strategy','Learning SEO Strategy.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(30,9,'teach','React Native','Teaching React Native.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(31,9,'learn','Design Systems','Learning Design Systems.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(32,10,'teach','German Basics','Teaching German Basics.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(33,10,'learn','UX Research','Learning UX Research.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(34,11,'teach','Python Data Visuals','Teaching Python Data Visuals.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(35,11,'learn','User Journey Mapping','Learning User Journey Mapping.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(36,12,'teach','Architectural 3D Modeling','Teaching Architectural 3D Modeling.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(37,12,'learn','Figma Auto-Layout & Tokens','Learning Figma Auto-Layout & Tokens.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(38,13,'teach','Brand Storytelling','Teaching Brand Storytelling.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(39,13,'learn','UX Wireframes','Learning UX Wireframes.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(40,14,'teach','Watercolour 101','Teaching Watercolour 101.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(41,14,'learn','Webflow CMS','Learning Webflow CMS.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(42,15,'teach','TypeScript AST Parsing','Teaching TypeScript AST Parsing.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(43,15,'learn','Senior React Mentoring','Learning Senior React Mentoring.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(44,18,'teach','Design Systems','Teaching Design Systems.',0.0,'active','Instant Swap Ready','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(45,18,'learn','Senior React Mentoring','Learning Senior React Mentoring.',0.0,'active','Looking for Mentor','2026-10-22 15:12:43','2026-10-22 15:12:43');
INSERT INTO `skill_listings` (`id`, `user_id`, `teaches`, `wants`, `category`, `tier_badge`, `tier_badge_bg`, `ratio_label`, `hours_per_week`, `cycle_weeks`, `format_badge`, `prerequisites`, `mutual_deliverable`, `created_at`) VALUES (1,5,'Classical & Flamenco Guitar Technique','SEO & Technical Website Audit','music','Intermediate','bg-primary-fixed text-on-primary-fixed-variant','Direct 1:1','1 hr / week',NULL,'1:1 Video Call','Nylon string classical guitar, willingness to drill technique','Mastery of a traditional flamenco falseta','2026-10-22 15:12:43'),
(2,6,'Fingerstyle Acoustic Guitar & Chord Voicings','Audio Editing & Podcast Mastering (Logic Pro)','music','Beginner Friendly','bg-secondary-container text-on-secondary-container','1:1 Mutual Exchange','1.5 hrs / week',NULL,'Live Jam Practice','Basic acoustic guitar, tuning ability, basic open chords','1 Recorded instrumental song duet + audio critique','2026-10-22 15:12:43'),
(3,7,'Design Systems & Figma Component Mastery','B2B SaaS Growth & GTM Positioning','creative','Master','bg-tertiary-fixed text-on-tertiary-fixed','1:1 Mutual Exchange','2 hrs / week','Bi-weekly review','Async Video Critiques','Figma intermediate familiarity, basic UI layouts','Complete verified token library + handoff document','2026-10-22 15:12:43'),
(4,1,'Modern React & TypeScript Architecture','Conversational Italian & Pronunciation','tech','Intermediate','bg-primary-fixed text-on-primary-fixed-variant','1:1 Mutual Exchange','1 hr / week','4-week cycle','1:1 Video Call','Basic JavaScript (ES6+), fundamental HTML/CSS','1 Shipped Mini-Project + Code Review Sign-off','2026-10-22 15:12:43');
INSERT INTO `listing_curriculum` (`id`, `listing_id`, `num`, `title`, `description`) VALUES (1,1,1,'Session 1: Rasgueado & Picado Mechanics','Finger placement, tone production, and velocity exercises.'),
(2,1,2,'Session 2: Compás & Flamenco Rhythm Cycles','Understanding Soleá and Bulerías timing structures.'),
(3,2,1,'Session 1: Travis Picking & Thumb Independence','Developing relaxed right-hand groove and steady alternating bass.'),
(4,2,2,'Session 2: Open Tunings (DADGAD) & Modal Harmonies','Rich acoustic soundscapes and Celtic/folk chord voicings.'),
(5,2,3,'Session 3: Dynamic Phrasing & Natural Harmonics','Expressive touch, percussive slaps, and clean bell harmonics.'),
(6,3,1,'Session 1: Figma Variables & Semantic Token Architecture','Multi-brand token sets, light/dark mode logic and binding.'),
(7,3,2,'Session 2: Dynamic Auto-layout & Complex Nesting','Building bulletproof responsive components without breakage.'),
(8,3,3,'Session 3: Component Slot Patterns & Properties','Advanced variants, boolean props, and instance swap tricks.'),
(9,4,1,'Session 1: Strict Types & Custom Hooks','Eliminating runtime crashes, creating declarative state engines.'),
(10,4,2,'Session 2: Performance Profiling & Hydration','Preventing re-render waterfalls, tree-shaking patterns.'),
(11,4,3,'Session 3: Design Tokens & Component Encapsulation','Building a production component library with variant props.'),
(12,4,4,'Session 4: Architecture Review & Testing','Comprehensive code review and production deployment sign-off.');
INSERT INTO `exchange_requests` (`id`, `from_user_id`, `to_user_id`, `listing_id`, `offers`, `wants`, `note`, `ratio_type`, `status`, `created_at`, `updated_at`) VALUES (1,7,1,NULL,'Japanese N5 Drill','UI Prototyping','\"Konichiwa! Ready to run weekly conversational drills in exchange for polishing my indie app\'s Figma prototypes!\"','Flexible','pending','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(2,18,1,NULL,'Design Systems','Senior React Mentoring','\"Hey Elena! Love your component architecture articles. Looking to swap 2 hours of Design Tokens for React 19 concurrent patterns.\"','1:1 Direct','pending','2026-10-22 15:12:43','2026-10-22 15:12:43');
INSERT INTO `sessions` (`id`, `proposer_id`, `partner_id`, `request_id`, `proposer_teaches`, `partner_teaches`, `proposer_mins`, `partner_mins`, `time_label`, `date_group`, `status`, `note`, `completed_at`, `created_at`, `updated_at`) VALUES (1,1,8,NULL,'SEO Strategy','Podcast Audio',30,30,'11:00 – 12:00 (60 min total)','Monday, Oct 28','needs-rescheduling','Marcus requested a 30m shift due to studio booking overlap.',NULL,'2026-10-22 15:12:43','2026-10-22 15:12:43'),
(2,1,9,NULL,'Design Systems','React Native',45,45,'17:30 – 19:00 (90 min total)','Thursday, Oct 24','confirmed',NULL,NULL,'2026-10-22 15:12:43','2026-10-22 15:12:43'),
(3,1,10,NULL,'UX Research','German Basics',45,45,'Today • 15:00',NULL,'starting-soon','Agenda: 45m qualitative research synthesis + 45m German conversation drills.',NULL,'2026-10-22 15:12:43','2026-10-22 15:12:43'),
(4,11,1,NULL,'Python Data Visuals','User Journey Mapping',45,45,'Sun, Nov 3 • 10:00',NULL,'pending','\"Interested in exchanging 45 minutes of Plotly/Seaborn visualization scripts for user interview and journey mapping techniques.\"',NULL,'2026-10-22 15:12:43','2026-10-22 15:12:43'),
(5,12,1,NULL,'Architectural 3D Modeling','Figma Auto-Layout & Tokens',60,60,'Fri, Nov 1 • 14:00',NULL,'pending','\"Hi! Loved your recent portfolio breakdown. I\'m building a design system for my studio and need help refining nested components.\"',NULL,'2026-10-22 15:12:43','2026-10-22 15:12:43'),
(6,1,13,NULL,'UX Wireframes','Brand Storytelling',45,45,'Completed on Oct 02 • 90m swap',NULL,'completed',NULL,'2026-10-02 17:00:00','2026-10-22 15:12:43','2026-10-22 15:12:43'),
(7,1,14,NULL,'Webflow CMS','Watercolour 101',30,30,'Completed on Oct 14 • 60m swap',NULL,'completed',NULL,'2026-10-14 17:00:00','2026-10-22 15:12:43','2026-10-22 15:12:43');
INSERT INTO `reviews` (`id`, `session_id`, `reviewer_id`, `reviewee_id`, `rating`, `comment`, `swapped_for`, `session_mins`, `created_at`) VALUES (1,6,1,13,5.0,'Great Brand Storytelling session — clear and well prepared.','Brand Storytelling',90,'2026-10-02 17:00:00'),
(2,7,1,14,5.0,'Great Watercolour 101 session — clear and well prepared.','Watercolour 101',60,'2026-10-14 17:00:00'),
(3,6,13,1,5.0,'Her Figma prototyping breakdown helped me secure our team’s quarterly buy-in. Super generous with time and shared her personal component kits. Can\'t wait for our next trade session.','Product Narrative Pitching',60,'2026-10-14 20:42:43'),
(4,NULL,15,1,5.0,'Elena unlocked React server components for me in 90 minutes faster than weeks of tutorials. Honest, patient, and deeply thoughtful with code critiques. A quintessential TradeSkill barter partner!','TypeScript AST Parsing',120,'2026-10-20 20:42:43'),
(5,NULL,16,2,5.0,'Elena demystified Figma variable modes in 40 minutes. I helped her set up a Flask endpoint in return. Flawless exchange!','React Hooks',60,'2026-10-17 20:42:43'),
(6,NULL,4,3,5.0,'Tariq explained Docker networking in 20 minutes better than 10 documentation pages. Clear, patient, and methodical.','Usability Testing',120,'2026-10-17 20:42:43'),
(7,NULL,17,4,5.0,'Her user interview cheat sheet transformed our discovery calls. Highly recommended trade partner!','PostgreSQL Queries',60,'2026-10-17 20:42:43');
SET FOREIGN_KEY_CHECKS = 1;
