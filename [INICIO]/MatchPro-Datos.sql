CREATE DATABASE  IF NOT EXISTS `matchprodb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `matchprodb`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: matchprodb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_analysis`
--

DROP TABLE IF EXISTS `ai_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_analysis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int NOT NULL,
  `strengths` text NOT NULL,
  `concerns` text NOT NULL,
  `recommendation` text NOT NULL,
  `matchScore` int NOT NULL,
  `cv_link` text NOT NULL,
  `uploadedAt` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_analysis`
--

LOCK TABLES `ai_analysis` WRITE;
/*!40000 ALTER TABLE `ai_analysis` DISABLE KEYS */;
INSERT INTO `ai_analysis` VALUES (1,1,'[\"Strong programming skills in C++, Lua, Python, and C#.\",\"Experience with multiple game engines and tools (Love2D, Ursina Engine, SDL2, VS Code).\",\"Experience in designing and programming both 2D and 3D games.\",\"Experience with performance optimization, game physics, and cross-platform deployment.\",\"Experience with source control and CI using GitHub Actions.\",\"Education in Computer Science with specialization in graphics programming and game engines.\"]','[\"The CV is tailored for a Game Developer role, but John Smith is applying for Software Engineer. The experience section needs to be more generalized to showcase broader software engineering capabilities.\",\"The CV lacks details on specific projects and accomplishments. The bullet points under experience are too general.\",\"The CV only mentions indie game development experience, which may not be relevant to all software engineering roles.\"]','John Smith is a capable programmer with experience in game development. To make their CV more attractive to Software Engineer roles, they should highlight transferable skills, provide more specific examples of their work, and possibly include personal projects or contributions to open-source projects that demonstrate broader software engineering abilities. Tailoring the CV to the specific job requirements is crucial.',70,'https://www.dropbox.com/scl/fi/15295gi0haj19ggd0i42d/CV-John-Smith.pdf?rlkey=kdfja0oaymag2untvwsn6fvjf&dl=0','2025-08-12');
/*!40000 ALTER TABLE `ai_analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jobId` int NOT NULL,
  `candidateId` int NOT NULL,
  `status` varchar(50) NOT NULL,
  `appliedAt` date NOT NULL,
  `reviewed` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,1,1,'rejected','2025-08-04',1),(3,2,1,'rejected','2025-08-04',1),(9,1,7,'interview_via_microsoft_team','2025-08-07',1),(10,1,3,'pending','2025-08-08',1),(11,5,3,'rejected','2025-08-28',1),(12,5,4,'pending','2025-09-03',1),(32,20,1,'rejected','2025-10-13',1),(34,1,43,'offer','2025-10-17',1),(35,20,11,'pending','2025-10-17',1),(36,52,35,'pending','2025-10-21',1),(37,5,40,'hired','2025-10-22',1),(38,53,37,'pending','2025-10-23',1),(39,52,39,'pending','2025-10-23',1);
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `avatar` varchar(512) DEFAULT NULL,
  `createdAt` date NOT NULL,
  `bio` text,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `skills` text,
  `experience` int DEFAULT NULL,
  `cvUploaded` tinyint(1) DEFAULT NULL,
  `professionalTitle` varchar(255) NOT NULL,
  `matchScore` int DEFAULT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `recruitmentSource` enum('job-boards','company-career-page','employee-referral','recruitment-events','professional-conferences','social-media','coding-communities','university-partnerships','recruitment-agencies','direct-outreach','other') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'john@example.com','demo1234','John Smith','https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=150','2024-01-15','Passionate frontend developer with 5+ years of experience building scalable web applications.','San Francisco, CA','5551234567','TechFlow Inc.','Software Development','[\"JavaScript\",\"React\",\"Node.js\",\"TypeScript\"]',5,1,'Software Engineer',70,'not_looking','coding-communities');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates_database`
--

DROP TABLE IF EXISTS `candidates_database`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates_database` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int NOT NULL,
  `recruiter_id` int NOT NULL,
  `addedAt` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates_database`
--

LOCK TABLES `candidates_database` WRITE;
/*!40000 ALTER TABLE `candidates_database` DISABLE KEYS */;
INSERT INTO `candidates_database` VALUES (1,1,1,'2025-06-25');
/*!40000 ALTER TABLE `candidates_database` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certifications`
--

DROP TABLE IF EXISTS `certifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `issuer` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `credentialId` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `certifications_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certifications`
--

LOCK TABLES `certifications` WRITE;
/*!40000 ALTER TABLE `certifications` DISABLE KEYS */;
INSERT INTO `certifications` VALUES (1,1,'AWS Certified Developer','Amazon Web Services',2023,'AWS-123456');
/*!40000 ALTER TABLE `certifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_activities`
--

DROP TABLE IF EXISTS `client_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `type` enum('job_posted','hire','interview','contract_ended') NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `activity_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `client_activities_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_activities`
--

LOCK TABLES `client_activities` WRITE;
/*!40000 ALTER TABLE `client_activities` DISABLE KEYS */;
INSERT INTO `client_activities` VALUES (1,1,'job_posted','Posted Senior Frontend Developer position','2024-01-15'),(2,1,'hire','Hired React Developer','2024-01-10'),(3,1,'interview','3 interviews scheduled','2024-01-08'),(4,2,'job_posted','Posted Product Manager position','2024-01-12'),(5,2,'hire','Hired Full Stack Engineer','2024-01-05'),(6,3,'contract_ended','Contract completed','2023-12-31');
/*!40000 ALTER TABLE `client_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `industry` varchar(100) NOT NULL,
  `size` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `contact_person` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `status` enum('inactive','active','pending') NOT NULL DEFAULT 'pending',
  `joinedDate` date NOT NULL,
  `activeJobs` int NOT NULL DEFAULT '0',
  `totalHires` int NOT NULL DEFAULT '0',
  `revenue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `logo` varchar(500) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'TechCorp Inc.','Technology','500-1000','San Francisco, CA','Sarah Johnson','sarah@techcorp.com','+1 (555) 123-4567','active','2023-06-15',8,24,480000.00,'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?w=100','Leading technology company specializing in cloud solutions and enterprise software.'),(2,'StartupHub','Fintech','50-200','New York, NY','Michael Chen','michael@startuphub.com','+1 (555) 987-6543','active','2023-09-20',3,12,180000.00,'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=100','Fast-growing fintech startup revolutionizing digital payments.'),(3,'DigitalFlow','Marketing','200-500','Austin, TX','Emily Rodriguez','emily@digitalflow.com','+1 (555) 456-7890','inactive','2023-03-10',0,8,120000.00,'https://images.pexels.com/photos/1181216/pexels-photo-1181216.jpeg?w=100','Digital marketing agency helping brands grow their online presence.');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_info`
--

DROP TABLE IF EXISTS `company_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `size` varchar(255) NOT NULL,
  `industry` varchar(255) NOT NULL,
  `founded` date NOT NULL,
  `description` text NOT NULL,
  `culture` text NOT NULL,
  `website` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_info`
--

LOCK TABLES `company_info` WRITE;
/*!40000 ALTER TABLE `company_info` DISABLE KEYS */;
INSERT INTO `company_info` VALUES (1,'TechCorp Inc.','Engineering','500-1000 employees','Technology','2015-01-01','TechCorp is a leading technology company specializing in cloud solutions and enterprise software. We serve over 10,000 customers worldwide and are committed to innovation and excellence.','We believe in fostering a collaborative, inclusive environment where everyone can do their best work. Our team values transparency, continuous learning, and work-life balance.','https://techcorp.com'),(2,'CodeSphere Technologies','Engineering','1000-5000 employees','Software Engineering','2011-06-01','CodeSphere builds enterprise-grade developer tools, cloud infrastructure platforms, and performance-optimized backend services used by Fortune 500 companies.','We cultivate a deeply technical, mentorship-driven culture focused on clean code, peer review, and continuous innovation.','https://codesphere.tech'),(3,'ProdCraft Labs','Product','200-500 employees','Product Management Tools','2016-02-14','ProdCraft helps modern product teams align strategy, execution, and feedback through intuitive roadmapping and collaboration software.','We believe great products are built through transparency, user empathy, and data-informed decision making.','https://prodcraft.io'),(4,'PixelNest Studio','Design','50-100 employees','Creative Design','2018-10-05','PixelNest is a digital design studio specializing in branding, UI/UX, and motion graphics for startups and global brands.','We value craftsmanship, creative freedom, and storytelling. Our team thrives on aesthetic detail and playful collaboration.','https://pixelnest.studio'),(5,'GrowthBeacon','Marketing','500-1000 employees','Marketing & Analytics','2014-03-21','GrowthBeacon empowers marketing teams with data-driven customer insights, automated campaign tools, and conversion optimization services.','Data fuels everything we do. We champion experimentation, growth mindset, and cross-functional learning.','https://growthbeacon.com'),(6,'QuotaMax Systems','Sales','300-700 employees','Sales Enablement','2013-07-30','QuotaMax delivers AI-powered sales intelligence, lead scoring, and CRM enhancements to B2B sales teams across industries.','We foster a high-performance sales culture rooted in accountability, enablement, and celebrating wins together.','https://quotamax.ai'),(7,'CloudNest Global','Engineering','5000-10000 employees','Cloud Computing','2009-01-15','CloudNest provides secure and scalable cloud infrastructure solutions to enterprises and government agencies.','Our culture emphasizes resilience, availability, and a customer-first approach driven by uptime and performance.','https://cloudnestglobal.com'),(8,'NeuroLink Health','Product','100-300 employees','HealthTech','2017-06-23','NeuroLink develops wearable brain-computer interfaces for medical diagnostics and neurofeedback therapy.','We blend neuroscience and engineering in a mission-driven, research-focused environment.','https://neurolinkhealth.com'),(9,'VoltEdge Robotics','Engineering','200-600 employees','Industrial Automation','2012-10-01','VoltEdge designs robotic systems and autonomous platforms for manufacturing, logistics, and agriculture.','We foster a bold, experimental culture with a focus on field testing, reliability, and human-machine synergy.','https://voltedgerobotics.com'),(10,'BrandVerse Media','Marketing','300-900 employees','Digital Marketing','2015-04-18','BrandVerse creates high-impact influencer campaigns and social strategies for global lifestyle brands.','We are creative rebels who embrace trends, data, and diversity in storytelling.','https://brandversemedia.com'),(11,'ClearBank Digital','Product','1000-2000 employees','Fintech / Banking','2010-12-10','ClearBank is a digital-only challenger bank offering real-time payments, business accounts, and open banking APIs.','We are security-driven, lean, and radically transparent with customers and employees alike.','https://clearbankdigital.com'),(12,'AutoPilot AI','Engineering','50-150 employees','Autonomous Vehicles','2019-03-07','AutoPilot AI builds advanced driver-assistance systems (ADAS) and neural net-based perception tools for self-driving cars.','We thrive in cross-disciplinary collaboration and love pushing the boundaries of machine learning.','https://autopilotai.com'),(13,'EcoBuild Materials','Engineering','1000-3000 employees','Sustainable Construction','2007-09-25','EcoBuild manufactures sustainable, carbon-neutral building materials for global construction projects.','Our values include sustainability, circular economy principles, and long-term impact.','https://ecobuildmaterials.com'),(14,'QuantumMesh Networks','Engineering','300-800 employees','Telecommunications','2016-01-11','QuantumMesh builds decentralized mesh network technology for rural connectivity and disaster zones.','We’re a mission-oriented team focused on accessibility, innovation, and engineering freedom.','https://quantummesh.io'),(15,'TalentFuel HR','Product','200-400 employees','Human Resources Tech','2013-05-19','TalentFuel offers AI-driven hiring platforms, employee engagement tools, and performance tracking dashboards.','We believe in the power of people, equity in opportunity, and remote-first flexibility.','https://talentfuelhr.com'),(16,'OrbitCart','Sales','500-1500 employees','E-commerce & Retail','2011-08-30','OrbitCart is an online marketplace specializing in sustainable fashion, home decor, and eco-friendly products.','Our culture is built around customer obsession, design thinking, and environmental consciousness.','https://orbitcart.com');
/*!40000 ALTER TABLE `company_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education_candidate`
--

DROP TABLE IF EXISTS `education_candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education_candidate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `degree` varchar(255) NOT NULL,
  `school` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `gpa` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education_candidate`
--

LOCK TABLES `education_candidate` WRITE;
/*!40000 ALTER TABLE `education_candidate` DISABLE KEYS */;
INSERT INTO `education_candidate` VALUES (1,1,'Bachelor of Science in Computer Science','Stanford University',2019,3.8);
/*!40000 ALTER TABLE `education_candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education_recruiter`
--

DROP TABLE IF EXISTS `education_recruiter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education_recruiter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `degree` varchar(255) NOT NULL,
  `school` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `gpa` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education_recruiter`
--

LOCK TABLES `education_recruiter` WRITE;
/*!40000 ALTER TABLE `education_recruiter` DISABLE KEYS */;
INSERT INTO `education_recruiter` VALUES (1,1,'B.Sc. in Computer Science','University of California, Berkeley',2015,4);
/*!40000 ALTER TABLE `education_recruiter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hired_applications`
--

DROP TABLE IF EXISTS `hired_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hired_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hired_application_id` int NOT NULL,
  `candidate_id` int NOT NULL,
  `job_id` int NOT NULL,
  `responsedAt` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hired_applications`
--

LOCK TABLES `hired_applications` WRITE;
/*!40000 ALTER TABLE `hired_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `hired_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_preferences`
--

DROP TABLE IF EXISTS `job_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_preferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int NOT NULL,
  `salaryMin` int NOT NULL,
  `salaryMax` int NOT NULL,
  `location` text NOT NULL,
  `jobType` enum('full-time','part-time','contract','freelance','internship','temporary','volunteer','remote','hybrid','other') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `job_preferences_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_preferences`
--

LOCK TABLES `job_preferences` WRITE;
/*!40000 ALTER TABLE `job_preferences` DISABLE KEYS */;
INSERT INTO `job_preferences` VALUES (1,1,80000,120000,'San Francisco,Remote','full-time');
/*!40000 ALTER TABLE `job_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recruiterID` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `job_type` enum('full-time','part-time','contract','freelance','internship','temporary','volunteer','remote','hybrid','other') NOT NULL,
  `createdAt` date NOT NULL,
  `experience` int NOT NULL,
  `salaryMin` int NOT NULL,
  `salaryMax` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `requirements` varchar(255) NOT NULL,
  `benefits` varchar(255) NOT NULL,
  `skills` varchar(255) NOT NULL,
  `steps` varchar(255) NOT NULL,
  `views` int NOT NULL,
  `status` enum('active','paused','closed') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,1,'Software Engineer','TechCorp Inc.','Engineering','San Diego, CA','full-time','2025-06-23',2,70000,100000,'Develop and maintain software applications.','[\"Bachelor\'s degree in Computer Science\",\"2+ years experience\"]','[\"Health insurance\",\"stock options\",\"flexible hours\"]','[\"Knowledge of JavaScript, React, and Node.js\"]','[\"CV checked\",\"Interview via Microsoft team\",\"Test\",\"Offer\"]',127,'active'),(2,1,'Associate Product Manager','ProdCraft Labs','Product','Tijuana, BC','internship','2025-05-13',0,20000,30000,'Support senior PMs in product delivery.','[\"Currently pursuing a business or tech degree.\"]','[\"Mentorship\", \"learning programs\", \"stipend\"]','[\"Research\", \"Excel\", \"basic UX\"]','[\"\"]',186,'active'),(3,1,'Sales Associate','QuotaMax Systems','Sales','Austin, TX','part-time','2025-07-29',1,25000,40000,'Assist customers and drive in-store sales.','[\"Retail experience preferred\"]','[\"Part-time flexibility\", \"employee discounts\"]','[\"Communication, POS systems, upselling\"]','[\"\"]',167,'paused'),(4,1,'Digital Marketing Specialist','BrandVerse Media','Marketing','Monterrey, NL','full-time','2025-04-30',2,60000,85000,'Run digital campaigns and SEO optimization.','[\"Experience with Google Ads and SEO tools\"]','[\"Bonuses\", \"team events\", \"hybrid work\"]','[\"SEO\", \"Google Analytics\", \"SEM\"]','[\"\"]',123,'closed'),(5,1,'UX Designer','PixelNest Studio','Design','Austin, TX','full-time','2025-01-05',2,65000,90000,'Lead product development and roadmap.','[\"Proven experience managing cross-functional teams.\"]','[\"401k\", \"health insurance\", \"learning budget\"]','[\"Agile\",\"Communication\",\"Analytics\"]','[\"\"]',1,'active');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruiters`
--

DROP TABLE IF EXISTS `recruiters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruiters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(512) DEFAULT NULL,
  `createdAt` date NOT NULL,
  `bio` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company` varchar(255) NOT NULL,
  `industry` varchar(255) NOT NULL,
  `companySizeMin` int NOT NULL,
  `companySizeMax` int NOT NULL,
  `address` text NOT NULL,
  `foundedYear` int NOT NULL,
  `companyDescription` text NOT NULL,
  `employerRole` varchar(255) NOT NULL,
  `requirements` text NOT NULL,
  `companyTypes` text NOT NULL,
  `companyLocation` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruiters`
--

LOCK TABLES `recruiters` WRITE;
/*!40000 ALTER TABLE `recruiters` DISABLE KEYS */;
INSERT INTO `recruiters` VALUES (1,'sarah@techcorp.com','demo1234','Sarah Johnson','https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150','2024-01-15','Passionate frontend developer turned tech recruiter, helping companies find top talent in the software industry.','San Francisco, CA','+1 (415) 555-0198','TechCorp Inc.','Information Technology',201,500,'123 Market Street, San Francisco, CA 94103',2010,'TechCorp Solutions is a fast-growing SaaS company that specializes in enterprise collaboration tools and AI-powered business automation.','Lead Technical Recruiter','[\"Strong understanding of frontend frameworks (React, Vue)\",\"5+ years of development or technical recruiting experience\",\"Excellent communication and organizational skills\"]','[\"Startup\", \"SaaS\", \"Remote-first\"]','Hybrid - San Francisco HQ with remote options'),(2,'jane.smith@example.com','SecureP@ssw0rd!','Jane Smith','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg','2015-08-20','Professional recruiter with 10+ years experience connecting top talent to leading companies.','Tijuana, Baja California, Mexico','+52-664-555-1234','TalentMatch Global','Human Resources',50,200,'Av. de la Innovación 123, Tijuana, BC, Mexico',2012,'TalentMatch Global helps organizations find and retain top talent worldwide.','Lead Recruiter','[\"Experience in full-cycle recruiting\", \"excellent communication skills\"]','[\"Full-time\", \"Hybrid\"]','Tijuana, Baja California, Mexico');
/*!40000 ALTER TABLE `recruiters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int NOT NULL,
  `referredDate` date NOT NULL,
  `status` enum('rejected','under_review','hired','interview_scheduled') NOT NULL,
  `jobTitle` varchar(255) NOT NULL,
  `referralBonus` int NOT NULL,
  `notes` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referrals`
--

LOCK TABLES `referrals` WRITE;
/*!40000 ALTER TABLE `referrals` DISABLE KEYS */;
INSERT INTO `referrals` VALUES (1,1,'2025-11-03','under_review','Software Engineer',2000,'Test'), (2,4,'2024-06-10','under_review','Machine Learning Engineer',2000,'Strong academic background and open-source contributions.');
/*!40000 ALTER TABLE `referrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referrer`
--

DROP TABLE IF EXISTS `referrer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `referral_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `professionalTitle` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `relationship` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `referral_id` (`referral_id`),
  CONSTRAINT `referrer_ibfk_1` FOREIGN KEY (`referral_id`) REFERENCES `referrals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referrer`
--

LOCK TABLES `referrer` WRITE;
/*!40000 ALTER TABLE `referrer` DISABLE KEYS */;
INSERT INTO `referrer` VALUES (1,1,'Dr. Alan Turing','Chief Scientist','NeuroNet Labs','PhD Advisor'),(2,2,'Sandra Lee','Security Team Lead','SecureLayer','Former Manager'),(3,3,'Luis Ortega','Marketing Director','BrightMedia','Colleague'),(4,4,'Sandra Lee','Security Team Lead','SecureLayer','Former Manager');
/*!40000 ALTER TABLE `referrer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rejected_applications`
--

DROP TABLE IF EXISTS `rejected_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rejected_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rejected_application_id` int NOT NULL,
  `candidate_id` int NOT NULL,
  `job_id` int NOT NULL,
  `reason` text NOT NULL,
  `responsedAt` date NOT NULL,
  `comentario` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rejected_applications`
--

LOCK TABLES `rejected_applications` WRITE;
/*!40000 ALTER TABLE `rejected_applications` DISABLE KEYS */;
INSERT INTO `rejected_applications` VALUES (1,1,2,3,'Lack of required experience.','2025-06-15',''),(2,2,5,4,'Position filled internally.','2025-07-01','');
/*!40000 ALTER TABLE `rejected_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline`
--

DROP TABLE IF EXISTS `timeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline` (
  `id` int NOT NULL AUTO_INCREMENT,
  `referral_id` int NOT NULL,
  `event` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `status` enum('completed','in_progress','pending','scheduled') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `referral_id` (`referral_id`),
  CONSTRAINT `timeline_ibfk_1` FOREIGN KEY (`referral_id`) REFERENCES `referrals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline`
--

LOCK TABLES `timeline` WRITE;
/*!40000 ALTER TABLE `timeline` DISABLE KEYS */;
INSERT INTO `timeline` VALUES (1,1,'Application Submitted','2024-06-10','completed'),(2,1,'Technical Screening','2024-06-14','completed'),(3,1,'Manager Review','2024-06-18','in_progress'),(4,2,'Application Submitted','2024-05-22','completed'),(5,2,'HR Interview Scheduled','2024-07-05','scheduled'),(6,3,'Application Submitted','2024-07-01','completed'),(7,3,'Final Interview','2024-07-10','completed'),(8,3,'Offer Accepted','2024-07-15','completed');
/*!40000 ALTER TABLE `timeline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_experience`
--

DROP TABLE IF EXISTS `work_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_experience` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `work_experience_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_experience`
--

LOCK TABLES `work_experience` WRITE;
/*!40000 ALTER TABLE `work_experience` DISABLE KEYS */;
INSERT INTO `work_experience` VALUES (1,1,'Senior Frontend Developer','TechFlow Inc.','San Francisco, CA','2022-01-01','2025-07-24','Led frontend development for multiple high-traffic web applications.'),(2,2,'UX Designer','Pixel Studio','Austin, TX','2021-05-01',NULL,'Led end-to-end UX process for mobile applications.'),(3,2,'Junior Designer','CreativeSoft','Austin, TX','2017-02-01','2021-04-30','Supported design team in website revamps and branding.'),(4,3,'Data Engineer','CloudSolve Inc.','Seattle, WA','2021-06-01',NULL,'Built ETL workflows on AWS and integrated Apache Spark.'),(5,3,'Data Analyst','Zenix Solutions','Seattle, WA','2018-07-01','2021-05-30','Performed data cleaning, visualization, and dashboarding.'),(6,4,'NLP Research Scientist','NeuroNet Labs','New York, NY','2020-01-10',NULL,'Conducted research on large language models and published 4 papers in major AI conferences.'),(7,5,'DevOps Engineer','ScaleOps','Denver, CO','2018-06-01',NULL,'Managed CI/CD pipelines and infrastructure as code across multi-cloud environments.');
/*!40000 ALTER TABLE `work_experience` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-11 12:27:23
