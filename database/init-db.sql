--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-09-14 16:50:52

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
-- TOC entry 228 (class 1259 OID 40397)
-- Name: aa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aa (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    "ammoMaxRange" double precision NOT NULL,
    "ammoVelocity" double precision NOT NULL,
    "viewAngle" double precision NOT NULL,
    "reloadTime" double precision NOT NULL
);


ALTER TABLE public.aa OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 40396)
-- Name: aa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aa_id_seq OWNER TO postgres;

--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 227
-- Name: aa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aa_id_seq OWNED BY public.aa.id;


--
-- TOC entry 230 (class 1259 OID 40432)
-- Name: migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migration (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migration OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 40431)
-- Name: migration_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migration_id_seq OWNER TO postgres;

--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 229
-- Name: migration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migration_id_seq OWNED BY public.migration.id;


--
-- TOC entry 224 (class 1259 OID 40374)
-- Name: mission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mission (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    name character varying NOT NULL,
    duration integer NOT NULL,
    "mapId" integer
);


ALTER TABLE public.mission OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 40364)
-- Name: mission_aa_position; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mission_aa_position (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    "position" jsonb NOT NULL,
    "missionId" integer
);


ALTER TABLE public.mission_aa_position OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 40363)
-- Name: mission_aa_position_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mission_aa_position_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mission_aa_position_id_seq OWNER TO postgres;

--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 221
-- Name: mission_aa_position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mission_aa_position_id_seq OWNED BY public.mission_aa_position.id;


--
-- TOC entry 223 (class 1259 OID 40373)
-- Name: mission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mission_id_seq OWNER TO postgres;

--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 223
-- Name: mission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mission_id_seq OWNED BY public.mission.id;


--
-- TOC entry 220 (class 1259 OID 40354)
-- Name: mission_map; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mission_map (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    name character varying NOT NULL,
    filename character varying NOT NULL,
    size integer NOT NULL,
    "maxHeight" integer NOT NULL
);


ALTER TABLE public.mission_map OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 40353)
-- Name: mission_map_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mission_map_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mission_map_id_seq OWNER TO postgres;

--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 219
-- Name: mission_map_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mission_map_id_seq OWNED BY public.mission_map.id;


--
-- TOC entry 218 (class 1259 OID 40344)
-- Name: mission_target; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mission_target (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    waypoints jsonb NOT NULL,
    "targetId" integer,
    "missionId" integer
);


ALTER TABLE public.mission_target OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 40343)
-- Name: mission_target_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mission_target_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mission_target_id_seq OWNER TO postgres;

--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 217
-- Name: mission_target_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mission_target_id_seq OWNED BY public.mission_target.id;


--
-- TOC entry 216 (class 1259 OID 40334)
-- Name: target; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.target (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    name character varying NOT NULL,
    rcs double precision NOT NULL,
    temperature double precision NOT NULL,
    size double precision NOT NULL
);


ALTER TABLE public.target OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 40333)
-- Name: target_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.target_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.target_id_seq OWNER TO postgres;

--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 215
-- Name: target_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.target_id_seq OWNED BY public.target.id;


--
-- TOC entry 226 (class 1259 OID 40384)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    "createdAt" bigint DEFAULT (EXTRACT(epoch FROM now()) * (1000)::numeric) NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    "isPremium" boolean DEFAULT false NOT NULL,
    "aaId" integer,
    role character varying DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 40383)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 4737 (class 2604 OID 40400)
-- Name: aa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aa ALTER COLUMN id SET DEFAULT nextval('public.aa_id_seq'::regclass);


--
-- TOC entry 4739 (class 2604 OID 40435)
-- Name: migration id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migration ALTER COLUMN id SET DEFAULT nextval('public.migration_id_seq'::regclass);


