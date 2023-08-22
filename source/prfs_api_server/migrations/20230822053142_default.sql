-- Add migration script here

-- public.eth_accounts definition

-- Drop table

-- DROP TABLE public.eth_accounts;

CREATE TABLE public.eth_accounts (
	addr varchar NOT NULL,
	wei numeric(78) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	id bigserial NOT NULL,
	updated_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT balances_pk PRIMARY KEY (id),
	CONSTRAINT balances_un UNIQUE (addr)
);
CREATE INDEX eth_accounts_wei_idx ON public.eth_accounts USING btree (wei);


-- public.prfs_accounts definition

-- Drop table

-- DROP TABLE public.prfs_accounts;

CREATE TABLE public.prfs_accounts (
	id bigserial NOT NULL,
	sig varchar NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	avatar_color varchar NOT NULL,
	CONSTRAINT prfs_accounts_pk PRIMARY KEY (id),
	CONSTRAINT prfs_accounts_un UNIQUE (sig)
);


-- public.prfs_proof_instances definition

-- Drop table

-- DROP TABLE public.prfs_proof_instances;

CREATE TABLE public.prfs_proof_instances (
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	public_inputs jsonb NULL,
	proof_type_id uuid NOT NULL,
	proof bytea NOT NULL,
	id bigserial NOT NULL,
	proof_instance_id uuid NOT NULL,
	CONSTRAINT prfs_proof_instances_pk PRIMARY KEY (id),
	CONSTRAINT prfs_proof_instances_un UNIQUE (proof_instance_id)
);


-- public.prfs_proof_types definition

-- Drop table

-- DROP TABLE public.prfs_proof_types;

CREATE TABLE public.prfs_proof_types (
	id bigserial NOT NULL,
	author varchar NOT NULL,
	"label" varchar NOT NULL,
	"desc" varchar NOT NULL,
	circuit_id varchar NOT NULL,
	circuit_inputs jsonb NOT NULL,
	proof_type_id uuid NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	driver_id varchar NOT NULL,
	driver_properties jsonb NOT NULL,
	"expression" varchar NOT NULL,
	img_url varchar NULL,
	CONSTRAINT prfs_proof_types_pk PRIMARY KEY (id),
	CONSTRAINT prfs_proof_types_un UNIQUE (proof_type_id)
);


-- public.prfs_sets definition

-- Drop table

-- DROP TABLE public.prfs_sets;

CREATE TABLE public.prfs_sets (
	id bigserial NOT NULL,
	"label" varchar NOT NULL,
	author varchar NOT NULL,
	"desc" varchar NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	hash_algorithm varchar NOT NULL,
	"cardinality" int8 NOT NULL,
	merkle_root varchar NOT NULL,
	element_type varchar NOT NULL,
	elliptic_curve varchar NOT NULL,
	finite_field varchar NOT NULL,
	set_id uuid NOT NULL,
	CONSTRAINT prfs_sets_pk PRIMARY KEY (id),
	CONSTRAINT prfs_sets_un UNIQUE (set_id)
);


-- public.prfs_tree_nodes definition

-- Drop table

-- DROP TABLE public.prfs_tree_nodes;

CREATE TABLE public.prfs_tree_nodes (
	id bigserial NOT NULL,
	pos_w numeric NOT NULL,
	val varchar NOT NULL,
	set_id3 varchar NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	pos_h int4 NOT NULL,
	set_id uuid NOT NULL,
	CONSTRAINT nodes_pk_1 PRIMARY KEY (id),
	CONSTRAINT nodes_un UNIQUE (pos_w, set_id3, pos_h),
	CONSTRAINT nodes_un_2 UNIQUE (val, set_id3)
);
CREATE INDEX nodes_set_id_idx ON public.prfs_tree_nodes USING btree (set_id3);
CREATE INDEX nodes_val_idx ON public.prfs_tree_nodes USING btree (val);
