



-- TABELA DE DADOS

--  Tabela de registros das escolas 
CREATE TABLE schools (
    id_school SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
  	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
);

CREATE INDEX idx_schools_name ON schools(name);

 -- tabela para cadastrar o representante da escola - professor que fez o contato
CREATE TABLE school_representatives (
    id_representative SERIAL PRIMARY KEY,
    id_school INTEGER REFERENCES schools(id_school) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  	updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
);
CREATE INDEX idx_rep_school ON school_representatives(id_school);
CREATE INDEX idx_rep_email ON school_representatives(email);

-- tabela dos patrocinadores dos eventos 
CREATE TABLE sponsors (
    id_sponsor SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
);

 -- tabela da relação de eventos com os patrocinadores 
CREATE TABLE event_sponsors_relation (
    id_event INTEGER REFERENCES events(id_event) ON DELETE CASCADE,
    id_sponsor INTEGER REFERENCES sponsors(id_sponsor) ON DELETE CASCADE,
    PRIMARY KEY (id_event, id_sponsor)
);

-- Índice automático pela PK composta, mas útil criar o inverso do Patrocinador -> Evento
CREATE INDEX idx_event_sponsors_sponsor ON event_sponsors_relation(id_sponsor);

 -- tabela dos estudantes que participam da visita
CREATE TABLE students (
    id_student SERIAL PRIMARY KEY,
    id_booking INTEGER REFERENCES event_bookings(id_booking) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    attended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
);

CREATE INDEX idx_students_booking ON students(id_booking);
CREATE INDEX idx_students_attendance ON students(attended) WHERE attended = TRUE; -- Partial index para certificados
CREATE INDEX idx_students_name ON students(name);

 -- tabela de participantes - inscrições individuais 
CREATE TABLE visitors (
    id_visitor SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE, -- Útil para certificados oficiais
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
);


CREATE INDEX idx_visitor_email ON visitors(email);

-- tabela de agendamento de participação do evento - criar evento 

CREATE TABLE event_bookings (
    id_booking SERIAL PRIMARY KEY,
    id_event INTEGER NOT NULL REFERENCES events(id_event) ON DELETE CASCADE,
    
    -- Se for escola, preenche este:
    id_representative INTEGER REFERENCES school_representatives(id_representative),
    
    -- Se for pessoa física, preenche este:
    id_visitor INTEGER REFERENCES visitors(id_visitor),
    
    expected_participant_count INTEGER NOT NULL DEFAULT 1,
    booking_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
    -- Garante que o agendamento seja OU escola OU visitante individual
    CONSTRAINT check_booking_origin CHECK (
        (id_representative IS NOT NULL AND id_visitor IS NULL) OR 
        (id_representative NULL AND id_visitor IS NOT NULL)
    )
);
CREATE INDEX idx_booking_event ON event_bookings(id_event);
CREATE INDEX idx_booking_status ON event_bookings(status);
CREATE INDEX idx_booking_rep ON event_bookings(id_representative);
CREATE INDEX idx_booking_visitor ON event_bookings(id_visitor);


-- 1. Tabela de Papéis (Roles)
CREATE TABLE ROLES (
    ID_ROLE SERIAL PRIMARY KEY,
    NOME_ROLE VARCHAR(50) NOT NULL UNIQUE,
    created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
);

-- 2. Tabela de Recursos (Resources)
CREATE TABLE RESOURCES (
    ID_RECURSO SERIAL PRIMARY KEY,
    NOME_RECURSO VARCHAR(50) NOT NULL UNIQUE,
    created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
);

-- 4. Tabela de Relacionamento Muitos-para-Muitos (Usuários e Roles)
CREATE TABLE USUARIO_ROLES (
    USUARIO_ID INT REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE,
    ROLE_ID INT REFERENCES ROLES(ID_ROLE) ON DELETE CASCADE,
   	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
    PRIMARY KEY (USUARIO_ID, ROLE_ID)
);

-- 5. Tabela de Permissões 
CREATE TABLE PERMISSIONS (
    ID_PERMISSION SERIAL PRIMARY KEY,
    ROLE_ID INT NOT NULL,
    RECURSO_ID INT NOT NULL,
    ACTION VARCHAR(20) NOT NULL,
    POSSESSION VARCHAR(10) DEFAULT 'any',
    ATTRIBUTES VARCHAR(10) DEFAULT '*',
   	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
    
    CONSTRAINT FK_ROLE FOREIGN KEY (ROLE_ID) 
        REFERENCES ROLES(ID_ROLE) ON DELETE CASCADE,
    
    CONSTRAINT FK_RECURSO FOREIGN KEY (RECURSO_ID) 
        REFERENCES RESOURCES(ID_RECURSO) ON DELETE CASCADE
);


