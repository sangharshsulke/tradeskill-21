-- TradeSkill database schema (MySQL 8+)
-- Run with:  npm run db:setup   (creates the database, tables and demo data)

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
