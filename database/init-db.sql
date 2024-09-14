--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aa; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.aa (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    "ammoMaxRange" double precision NOT NULL,
    "ammoVelocity" double precision NOT NULL,
    "viewAngle" double precision NOT NULL,
    "reloadTime" double precision NOT NULL,
    "usersId" integer
);


ALTER TABLE public.aa OWNER TO test;

--
-- Name: aa_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.aa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.aa_id_seq OWNER TO test;

--
-- Name: aa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.aa_id_seq OWNED BY public.aa.id;


--
-- Name: migration; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.migration (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migration OWNER TO test;

--
-- Name: migration_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.migration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migration_id_seq OWNER TO test;

--
-- Name: migration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.migration_id_seq OWNED BY public.migration.id;


--
-- Name: mission; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.mission (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    name character varying NOT NULL,
    duration integer NOT NULL,
    "mapId" integer
);


ALTER TABLE public.mission OWNER TO test;

--
-- Name: mission_aa_position; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.mission_aa_position (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    "position" jsonb NOT NULL,
    "missionId" integer
);


ALTER TABLE public.mission_aa_position OWNER TO test;

--
-- Name: mission_aa_position_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.mission_aa_position_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mission_aa_position_id_seq OWNER TO test;

--
-- Name: mission_aa_position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.mission_aa_position_id_seq OWNED BY public.mission_aa_position.id;


--
-- Name: mission_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.mission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mission_id_seq OWNER TO test;

--
-- Name: mission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.mission_id_seq OWNED BY public.mission.id;


--
-- Name: mission_map; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.mission_map (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    name character varying NOT NULL,
    filename character varying NOT NULL,
    size integer NOT NULL,
    "maxHeight" integer NOT NULL
);


ALTER TABLE public.mission_map OWNER TO test;

--
-- Name: mission_map_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.mission_map_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mission_map_id_seq OWNER TO test;

--
-- Name: mission_map_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.mission_map_id_seq OWNED BY public.mission_map.id;


--
-- Name: mission_target; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.mission_target (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    waypoints jsonb NOT NULL,
    "targetId" integer,
    "missionId" integer
);


ALTER TABLE public.mission_target OWNER TO test;

--
-- Name: mission_target_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.mission_target_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mission_target_id_seq OWNER TO test;

--
-- Name: mission_target_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.mission_target_id_seq OWNED BY public.mission_target.id;


--
-- Name: target; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.target (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    name character varying NOT NULL,
    rcs double precision NOT NULL,
    temperature double precision NOT NULL,
    size double precision NOT NULL
);


ALTER TABLE public.target OWNER TO test;

--
-- Name: target_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.target_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.target_id_seq OWNER TO test;

--
-- Name: target_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.target_id_seq OWNED BY public.target.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    "isPremium" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."user" OWNER TO test;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO test;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: aa id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.aa ALTER COLUMN id SET DEFAULT nextval('public.aa_id_seq'::regclass);


--
-- Name: migration id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.migration ALTER COLUMN id SET DEFAULT nextval('public.migration_id_seq'::regclass);


--
-- Name: mission id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission ALTER COLUMN id SET DEFAULT nextval('public.mission_id_seq'::regclass);


--
-- Name: mission_aa_position id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_aa_position ALTER COLUMN id SET DEFAULT nextval('public.mission_aa_position_id_seq'::regclass);


--
-- Name: mission_map id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_map ALTER COLUMN id SET DEFAULT nextval('public.mission_map_id_seq'::regclass);


--
-- Name: mission_target id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_target ALTER COLUMN id SET DEFAULT nextval('public.mission_target_id_seq'::regclass);


--
-- Name: target id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.target ALTER COLUMN id SET DEFAULT nextval('public.target_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: aa; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.aa (id, "createdAt", name, type, "ammoMaxRange", "ammoVelocity", "viewAngle", "reloadTime", "usersId") FROM stdin;
2	1726297064731	GAA-3	gun	3000	800	0.523599	0.001	\N
1	1726297064731	SAM-8	active-missile	8000	900	0.523599	3	2
\.


--
-- Data for Name: migration; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.migration (id, "timestamp", name) FROM stdin;
1	1634567890123	InitMissionDataFromFile1634567890123
\.


--
-- Data for Name: mission; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.mission (id, "createdAt", name, duration, "mapId") FROM stdin;
1	1726297064731	Mars test	200	1
\.


--
-- Data for Name: mission_aa_position; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.mission_aa_position (id, "createdAt", "position", "missionId") FROM stdin;
1	1726297064731	{"x": -664.1055110918044, "y": 116.38533390889972, "z": 789.1466232456194}	1
2	1726297064731	{"x": -200, "y": 110.18755218253602, "z": 5}	1
3	1726297064731	{"x": 687.9096514754317, "y": 86.11604702219321, "z": -667.8413745897165}	1
\.


--
-- Data for Name: mission_map; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.mission_map (id, "createdAt", name, filename, size, "maxHeight") FROM stdin;
1	1726297064731	Mars	mars	8000	938
\.


--
-- Data for Name: mission_target; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.mission_target (id, "createdAt", waypoints, "targetId", "missionId") FROM stdin;
1	1726297064731	[{"speed": 25, "position": {"x": -2223.485464765792, "y": 500, "z": 536.9329918665932}}, {"speed": 25, "position": {"x": -1026.1853393957797, "y": 500, "z": -502.75776430672795}}, {"speed": 25, "position": {"x": -208.68604735576378, "y": 500, "z": 456.8969848775215}}, {"speed": 25, "position": {"x": 571.2273846860403, "y": 500, "z": -331.93756919303405}}, {"speed": 25, "position": {"x": 1003.7558566358286, "y": 500, "z": 608.5324605095069}}, {"speed": 25, "position": {"x": 1551.168671462318, "y": 500, "z": -407.0409840449847}}, {"speed": 25, "position": {"x": 2221.4781298222283, "y": 500, "z": 416.0437152643019}}, {"speed": 25, "position": {"x": 2862.1722943074233, "y": 500, "z": -113.45872768630807}}, {"speed": 25, "position": {"x": 4838.919214556113, "y": 500, "z": 1604.1487425024588}}]	1	1
3	1726298558829	[{"speed": "70", "position": {"x": -3323.9169239396165, "y": 1875.4247583299316, "z": 3262.504934742212}}, {"speed": "70", "position": {"x": 0, "y": 1771.752459538605, "z": 2988.0348319060586}}, {"speed": "70", "position": {"x": 2591.6450174493903, "y": 1867.5467395424143, "z": 2426.7600615184756}}, {"speed": "70", "position": {"x": 4810.235359111055, "y": 2000.8924667163897, "z": 1392.5024651054578}}]	3	1
2	1726298308856	[{"speed": "50", "position": {"x": -3449.767947174781, "y": 920.9333080733413, "z": -1077.416657675717}}, {"speed": "50", "position": {"x": -712.2291131347076, "y": 1037.355990452989, "z": -2270.395561875321}}, {"speed": "50", "position": {"x": 1768.4235400046082, "y": 1014.5066184538097, "z": -2318.4441606100004}}, {"speed": "50", "position": {"x": 2928.8012968290113, "y": 1220.7349910703992, "z": -560.1857432689567}}]	3	1
\.


--
-- Data for Name: target; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.target (id, "createdAt", name, rcs, temperature, size) FROM stdin;
1	1726297064731	Drone-M	0.5	50	4
2	1726297864896	Drone-S	0.01	54	3
3	1726297905971	Drone-L	1	84	8
4	1726297958591	Fighter	3	189	12
5	1726297980495	Bomber	10	250	30
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public."user" (id, "createdAt", username, password, "isPremium") FROM stdin;
1	1726297108284	admin	$argon2id$v=19$m=65536,t=3,p=4$IVwIKjoVs+a1aNhumFvP+g$7mNNHlQ1J//7Z6byjdsSSQUJ1eoemnHa42D6V3EMF4Y	f
2	1726299309248	test	$argon2id$v=19$m=65536,t=3,p=4$ZIvHfmS8wBs4WWcu/1H3Ow$ntQtEEbWQikQ78cs6wo//8+x/sAMJiDEiyf1T2WtEjM	f
\.


--
-- Name: aa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.aa_id_seq', 2, true);


--
-- Name: migration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.migration_id_seq', 1, true);


--
-- Name: mission_aa_position_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.mission_aa_position_id_seq', 3, true);


--
-- Name: mission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.mission_id_seq', 1, true);


--
-- Name: mission_map_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.mission_map_id_seq', 1, true);


--
-- Name: mission_target_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.mission_target_id_seq', 3, true);


--
-- Name: target_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.target_id_seq', 5, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.user_id_seq', 2, true);


--
-- Name: mission_aa_position PK_17e21e5959f96f938f55422c458; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_aa_position
    ADD CONSTRAINT "PK_17e21e5959f96f938f55422c458" PRIMARY KEY (id);


--
-- Name: migration PK_3043fc6b8af7c99b8b98830094f; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.migration
    ADD CONSTRAINT "PK_3043fc6b8af7c99b8b98830094f" PRIMARY KEY (id);


--
-- Name: mission PK_54f1391034bc7dd30666dee0d4c; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission
    ADD CONSTRAINT "PK_54f1391034bc7dd30666dee0d4c" PRIMARY KEY (id);


--
-- Name: target PK_9d962204b13c18851ea88fc72f3; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.target
    ADD CONSTRAINT "PK_9d962204b13c18851ea88fc72f3" PRIMARY KEY (id);


--
-- Name: mission_map PK_b1b97e9963e9252af56e1be7e86; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_map
    ADD CONSTRAINT "PK_b1b97e9963e9252af56e1be7e86" PRIMARY KEY (id);


--
-- Name: mission_target PK_bfcba2eda9094811f9b0dd04637; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_target
    ADD CONSTRAINT "PK_bfcba2eda9094811f9b0dd04637" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: aa PK_f18f4128e347f85d32f8a908c4f; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.aa
    ADD CONSTRAINT "PK_f18f4128e347f85d32f8a908c4f" PRIMARY KEY (id);


--
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: mission_target FK_13583b588d3bdc34fae3fcc748d; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_target
    ADD CONSTRAINT "FK_13583b588d3bdc34fae3fcc748d" FOREIGN KEY ("missionId") REFERENCES public.mission(id) ON DELETE CASCADE;


--
-- Name: mission_target FK_3a46221ce8202e997d0c1002d14; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_target
    ADD CONSTRAINT "FK_3a46221ce8202e997d0c1002d14" FOREIGN KEY ("targetId") REFERENCES public.target(id);


--
-- Name: aa FK_4ca0dc958623e68cb3a66e9b250; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.aa
    ADD CONSTRAINT "FK_4ca0dc958623e68cb3a66e9b250" FOREIGN KEY ("usersId") REFERENCES public."user"(id);


--
-- Name: mission_aa_position FK_b820870ecccac2f25b089f74fc8; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission_aa_position
    ADD CONSTRAINT "FK_b820870ecccac2f25b089f74fc8" FOREIGN KEY ("missionId") REFERENCES public.mission(id) ON DELETE CASCADE;


--
-- Name: mission FK_e7e77b3e7c94eff6a3a40694eb4; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.mission
    ADD CONSTRAINT "FK_e7e77b3e7c94eff6a3a40694eb4" FOREIGN KEY ("mapId") REFERENCES public.mission_map(id);


--
-- PostgreSQL database dump complete
--