--
-- TOC entry 4731 (class 2604 OID 40377)
-- Name: mission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission ALTER COLUMN id SET DEFAULT nextval('public.mission_id_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 40367)
-- Name: mission_aa_position id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_aa_position ALTER COLUMN id SET DEFAULT nextval('public.mission_aa_position_id_seq'::regclass);


--
-- TOC entry 4727 (class 2604 OID 40357)
-- Name: mission_map id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_map ALTER COLUMN id SET DEFAULT nextval('public.mission_map_id_seq'::regclass);


--
-- TOC entry 4725 (class 2604 OID 40347)
-- Name: mission_target id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_target ALTER COLUMN id SET DEFAULT nextval('public.mission_target_id_seq'::regclass);


--
-- TOC entry 4723 (class 2604 OID 40337)
-- Name: target id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.target ALTER COLUMN id SET DEFAULT nextval('public.target_id_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 40387)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 4919 (class 0 OID 40397)
-- Dependencies: 228
-- Data for Name: aa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.aa (id, "createdAt", name, type, "ammoMaxRange", "ammoVelocity", "viewAngle", "reloadTime") FROM stdin;
2	1726224284628	GAA-3	gun	3000	800	0.523599	0.001
1	1726224284628	SAM-8	active-missile	8000	900	0.523599	3
\.


--
-- TOC entry 4921 (class 0 OID 40432)
-- Dependencies: 230
-- Data for Name: migration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migration (id, "timestamp", name) FROM stdin;
1	1634567890123	InitMissionDataFromFile1634567890123
\.


--
-- TOC entry 4915 (class 0 OID 40374)
-- Dependencies: 224
-- Data for Name: mission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mission (id, "createdAt", name, duration, "mapId") FROM stdin;
2	1726224686510	Test mission	1000	1
\.


--
-- TOC entry 4913 (class 0 OID 40364)
-- Dependencies: 222
-- Data for Name: mission_aa_position; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mission_aa_position (id, "createdAt", "position", "missionId") FROM stdin;
4	1726224686510	{"x": -52.03752297271902, "y": 81.1116188749563, "z": 187.6765615253189}	2
5	1726224686510	{"x": 2.189902823019338, "y": 86.40527250237056, "z": -193.20305565576703}	2
6	1726224686510	{"x": -330.18989190195845, "y": 118.89726124666916, "z": -131.6793593384318}	2
\.


--
-- TOC entry 4911 (class 0 OID 40354)
-- Dependencies: 220
-- Data for Name: mission_map; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mission_map (id, "createdAt", name, filename, size, "maxHeight") FROM stdin;
1	1726224284628	Mars	mars	8000	938
\.


--
-- TOC entry 4909 (class 0 OID 40344)
-- Dependencies: 218
-- Data for Name: mission_target; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mission_target (id, "createdAt", waypoints, "targetId", "missionId") FROM stdin;
2	1726224686510	[{"speed": "25", "position": {"x": 67.06382931817706, "y": 230.664830986384, "z": -4011.504864910307}}, {"speed": "25", "position": {"x": 0, "y": 303.8797529276956, "z": 0}}, {"speed": 25, "position": {"x": -948.3625513594085, "y": 204.29653953693997, "z": 618.2646214225233}}, {"speed": "25", "position": {"x": -2111.6417444136678, "y": 371.9242037207762, "z": 1649.2674496527054}}]	1	2
5	1726254398092	[{"speed": "50", "position": {"x": 500.01367582782257, "y": 651.4895937720382, "z": -4179.638019739976}}, {"speed": "50", "position": {"x": 1485.4919335295954, "y": 883.0832309039776, "z": -1784.7931491730706}}, {"speed": "50", "position": {"x": 730.4775296001934, "y": 1021.3454326341806, "z": -32.47137802336147}}, {"speed": "50", "position": {"x": -434.6432321502957, "y": 1360.2004624547867, "z": 1651.16855353883}}, {"speed": "50", "position": {"x": -1981.5294599530703, "y": 1347.4204595360902, "z": 2696.1769343891465}}]	1	2
6	1726254575955	[{"speed": "70", "position": {"x": 1934.457511510961, "y": 1482.7761129100338, "z": 3680.3674010623763}}, {"speed": "70", "position": {"x": 3132.82270872487, "y": 1579.296268583767, "z": -2725.741057080891}}, {"speed": "70", "position": {"x": 2795.207632602825, "y": 1920.3375633724747, "z": -2990.4926620980086}}, {"speed": "70", "position": {"x": 2229.8702680423294, "y": 1912.409586677547, "z": -2699.4220915891087}}, {"speed": "70", "position": {"x": -614.4035041784182, "y": 1812.0552426215713, "z": 3077.397830295101}}]	1	2
\.


--
-- TOC entry 4907 (class 0 OID 40334)
-- Dependencies: 216
-- Data for Name: target; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.target (id, "createdAt", name, rcs, temperature, size) FROM stdin;
1	1726224284628	Drone-M	0.5	81	10
3	1726293281178	Drone-S	0.01	54	3
4	1726293305495	Drone-L	3	90	12
5	1726293332474	Fighter	3	200	15
6	1726293373914	Bomber	10	250	40
\.


--
-- TOC entry 4917 (class 0 OID 40384)
-- Dependencies: 226
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, "createdAt", username, password, "isPremium", "aaId", role) FROM stdin;
2	1726316747781	admin	$argon2id$v=19$m=65536,t=3,p=4$caq3+ycYmrbz7OfKYXFY/A$gEd7DfWjew38sJ0gTd325aQxQ5d7Lm6Db6TsmP178DY	t	1	admin
\.


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 227
-- Name: aa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.aa_id_seq', 3, true);


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 229
-- Name: migration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migration_id_seq', 1, true);


--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 221
-- Name: mission_aa_position_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mission_aa_position_id_seq', 8, true);


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 223
-- Name: mission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mission_id_seq', 4, true);


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 219
-- Name: mission_map_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mission_map_id_seq', 1, true);


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 217
-- Name: mission_target_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mission_target_id_seq', 6, true);


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 215
-- Name: target_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.target_id_seq', 6, true);


--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 2, true);