-- Índice para busca rápida de permissões por Role (Cenário mais comum: login/validação)
CREATE INDEX IDX_PERMISSIONS_ROLE ON PERMISSIONS(ROLE_ID);

-- Índice para busca de permissões por Recurso
CREATE INDEX IDX_PERMISSIONS_RECURSO ON PERMISSIONS(RECURSO_ID);

-- Índice composto para verificar Permissão + Recurso + Ação rapidamente
CREATE INDEX IDX_PERMISSIONS_RULE_CHECK ON PERMISSIONS(ROLE_ID, RECURSO_ID, ACTION);

-- Índice na tabela de ligação para acelerar a descoberta dos papéis do usuário
CREATE INDEX IDX_USUARIO_ROLES_USER ON USUARIO_ROLES(USUARIO_ID);



CREATE TABLE public.usuario (

	id_usuario serial4 NOT NULL,
    firstname vachar(150) NOT NULL,
	lastname varchar(150) NOT NULL,)
	username varchar(150) NOT NULL,
	email varchar(150) NOT NULL,
	active bool DEFAULT false NOT NULL,
	image_path varchar(255) NULL,
	emailverified bool DEFAULT false NULL,
	twofactorauthenticationsecret varchar(255) NULL,
	istwofactorauthenticationenabled bool DEFAULT false NULL,
	currenthashedrefreshtoken varchar(255) NULL,
	mfa_code text NULL,
	mfa_expires_at timestamp NULL,
    created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
	CONSTRAINT "PK_dd52716c2652e0e23c15530c695" PRIMARY KEY (id_usuario),
	CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE (email)
);


CREATE INDEX idx_usuario_nome ON usuario(username);
CREATE INDEX idx_usuario_ativos_status ON usuario(id_usuario) WHERE deleted_at IS NULL AND active = TRUE;


CREATE TABLE credentials (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL UNIQUE,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_credentials_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);


CREATE INDEX idx_credentials_email ON credentials(email);
CREATE INDEX idx_credentials_usuario ON credentials(usuario_id);


-- Tabela Account
CREATE TABLE account (
    id_account UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Para Postgres
    id_usuario INT NOT NULL,
    provider_id INT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_user FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE INDEX idx_account_provider ON account(provider_id, account_id);
CREATE INDEX idx_account_usuario ON account(id_usuario);

-- Tabela Session
CREATE TABLE session (
    id_session SERIAL PRIMARY KEY, -- ID auto-incremental
    id_usuario INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    CONSTRAINT fk_session_user FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE INDEX idx_session_usuario ON session(id_usuario);
CREATE INDEX idx_session_expires ON session(expires_at);


CREATE TABLE IF NOT EXISTS contact (
    -- Chave Primária
    id_contact SERIAL PRIMARY KEY,
    
    -- Campos da Entidade Contact
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    agreed_to_privacy BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Campos Herdados da BaseEntity
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ -- Nullable por padrão (Soft Delete)
)

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_active ON contacts(deleted_at) WHERE deleted_at IS NULL;

CREATE TABLE public.events (
	id_event serial4 NOT NULL,
	title text NOT NULL,
	description text NULL,
	start_date timestamptz NOT NULL,
	end_date timestamptz NOT NULL,
	all_day bool DEFAULT false NULL,
	location varchar(100) NULL,
	color varchar(30) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	deleted_at timestamptz NULL,
	start_time varchar(5) NULL,
	duration_minutes int4 NULL,
	max_capacity int4 NULL,
	CONSTRAINT events_pkey PRIMARY KEY (id_event)
);

CREATE INDEX idx_events_period ON events (start_date, end_date);

--- 2. Índice para buscas textuais
CREATE INDEX idx_events_title ON events USING btree (title);

--- 3. Índice para filtros de localização
CREATE INDEX idx_events_location ON events (location);

--- 4. Índice para o campo de Cor (Opcional)
CREATE INDEX idx_events_color ON events (color);

--- 5. Índice para Ordenação de Criação (BaseEntity)
CREATE INDEX idx_events_created_at ON events (created_at DESC);

// drive para acesso ao mysql 

npm install @nestjs/typeorm typeorm mysql2


// drive para acesso ao postgree 

npm install --save @nestjs/typeorm typeorm pg