--
-- TOC entry 4747 (class 2606 OID 40372)
-- Name: mission_aa_position PK_17e21e5959f96f938f55422c458; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_aa_position
    ADD CONSTRAINT "PK_17e21e5959f96f938f55422c458" PRIMARY KEY (id);


--
-- TOC entry 4757 (class 2606 OID 40439)
-- Name: migration PK_3043fc6b8af7c99b8b98830094f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migration
    ADD CONSTRAINT "PK_3043fc6b8af7c99b8b98830094f" PRIMARY KEY (id);


--
-- TOC entry 4749 (class 2606 OID 40382)
-- Name: mission PK_54f1391034bc7dd30666dee0d4c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission
    ADD CONSTRAINT "PK_54f1391034bc7dd30666dee0d4c" PRIMARY KEY (id);


--
-- TOC entry 4741 (class 2606 OID 40342)
-- Name: target PK_9d962204b13c18851ea88fc72f3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.target
    ADD CONSTRAINT "PK_9d962204b13c18851ea88fc72f3" PRIMARY KEY (id);


--
-- TOC entry 4745 (class 2606 OID 40362)
-- Name: mission_map PK_b1b97e9963e9252af56e1be7e86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_map
    ADD CONSTRAINT "PK_b1b97e9963e9252af56e1be7e86" PRIMARY KEY (id);


--
-- TOC entry 4743 (class 2606 OID 40352)
-- Name: mission_target PK_bfcba2eda9094811f9b0dd04637; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_target
    ADD CONSTRAINT "PK_bfcba2eda9094811f9b0dd04637" PRIMARY KEY (id);


--
-- TOC entry 4751 (class 2606 OID 40393)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 40405)
-- Name: aa PK_f18f4128e347f85d32f8a908c4f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aa
    ADD CONSTRAINT "PK_f18f4128e347f85d32f8a908c4f" PRIMARY KEY (id);


--
-- TOC entry 4753 (class 2606 OID 40395)
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- TOC entry 4758 (class 2606 OID 40460)
-- Name: mission_target FK_13583b588d3bdc34fae3fcc748d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_target
    ADD CONSTRAINT "FK_13583b588d3bdc34fae3fcc748d" FOREIGN KEY ("missionId") REFERENCES public.mission(id) ON DELETE CASCADE;


--
-- TOC entry 4759 (class 2606 OID 40455)
-- Name: mission_target FK_3a46221ce8202e997d0c1002d14; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_target
    ADD CONSTRAINT "FK_3a46221ce8202e997d0c1002d14" FOREIGN KEY ("targetId") REFERENCES public.target(id);


--
-- TOC entry 4762 (class 2606 OID 40922)
-- Name: user FK_5bc07defd72a9549e29a8d66866; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_5bc07defd72a9549e29a8d66866" FOREIGN KEY ("aaId") REFERENCES public.aa(id) ON DELETE SET NULL;


--
-- TOC entry 4760 (class 2606 OID 40416)
-- Name: mission_aa_position FK_b820870ecccac2f25b089f74fc8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_aa_position
    ADD CONSTRAINT "FK_b820870ecccac2f25b089f74fc8" FOREIGN KEY ("missionId") REFERENCES public.mission(id) ON DELETE CASCADE;


--
-- TOC entry 4761 (class 2606 OID 40421)
-- Name: mission FK_e7e77b3e7c94eff6a3a40694eb4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission
    ADD CONSTRAINT "FK_e7e77b3e7c94eff6a3a40694eb4" FOREIGN KEY ("mapId") REFERENCES public.mission_map(id);


-- Completed on 2024-09-14 16:50:52

--
-- PostgreSQL database dump complete
--

