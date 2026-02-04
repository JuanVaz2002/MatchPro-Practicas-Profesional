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
<<<<<<< HEAD
INSERT INTO `ai_analysis` VALUES (1,1,'[\"Strong programming skills in C++, Lua, Python, and C#.\",\"Experience with multiple game engines and tools (Love2D, Ursina Engine, SDL2, VS Code).\",\"Experience in designing and programming both 2D and 3D games.\",\"Experience with performance optimization, game physics, and cross-platform deployment.\",\"Experience with source control and CI using GitHub Actions.\",\"Education in Computer Science with specialization in graphics programming and game engines.\"]','[\"The CV is tailored for a Game Developer role, but John Smith is applying for Software Engineer. The experience section needs to be more generalized to showcase broader software engineering capabilities.\",\"The CV lacks details on specific projects and accomplishments. The bullet points under experience are too general.\",\"The CV only mentions indie game development experience, which may not be relevant to all software engineering roles.\"]','John Smith is a capable programmer with experience in game development. To make their CV more attractive to Software Engineer roles, they should highlight transferable skills, provide more specific examples of their work, and possibly include personal projects or contributions to open-source projects that demonstrate broader software engineering abilities. Tailoring the CV to the specific job requirements is crucial.',70,'https://www.dropbox.com/scl/fi/15295gi0haj19ggd0i42d/CV-John-Smith.pdf?rlkey=kdfja0oaymag2untvwsn6fvjf&dl=0','2025-08-12');
=======
INSERT INTO `ai_analysis` VALUES (1,1,'[\"Strong programming skills in C++, Lua, Python, and C#.\",\"Experience with multiple game engines and tools (Love2D, Ursina Engine, SDL2, VS Code).\",\"Experience in designing and programming both 2D and 3D games.\",\"Experience with performance optimization, game physics, and cross-platform deployment.\",\"Experience with source control and CI using GitHub Actions.\",\"Education in Computer Science with specialization in graphics programming and game engines.\"]','[\"The CV is tailored for a Game Developer role, but John Smith is applying for Software Engineer. The experience section needs to be more generalized to showcase broader software engineering capabilities.\",\"The CV lacks details on specific projects and accomplishments. The bullet points under experience are too general.\",\"The CV only mentions indie game development experience, which may not be relevant to all software engineering roles.\"]','John Smith is a capable programmer with experience in game development. To make their CV more attractive to Software Engineer roles, they should highlight transferable skills, provide more specific examples of their work, and possibly include personal projects or contributions to open-source projects that demonstrate broader software engineering abilities. Tailoring the CV to the specific job requirements is crucial.',70,'https://www.dropbox.com/scl/fi/15295gi0haj19ggd0i42d/CV-John-Smith.pdf?rlkey=kdfja0oaymag2untvwsn6fvjf&dl=0','2025-08-12'),(2,4,'[\"Strong background in NLP and deep learning.\",\"Experience publishing in top-tier conferences.\",\"Experience in designing and deploying deep learning models.\",\"PhD from a top university (MIT).\",\"Relevant skills listed (Python, TensorFlow, Keras, NLP, Deep Learning).\",\"Experience collaborating in interdisciplinary teams.\"]','[\"The CV lacks specific details on projects and accomplishments.\",\"The \'Additional Details\' section is sparse and doesn\'t add much value.\",\"No quantifiable results are presented.\"]','Emily Zhang\'s CV is good and demonstrates a solid foundation in AI research. The CV highlights relevant skills, education, and experience. However, to strengthen the CV and better showcase her capabilities, Emily should include details of her projects, quantifying results where possible, and expand on her skills.',78,'https://craftmypdf-gen.s3.ap-southeast-1.amazonaws.com/b69e1e8f-0f7d-4fa2-a2f2-2b056ab2f7f4/output.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ENCBKJYLWJUD36X%2F20250806%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250806T162704Z&X-Amz-Expires=300&X-Amz-Signature=bdb58f2845e31af1591a68405051dc2c0fabb960989bda737b24cc4f37b933b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject','2025-08-06'),(3,7,'[\"Strong background in AI, NLP, and deep learning.\",\"Published in major conferences.\",\"Experience designing and deploying deep learning models.\",\"PhD in Computer Science from MIT.\"]','[\"The CV is strongly geared towards AI/ML research, not Cybersecurity Analysis.\",\"Lack of relevant cybersecurity skills or experience.\",\"The listed certification (CKA) is not directly related to cybersecurity.\",\"The CV is missing essential keywords for a Cybersecurity Analyst position.\"]','The candidate\'s background is in AI research, not Cybersecurity. While possessing strong technical skills, the CV needs significant restructuring and additions to align with the requirements of a Cybersecurity Analyst role. Without substantial changes, the candidate is unlikely to be considered for Cybersecurity Analyst positions.',45,'https://craftmypdf-gen.s3.ap-southeast-1.amazonaws.com/dc81cd1d-137a-4bbf-b1c8-a6589b301bf3/output.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ENCBKJYLWJUD36X%2F20250807%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250807T193633Z&X-Amz-Expires=300&X-Amz-Signature=b817ed9352b5e722219f503e04e728b197fea8d2f7e7ddf5b6501d4735336bc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject','2025-08-07'),(4,3,'[\"Strong background in NLP and deep learning.\",\"Experience with Python and TensorFlow.\",\"Publications in top-tier conferences.\",\"PhD in Computer Science from MIT.\",\"Certified Kubernetes Administrator (CKA).\"]','[\"The CV is geared towards an AI Research Scientist role, not a Data Engineer role.\",\"The work experience described focuses on research rather than data engineering tasks.\",\"The professional summary does not align with the desired Data Engineer position.\",\"The CV is missing key skills and experiences typically expected of a Data Engineer.\"]','Emily has a strong academic background and experience in AI research. However, the CV needs significant revisions to target a Data Engineer role. The content should be re-oriented to highlight skills and experiences relevant to data engineering, and the objective should be clearly stated.',55,'https://craftmypdf-gen.s3.ap-southeast-1.amazonaws.com/b6b249a2-1b49-4f58-891b-226f358af497/output.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ENCBKJYLWJUD36X%2F20250808%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250808T170311Z&X-Amz-Expires=300&X-Amz-Signature=0613f3eb34233c73f3ed8de5ae5c87ce06cd84cdc0ddd724c2ae9f96ee324e62&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject','2025-08-08'),(5,24,'[\"Clear and concise professional summary highlighting key skills and experience.\",\"Well-structured work experience section with quantifiable achievements.\",\"Relevant education and certification details.\",\"Clearly listed skills relevant to the role of a Math Teacher.\",\"Includes job preferences, indicating desired location, employment type, and salary.\"]','[\"The phone number and email format are slightly unconventional (extra characters).\",\"The salary range is very low for a teacher with 9 years of experience in Tokyo. This might be an error or could deter potential employers.\"]','Hana Suzuki is a strong candidate for Math Teacher positions in Tokyo. Her CV showcases relevant experience, skills, and education. Addressing the minor formatting issues and ensuring the salary expectations are accurate will further strengthen her application.',85,'https://www.dropbox.com/scl/fi/8i7mwyrbrbsrf0t2j88u9/CV-Hana-Suzuki.pdf?rlkey=5hbd3slkcam5xnj1uf1pnecai&dl=0','2025-09-01'),(7,35,'[\"6+ years of experience in game development using Unity and Unreal Engine.\",\"Experience leading teams and contributing to AAA-quality games.\",\"Proficiency in C#, C++, Shader Programming, and multiplayer networking.\",\"Certifications in Unity and C++.\",\"Experience optimizing game performance and rendering pipelines.\",\"Strong academic background with a Bachelor of Science in Computer Science.\",\"Experience with Agile Development and Version Control (Git).\"]','[\"The \'Job Preference\' section contains undefined or missing data.\",\"Lack of specific details about the candidate\'s contributions to game design and interactive storytelling beyond general statements.\"]','Aleksi Laaksonen is a highly qualified Senior Game Developer with solid experience, technical skills, and leadership abilities, making them a strong candidate for senior-level roles.',85,'https://www.dropbox.com/scl/fi/bvnpfjbdhrsvwaj15qsbc/CV-Aleksi-Laaksonen.pdf?rlkey=wqig8vevpu5az4l6yehu1ctvt&dl=0','2025-09-18'),(9,37,'[\"Relevant skills in Frontend and Backend technologies, including React, Node.js, and MySQL.\",\"Experience with Dev Tools like Git and Docker.\",\"Web Developer experience at Universidad Autónoma de Baja California.\",\"Personal project demonstrates practical application of skills (Celebrate Graduaciones).\",\"Certifications in AWS and TensorFlow add value.\",\"Strong English proficiency.\"]','[\"Limited professional experience as the candidate is still a student.\",\"The description of contributions in previous roles is somewhat vague. Needs more quantifiable achievements.\",\"The summary focuses on machine learning, which is not directly related to the Web Developer role.\"]','Jesus Alonso Reyes Castro is a promising candidate for a Web Developer role, particularly for entry-level positions, given his relevant skills, project experience, and certifications. Further elaborating on project contributions and highlighting web development-specific skills will strengthen his application.',75,'https://www.dropbox.com/scl/fi/egyshh93xjmw7x7rf8388/CV-Jesus-Alonso-Reyes-Castro-123456.pdf?rlkey=upqwr329s56sftaiuwnyj4tmz&dl=0','2025-09-23'),(11,39,'[\"5+ years of experience in animation studios.\",\"Proficient in Autodesk Maya, Blender, and Adobe After Effects.\",\"Experience in character rigging and motion graphics.\",\"Experience working on animated short films and advertising campaigns.\",\"Autodesk Maya Certified Professional and Adobe After Effects Specialist certifications.\"]','[\"Lack of specific examples of projects or achievements.\",\"Limited information on specific animation styles or techniques.\",\"The CV mentions assistance with 3D modeling and rendering tasks, but doesn\'t elaborate on candidate\'s direct skills on this topic.\"]','Valeria Rojas is a capable 3D animator with relevant experience and certifications, making her a promising candidate for roles that require character rigging, motion graphics, and collaboration skills.',78,'https://www.dropbox.com/scl/fi/bshyvdi7217zlq4u39pty/CV-Valeria-Rojas-123456.pdf?rlkey=h6lf2l6ryeipn4a2vky7xhh0f&dl=0','2025-09-30'),(12,40,'[\"Relevant experience in AI and machine learning roles.\",\"Strong skills in Python, TensorFlow, PyTorch, and cloud technologies (AWS, Docker, Kubernetes).\",\"Master\'s degree in Artificial Intelligence from a reputable university (Stanford).\",\"Possession of relevant certifications (TensorFlow Developer, AWS Certified Machine Learning – Specialty).\",\"Experience with model deployment and MLOps.\"]','[\"The professional summary states 7+ years of experience, but the work experience dates only account for around 3 years of experience. This is a discrepancy.\",\"Lack of specific project details or quantifiable achievements in the work experience descriptions.\"]','David Chen presents a strong profile for an AI Engineer role, possessing relevant skills, education, and certifications; however, the discrepancy in the years of experience needs to be addressed and clarified.',88,'https://www.dropbox.com/scl/fi/84545q70z54lzdv2639rd/CV-David-Chen-123456.pdf?rlkey=044itlllavr1urigpxetkygii&dl=0','2025-10-01'),(13,41,'[\"Relevant experience as an HR Specialist and HR Coordinator.\",\"Possesses certifications in PHR and HR Business Partner.\",\"Demonstrates skills in talent acquisition, employee relations, and HR policy development.\",\"Experience in full-cycle recruitment and employee onboarding.\"]','[\"No specific achievements quantified in the HR Coordinator role.\",\"Limited detail on specific HRIS systems used.\"]','Sophie Müller is a suitable candidate for the HR Specialist role, possessing relevant experience, certifications, and skills, making her a strong contender for the position in Berlin.',85,'https://www.dropbox.com/scl/fi/3oton6ey3cv478m6qs5l3/CV-Sophie-M-ller-123456.pdf?rlkey=tcwatw8usguelzj9yci9sekb6&dl=0','2025-10-02'),(14,42,'[\"Extensive experience with major cloud platforms (AWS, Azure, GCP)\",\"Strong skills in key technologies like Kubernetes, Terraform, and CI/CD pipelines\",\"Relevant certifications in AWS, Google Cloud, and Azure\",\"Experience in architecting multi-cloud solutions and leading cloud engineers\",\"Experience in cloud migration, cost optimization, and security\"]','[\"None\"]','Andrés Gómez is a highly qualified Cloud Architect candidate with extensive experience, relevant certifications, and a strong skill set, making him a valuable asset to any organization.',88,'https://www.dropbox.com/scl/fi/4nm9hr7wqy8by1xj1gyqu/CV-Andr-s-G-mez-123456.pdf?rlkey=kebir00h0wsfr1kzl03bz9hm4&dl=0','2025-10-03'),(15,43,'[\"Experience with multiple programming languages (Python, TypeScript, Java, JavaScript, C)\",\"Familiarity with frontend (React, TailwindCSS, HTML, CSS) and backend (Node.js) technologies\",\"Experience with databases (MySQL, PostgreSQL)\",\"Proficient with Dev Tools like Git and Docker\",\"AWS Academy Cloud Architecting and TensorFlow Developer certifications\",\"Experience with Django framework\",\"Experience in documenting and resolving bugs to improve system stability\",\"Experience in developing web applications\"]','[\"Limited professional experience (only one web developer role)\",\"Projects are still in development\",\"Lack of quantifiable achievements in the experience section\"]','Jesus Alonso Reyes Castro demonstrates strong potential as a Software Engineer with a solid foundation in various technologies and a proactive approach to learning. Further experience and quantifiable results will significantly enhance their profile.',75,'https://www.dropbox.com/scl/fi/ryl3helo99noiu2oa5irb/CV-Dayane-Camacho-538921.pdf?rlkey=20nbnltx0wownlahvxkwv30qo&dl=0','2025-10-03');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `candidates` VALUES (1,'john@example.com','demo1234','John Smith','https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=150','2024-01-15','Passionate frontend developer with 5+ years of experience building scalable web applications.','San Francisco, CA','5551234567','TechFlow Inc.','Software Development','[\"JavaScript\",\"React\",\"Node.js\",\"TypeScript\"]',5,1,'Software Engineer',70,'not_looking','coding-communities');
=======
INSERT INTO `candidates` VALUES (1,'john@example.com','demo1234','John Smith','https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=150','2024-01-15','Passionate frontend developer with 5+ years of experience building scalable web applications.','San Francisco, CA','5551234567','TechFlow Inc.','Software Development','[\"JavaScript\",\"React\",\"Node.js\",\"TypeScript\"]',5,1,'Software Engineer',70,'not_looking','coding-communities'),(2,'sophia.designs@example.com','sophiapass2024','Sophia Reyes','https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150','2023-10-05','Creative UX/UI designer with 7 years of experience designing intuitive digital interfaces across web and mobile.','Austin, TX','5559876543','Pixel Studio','Design','[\"Figma\",\"Sketch\",\"Adobe XD\",\"HTML\",\"CSS\",\"User Research\",\"Prototyping\"]',7,0,'UX/UI Designer',0,'available_soon','company-career-page'),(3,'michael.data@example.com','dataengine2024','Michael Tanaka','https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=150','2022-05-22','Data engineer focused on scalable ETL pipelines, big data systems, and cloud infrastructure.','Seattle, WA','5553217788','CloudSolve Inc.','Data & Analytics','[\"Python\",\"SQL\",\"Spark\",\"Hadoop\",\"AWS\",\"Airflow\",\"Docker\"]',6,1,'Data Engineer',55,'available','social-media'),(4,'emily.ai@example.com','emilypass2025','Emily Zhang','https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=150','2023-09-12','AI researcher with a strong background in NLP and deep learning. Published in major conferences.','New York, NY','5552221111','NeuroNet Labs','Artificial Intelligence','[\"Python\",\"TensorFlow\",\"Keras\",\"NLP\",\"Deep Learning\"]',4,1,'AI Research Scientist',78,'available','direct-outreach'),(5,'david.devops@example.com','davidsecure2024','David Martínez','https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150','2022-12-01','DevOps engineer experienced in CI/CD pipelines, Kubernetes, and cloud architecture.','Denver, CO','5554447777','ScaleOps','DevOps','[\"AWS\",\"Docker\",\"Kubernetes\",\"Jenkins\",\"Terraform\",\"CI/CD\"]',6,0,'Senior DevOps Engineer',0,'available_soon','company-career-page'),(6,'linda.hr@example.com','hrlinda2023','Linda Gomez','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150','2024-03-18','HR manager with a passion for talent development and organizational culture.','Miami, FL','5553338888','PeopleFirst Co.','Human Resources','[\"HRIS\",\"Recruitment\",\"Employee Engagement\",\"Leadership\",\"Training\"]',8,0,'HR Manager',0,'available_soon','recruitment-events'),(7,'tom.cyber@example.com','cybertom2025','Tomislav Novak',NULL,'2023-06-25','Cybersecurity analyst focused on threat detection, mitigation, and risk assessment.','Chicago, IL','5551230000','SecureLayer','Cybersecurity','[\"Network Security\",\"Penetration Testing\",\"SIEM\",\"Splunk\",\"Python\"]',5,1,'Cybersecurity Analyst',45,'available','professional-conferences'),(8,'alina.marketing@example.com','alinamarket2024','Alina Petrova','https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150','2022-10-10','Digital marketing expert with experience in SEO, PPC, and content strategy.','Los Angeles, CA','5556665555','BrightMedia','Marketing','[\"SEO\",\"PPC\",\"Google Ads\",\"Content Marketing\",\"Analytics\"]',7,0,'Digital Marketing Specialist',0,'open_to_opportunities','direct-outreach'),(9,'emma.jones@example.com','securePass123','Emma Jones',NULL,'2025-08-19','Motivated software tester with strong QA skills.','Los Angeles, CA','5552227890','QualitySoft LLC','Software Testing','[\"Selenium\",\"Python\",\"Postman\",\"JIRA\"]',3,0,'QA Engineer',0,'available','social-media'),(11,'carlos.ramirez@example.com','mechPass2025','Carlos Ramirez',NULL,'2025-08-19','Mechanical engineer focused on automotive design and testing.','Detroit, MI','5553331111','AutoTech Motors','Automotive','[\"SolidWorks\",\"ANSYS\",\"Matlab\",\"CAD\"]',6,0,'Mechanical Engineer',0,'open_to_opportunities','other'),(14,'emma.qa@example.com','securePass123','Emma Jones',NULL,'2025-08-19','Motivated software tester with strong QA skills.','Los Angeles, CA','5552227890','QualitySoft LLC','Software Testing','[\"Selenium\",\"Python\",\"Postman\",\"JIRA\"]',3,0,'QA Engineer',0,'available','other'),(16,'ramirez.mech@example.com','mechPass2025','Carlos Ramirez',NULL,'2025-08-19','Mechanical engineer focused on automotive design and testing.','Detroit, MI','5553331111','AutoTech Motors','Automotive','[\"SolidWorks\",\"ANSYS\",\"Matlab\",\"CAD\"]',6,0,'Mechanical Engineer',0,'open_to_opportunities','direct-outreach'),(17,'aisha.datasci@example.com','dataPass2025','Aisha Khan','https://images.pexels.com/photos/774909/pexels-photo.jpeg?w=150','2025-08-19','Data scientist passionate about AI and predictive modeling.','Toronto, Canada','5554442222','InsightAI','Data Science','[\"Python\",\"R\",\"TensorFlow\",\"SQL\",\"Machine Learning\"]',4,0,'Data Scientist',0,'available','employee-referral'),(18,'priya.health@example.com','nursePass2025','Priya Patel',NULL,'2025-08-19','Dedicated nurse practitioner with focus on pediatrics.','Houston, TX','5551112223','Children Health Center','Healthcare','[\"Pediatrics\",\"Patient Care\",\"Clinical Research\"]',8,0,'Nurse Practitioner',0,'open_to_opportunities','other'),(19,'liam.civil@example.com','civilPass2025','Liam O’Connor',NULL,'2025-08-19','Civil engineer with focus on sustainable infrastructure projects.','Dublin, Ireland','5555551234','GreenBuild Ltd.','Construction','[\"AutoCAD\",\"Structural Analysis\",\"Project Management\"]',10,0,'Civil Engineer',0,'available','employee-referral'),(20,'mei.marketing@example.com','mktgPass2025','Mei Ling','https://images.pexels.com/photos/774909/pexels-photo.jpeg?w=150','2025-08-19','Marketing specialist with expertise in digital and social media campaigns.','Singapore','5556661212','BrightAds Agency','Marketing','[\"SEO\",\"Google Analytics\",\"Social Media\",\"Content Strategy\"]',5,0,'Marketing Specialist',0,'available_soon','recruitment-events'),(21,'d.lopez.elec@example.com','elecPass2025','David Lopez','https://images.pexels.com/photos/91227/pexels-photo.jpeg?w=150','2025-08-19','Licensed electrician with residential and commercial experience.','Phoenix, AZ','5557779090','Lopez Electricals','Trades','[\"Wiring\",\"Blueprints\",\"Safety Codes\",\"Troubleshooting\"]',12,1,'Electrician',85,'available_soon','company-career-page'),(22,'sofia.rossi.design@example.com','designPass2025','Sofia Rossi','https://images.pexels.com/photos/415829/pexels-photo.jpeg?w=150','2025-08-19','Creative fashion designer blending classic and modern aesthetics.','Milan, Italy','5558881414','Studio Rossi','Fashion','[\"Sketching\",\"Illustrator\",\"Textile Design\",\"Trend Analysis\"]',7,0,'Fashion Designer',0,'available_soon','social-media'),(23,'ethan.chef@example.com','chefPass2025','Ethan Smith',NULL,'2025-08-19','Professional chef with expertise in Italian and French cuisine.','New York, NY','5559991515','La Bella Cucina','Hospitality','[\"Culinary Arts\",\"Menu Design\",\"Food Safety\"]',15,0,'Executive Chef',0,'available_soon','direct-outreach'),(24,'hana.teacher@example.com','teachPass2025','Hana Suzuki',NULL,'2025-08-19','Dedicated high school teacher specializing in mathematics.','Tokyo, Japan','5552221616','Tokyo High School','Education','[\"Mathematics\",\"Curriculum Development\",\"Teaching\"]',9,1,'Math Teacher',85,'available_soon','social-media'),(25,'ahmed.cybersec@example.com','cyberPass2025','Ahmed Ali','https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=150','2025-08-19','Cybersecurity specialist experienced in penetration testing and SOC operations.','Dubai, UAE','5553331717','SecureTech','Cybersecurity','[\"Networking\",\"Ethical Hacking\",\"SIEM\",\"Incident Response\"]',6,0,'Cybersecurity Specialist',0,'open_to_opportunities','other'),(35,'aleksi.laaksonen@example.com','SecurePass#2025','Aleksi Laaksonen',NULL,'2025-09-18',NULL,NULL,'840-123-4567',NULL,NULL,NULL,6,1,'Senior Game Developer',85,'available_soon','employee-referral'),(37,'jesus.reyes.castro@uabc.edu.mx','Perkele2020','Jesus Reyes',NULL,'2025-09-23',NULL,NULL,'6647599179',NULL,NULL,NULL,0,1,'Web Developer',75,'available_soon','university-partnerships'),(39,'valeria.rojas@example.com','Perkele1234','Valeria Rojas',NULL,'2025-09-30',NULL,NULL,'1987654321',NULL,NULL,NULL,8,1,'3D animator',78,'available_soon','social-media'),(40,'david.chen@example.com','perkele#1234','David Chen',NULL,'2025-10-01',NULL,NULL,'4155557890',NULL,NULL,NULL,3,1,'AI Engineer',88,'available_soon','job-boards'),(41,'sophie.mueller@example.com','Perkele1234','Sophie Müller',NULL,'2025-10-02',NULL,'Berlin, Germany','1512345678',NULL,NULL,NULL,11,1,'HR Specialist',85,'available_soon','job-boards'),(42,'andres.gomez@example.com','SecureCode#1234','Andrés Gómez',NULL,'2025-10-03',NULL,NULL,'3004567890',NULL,NULL,NULL,4,1,'Cloud Architect',88,'available_soon','professional-conferences'),(43,'dcamacho@arkusnexus.com','1234','Dayane Camacho',NULL,'2025-10-03',NULL,NULL,'3323657418',NULL,NULL,NULL,0,1,'Software engineer',75,'available_soon','recruitment-events');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `candidates_database` VALUES (1,1,1,'2025-06-25');
=======
INSERT INTO `candidates_database` VALUES (1,1,1,'2025-06-25'),(2,3,1,'2025-07-10'),(3,4,1,'2025-07-23'),(4,7,3,'2025-08-08'),(5,5,1,'2025-08-18'),(6,7,1,'2025-08-19'),(7,8,1,'2025-08-20'),(8,9,1,'2025-08-22'),(9,24,1,'2025-08-22'),(10,26,1,'2025-09-08'),(11,35,1,'2025-09-18'),(12,11,1,'2025-09-18'),(13,14,1,'2025-09-19'),(14,16,1,'2025-09-20'),(15,18,1,'2025-09-21'),(16,19,1,'2025-09-22'),(17,37,1,'2025-09-23'),(18,23,1,'2025-09-30'),(19,39,1,'2025-09-30'),(20,40,1,'2025-10-01'),(21,41,1,'2025-10-02'),(22,42,1,'2025-10-03'),(23,43,1,'2025-10-03');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `certifications` VALUES (1,1,'AWS Certified Developer','Amazon Web Services',2023,'AWS-123456');
=======
INSERT INTO `certifications` VALUES (1,1,'AWS Certified Developer','Amazon Web Services',2023,'AWS-123456'),(6,8,'TensorFlow Developer Certificate','DeepLearning.AI',2023,'TFDL-2033'),(7,4,'Certified Kubernetes Administrator (CKA)','Cloud Native Computing Foundation',2022,'CKA-00122'),(8,5,'Senior Certified HR Professional (SHRM-SCP)','SHRM',2021,'SHRM-5568'),(9,6,'CompTIA Security+','CompTIA',2022,'SEC-778899'),(10,7,'Google Ads Certification','Google',2023,'GAD-4558'),(11,9,'ISTQB Certified Tester','ISTQB',2021,'ISTQB-001122'),(12,14,'ISTQB Certified Tester','ISTQB',2021,'ISTQB-001122'),(13,16,'Certified SolidWorks Professional','Dassault Systèmes',2020,'CSWP-67890'),(14,17,'Google TensorFlow Developer','Google',2021,'TFDEV-2021-09'),(15,17,'AWS Machine Learning Specialty','Amazon Web Services',2022,'AWS-MLS-9001'),(16,18,'Certified Pediatric Nurse Practitioner','PNCB',2017,'CPNP-7788'),(17,19,'LEED Accredited Professional','US Green Building Council',2018,'LEED-AP-8899'),(18,20,'Google Ads Certification','Google',2019,'GA-12345'),(19,20,'HubSpot Inbound Marketing','HubSpot',2020,'HS-IM-2020'),(20,22,'Adobe Illustrator Certification','Adobe',2016,'AI-RO-2016'),(21,24,'Teaching License','Japanese Ministry of Education',2014,'JP-EDU-999'),(22,25,'Certified Ethical Hacker','EC-Council',2019,'CEH-4455'),(23,25,'CompTIA Security+','CompTIA',2020,'SEC+-2020');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `education_candidate` VALUES (1,1,'Bachelor of Science in Computer Science','Stanford University',2019,3.8);
=======
INSERT INTO `education_candidate` VALUES (1,1,'Bachelor of Science in Computer Science','Stanford University',2019,3.8),(2,2,'Bachelor of Arts in Graphic Design','University of Texas at Austin',2016,3.6),(3,2,'Professional Certificate in UX Design','Google/Coursera',2021,4),(4,3,'Bachelor of Science in Data Engineering','University of Washington',2018,3.9),(5,3,'Master of Science in Computer Science','Georgia Tech',2021,3.8),(6,4,'PhD in Computer Science','Massachusetts Institute of Technology',2022,3.95),(7,5,'Bachelor of Engineering in Computer Systems','University of Colorado Boulder',2017,3.7),(8,6,'Bachelor of Business Administration','Florida International University',2014,3.6),(9,7,'Bachelor of Science in Cybersecurity','DePaul University',2018,3.85),(10,8,'Master in Digital Marketing','University of Southern California',2019,3.9),(11,9,'Bachelor of Science in Information Technology','University of California, Los Angeles',2020,3.7),(12,14,'Bachelor of Science in Information Technology','UCLA',2020,3.7),(13,16,'Bachelor of Mechanical Engineering','University of Michigan',2017,3.5),(14,16,'Master of Mechanical Engineering','Purdue University',2019,3.6),(15,17,'Bachelor of Statistics','University of Toronto',2018,3.9),(16,18,'Bachelor of Nursing','University of Texas',2012,3.6),(17,18,'Master of Nursing','University of Houston',2016,3.7),(18,19,'Bachelor of Civil Engineering','Trinity College Dublin',2012,3.5),(19,20,'Bachelor of Business Administration','National University of Singapore',2017,3.6),(20,21,'Associate of Applied Science in Electrical Technology','Phoenix College',2010,3.4),(21,22,'Bachelor of Fashion Design','Politecnico di Milano',2015,3.7),(22,23,'Diploma in Culinary Arts','Le Cordon Bleu',2009,3.8),(23,24,'Bachelor of Education in Mathematics','University of Tokyo',2013,3.5),(24,25,'Bachelor of Computer Science','American University in Dubai',2017,3.6);
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `education_recruiter` VALUES (1,1,'B.Sc. in Computer Science','University of California, Berkeley',2015,4);
=======
INSERT INTO `education_recruiter` VALUES (1,1,'B.Sc. in Computer Science','University of California, Berkeley',2015,4),(2,2,'Bachelor of Science in Human Resource Management','California State University – Dominguez Hills',2021,3.7);
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
=======
INSERT INTO `hired_applications` VALUES (1,1,1,1,'2025-10-22'),(2,37,40,5,'2025-11-05');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `job_preferences` VALUES (1,1,80000,120000,'San Francisco,Remote','full-time');
=======
INSERT INTO `job_preferences` VALUES (1,1,80000,120000,'San Francisco,Remote','full-time'),(2,2,70000,95000,'Austin,Remote','full-time'),(3,3,100000,140000,'Seattle,Remote','full-time'),(4,4,110000,150000,'New York,Remote','full-time'),(5,5,95000,130000,'Denver,Remote','full-time'),(6,6,80000,100000,'Miami','full-time'),(7,7,90000,120000,'Chicago,Remote','full-time'),(8,8,70000,95000,'Los Angeles,Remote','full-time'),(9,9,60000,85000,'Los Angeles,Remote','full-time'),(10,14,60000,85000,'Los Angeles,Remote','full-time'),(11,16,75000,100000,'Detroit,Remote','full-time'),(12,17,90000,120000,'Toronto,Remote','full-time'),(13,18,80000,105000,'Houston','full-time'),(14,19,70000,95000,'Dublin,Remote','full-time'),(15,20,50000,75000,'Singapore,Remote','full-time'),(16,21,50000,70000,'Phoenix','full-time'),(17,22,65000,90000,'Milan,Remote','full-time'),(18,23,70000,95000,'New York','full-time'),(19,24,40000,60000,'Tokyo','full-time'),(20,25,85000,110000,'Dubai,Remote','full-time'),(21,11,60000,85000,'Los Angeles,Remote','full-time'),(26,35,55000,80000,'','full-time'),(28,37,45000,80000,'','full-time'),(30,39,30000,65000,'','full-time'),(31,40,13000,40000,'','full-time'),(32,41,25000,45000,'Berlin, Germany','full-time'),(33,42,45000,95000,'','full-time'),(34,43,40000,49000,'','full-time');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `jobs` VALUES (1,1,'Software Engineer','TechCorp Inc.','Engineering','San Diego, CA','full-time','2025-06-23',2,70000,100000,'Develop and maintain software applications.','[\"Bachelor\'s degree in Computer Science\",\"2+ years experience\"]','[\"Health insurance\",\"stock options\",\"flexible hours\"]','[\"Knowledge of JavaScript, React, and Node.js\"]','[\"CV checked\",\"Interview via Microsoft team\",\"Test\",\"Offer\"]',127,'active'),(2,1,'Associate Product Manager','ProdCraft Labs','Product','Tijuana, BC','internship','2025-05-13',0,20000,30000,'Support senior PMs in product delivery.','[\"Currently pursuing a business or tech degree.\"]','[\"Mentorship\", \"learning programs\", \"stipend\"]','[\"Research\", \"Excel\", \"basic UX\"]','[\"\"]',186,'active'),(3,1,'Sales Associate','QuotaMax Systems','Sales','Austin, TX','part-time','2025-07-29',1,25000,40000,'Assist customers and drive in-store sales.','[\"Retail experience preferred\"]','[\"Part-time flexibility\", \"employee discounts\"]','[\"Communication, POS systems, upselling\"]','[\"\"]',167,'paused'),(4,1,'Digital Marketing Specialist','BrandVerse Media','Marketing','Monterrey, NL','full-time','2025-04-30',2,60000,85000,'Run digital campaigns and SEO optimization.','[\"Experience with Google Ads and SEO tools\"]','[\"Bonuses\", \"team events\", \"hybrid work\"]','[\"SEO\", \"Google Analytics\", \"SEM\"]','[\"\"]',123,'closed'),(5,1,'UX Designer','PixelNest Studio','Design','Austin, TX','full-time','2025-01-05',2,65000,90000,'Lead product development and roadmap.','[\"Proven experience managing cross-functional teams.\"]','[\"401k\", \"health insurance\", \"learning budget\"]','[\"Agile\",\"Communication\",\"Analytics\"]','[\"\"]',1,'active');
=======
INSERT INTO `jobs` VALUES (1,1,'Software Engineer','TechCorp Inc.','Engineering','San Diego, CA','full-time','2025-06-23',2,70000,100000,'Develop and maintain software applications.','[\"Bachelor\'s degree in Computer Science\",\"2+ years experience\"]','[\"Health insurance\",\"stock options\",\"flexible hours\"]','[\"Knowledge of JavaScript, React, and Node.js\"]','[\"CV checked\",\"Interview via Microsoft team\",\"Test\",\"Offer\"]',127,'active'),(2,1,'Associate Product Manager','ProdCraft Labs','Product','Tijuana, BC','internship','2025-05-13',0,20000,30000,'Support senior PMs in product delivery.','[\"Currently pursuing a business or tech degree.\"]','[\"Mentorship\", \"learning programs\", \"stipend\"]','[\"Research\", \"Excel\", \"basic UX\"]','[\"\"]',186,'active'),(3,2,'Sales Associate','QuotaMax Systems','Sales','Austin, TX','part-time','2025-07-29',1,25000,40000,'Assist customers and drive in-store sales.','[\"Retail experience preferred\"]','[\"Part-time flexibility\", \"employee discounts\"]','[\"Communication, POS systems, upselling\"]','[\"\"]',167,'paused'),(4,4,'Digital Marketing Specialist','BrandVerse Media','Marketing','Monterrey, NL','full-time','2025-04-30',2,60000,85000,'Run digital campaigns and SEO optimization.','[\"Experience with Google Ads and SEO tools\"]','[\"Bonuses\", \"team events\", \"hybrid work\"]','[\"SEO\", \"Google Analytics\", \"SEM\"]','[\"\"]',123,'closed'),(5,1,'UX Designer','PixelNest Studio','Design','Austin, TX','full-time','2025-01-05',2,65000,90000,'Lead product development and roadmap.','[\"Proven experience managing cross-functional teams.\"]','[\"401k\", \"health insurance\", \"learning budget\"]','[\"Agile\",\"Communication\",\"Analytics\"]','[\"\"]',1,'active'),(6,2,'Business Development Manager','OrbitCart','Sales','Chula Vista, CA','full-time','2025-02-15',4,80000,110000,'Expand market reach and partnerships.','[\"Track record in B2B sales\"]','[\"Bonuses\", \"training\", \"travel allowance\"]','[\"B2B\", \"outbound\", \"relationship management\"]','[\"\"]',1,'active'),(7,3,'Sales Executive','OrbitCart','sales','San Diego, CA','full-time','2025-08-01',3,70000,100000,'Drive revenue by closing deals with clients','[\"Proven sales experience in tech\"]','[\"Commission\", \"company car\", \"flexible hours\"]','[\"CRM tools\", \"negotiation\", \"prospecting\"]','[\"\"]',1,'active'),(11,0,'Software Engineer','TechNova Inc.','Engineering','San Diego, CA','full-time','2025-06-10',2,70000,95000,'Develop scalable software systems.','[\"Bachelor in CS\", \"2+ years experience\"]','[\"Health insurance\", \"401k\", \"stock options\"]','[\"Java, Spring, SQL\"]','[\"\"]',142,'active'),(12,0,'Product Manager','InnovateX','Product Management','Austin, TX','full-time','2025-04-15',3,85000,120000,'Lead cross-functional product teams.','[\"MBA or equivalent experience\"]','[\"Learning budget\", \"flexible hours\"]','[\"Agile, Roadmapping, Leadership\"]','[\"\"]',198,'active'),(13,1,'Research Scientist','BioCore Labs','Research & Development (R&D)','Boston, MA','full-time','2025-05-01',4,90000,130000,'Conduct applied research projects.','[\"PhD in relevant field\"]','[\"Research funding\", \"conference travel\"]','[\"Data analysis, Lab management\"]','[\"\"]',88,'paused'),(14,0,'IT Support Specialist','NetGuard','Information Technology (IT)','Chula Vista, CA','full-time','2025-02-22',1,45000,60000,'Provide IT support and troubleshooting.','[\"Helpdesk experience\"]','[\"Training\", \"team events\"]','[\"Networking, Windows Admin\"]','[\"\"]',64,'active'),(15,0,'Data Scientist','DataWise','Data Science','San Francisco, CA','hybrid','2025-06-28',2,95000,135000,'Analyze large datasets for insights.','[\"Experience in Python/R\"]','[\"Equity\", \"remote flexibility\"]','[\"Machine Learning, SQL\"]','[\"\"]',177,'active'),(16,0,'AI Engineer','DeepVision AI','Artificial Intelligence','New York, NY','full-time','2025-07-01',3,105000,150000,'Build AI-driven applications.','[\"Experience in ML frameworks\"]','[\"Bonuses\", \"health insurance\"]','[\"TensorFlow, PyTorch\"]','[\"\"]',92,'active'),(17,1,'Cloud Architect','SkyNet Cloud','Cloud Services','Seattle, WA','contract','2025-03-05',5,120000,160000,'Design and implement cloud architecture.','[\"AWS/GCP certifications\"]','[\"Contract flexibility\"]','[\"AWS, Kubernetes, Terraform\"]','[\"\"]',55,'active'),(18,0,'Cybersecurity Analyst','SecureIT','Cybersecurity','Dallas, TX','full-time','2025-05-25',2,80000,115000,'Monitor and protect digital infrastructure.','[\"Security+ or CISSP\"]','[\"Company car\", \"insurance\"]','[\"Network Security, SIEM\"]','[\"\"]',76,'active'),(19,0,'Marketing Coordinator','BrandBoost','Marketing','Chicago, IL','internship','2025-07-10',0,20000,30000,'Assist in digital marketing campaigns.','[\"Pursuing Marketing degree\"]','[\"Mentorship\", \"stipend\"]','[\"SEO, Social Media\"]','[\"\"]',166,'active'),(20,1,'Data Engineer','Test Inc.','Engineering','New York, NY','remote','2025-01-18',2,75000,105000,'Build data pipelines and maintain databases.','[\"Strong SQL skills and Python knowledge\"]','[\"Stock options\", \"remote-friendly\", \"career growth\"]','[\"SQL\", \"Python\", \"ETL tools\"]','[\"\"]',94,'active'),(21,0,'Content Writer','StoryLine Media','Content & Media','Los Angeles, CA','freelance','2025-06-30',1,30000,50000,'Write engaging blog posts and scripts.','[\"Strong writing skills\"]','[\"Flexible schedule\"]','[\"SEO Writing, Editing\"]','[\"\"]',120,'active'),(22,0,'Business Development Rep','OrbitCart','Business Development','San Diego, CA','full-time','2025-03-21',2,60000,85000,'Grow new business accounts.','[\"Experience in B2B\"]','[\"Bonuses\", \"training\"]','[\"CRM, Prospecting\"]','[\"\"]',47,'paused'),(23,0,'Innovation Strategist','ThinkAhead','Strategy & Innovation','Denver, CO','full-time','2025-02-10',4,95000,125000,'Design innovation roadmaps.','[\"Background in consulting\"]','[\"Remote work\", \"flex hours\"]','[\"Design Thinking, Analytics\"]','[\"\"]',73,'active'),(24,0,'Animator','FramePlay Studio','Animation','Los Angeles, CA','contract','2025-06-12',2,55000,80000,'Create animations for media.','[\"Animation portfolio\"]','[\"Creative workspace\"]','[\"After Effects, Maya\"]','[\"\"]',89,'active'),(25,0,'Game Designer','NextLevel Games','Game Design','Austin, TX','full-time','2025-04-07',3,70000,105000,'Design game mechanics and systems.','[\"Experience in Unity\"]','[\"Team events\", \"equity\"]','[\"Game Design, Prototyping\"]','[\"\"]',134,'active'),(26,0,'Game Developer','NextLevel Games','Game Development','Austin, TX','full-time','2025-05-30',2,75000,110000,'Develop and optimize game code.','[\"C# and Unity\"]','[\"Health benefits\", \"bonuses\"]','[\"Unity, C#, Git\"]','[\"\"]',122,'active'),(27,0,'VFX Artist','VisionCraft','Visual Effects (VFX)','San Francisco, CA','contract','2025-02-28',3,60000,95000,'Create stunning visual effects.','[\"Demo reel required\"]','[\"Hybrid work\"]','[\"After Effects, Nuke\"]','[\"\"]',63,'closed'),(28,0,'3D Modeler','PolyWorks','3D Modeling','San Diego, CA','freelance','2025-06-01',1,45000,70000,'Create 3D models for projects.','[\"Portfolio required\"]','[\"Flexible schedule\"]','[\"Blender, Maya\"]','[\"\"]',81,'active'),(29,0,'Storyboard Artist','VisionCraft','Storyboarding','Los Angeles, CA','freelance','2025-07-15',1,40000,60000,'Develop storyboards for productions.','[\"Portfolio\"]','[\"Remote work\"]','[\"Sketching, Photoshop\"]','[\"\"]',52,'active'),(30,0,'Sales Associate','QuickSell Inc.','Sales','Chicago, IL','part-time','2025-06-20',0,25000,35000,'Assist in retail sales.','[\"Retail experience\"]','[\"Employee discounts\"]','[\"Customer Service\"]','[\"\"]',186,'active'),(31,1,'Digital Marketing Specialist','Test Inc.','Marketing','Tijuana, BC','hybrid','2025-05-05',2,60000,85000,'Run digital campaigns and SEO optimization.','[\"Experience with Google Ads and SEO tools\"]','[\"Bonuses\", \"team events\", \"hybrid work\"]','[\"SEO\", \"Google Analytics\", \"SEM\"]','[\"\"]',140,'active'),(32,0,'Customer Success Manager','ClientFirst','Customer Success','New York, NY','full-time','2025-03-22',3,70000,100000,'Ensure client satisfaction.','[\"Experience with SaaS\"]','[\"Bonuses\", \"stock options\"]','[\"CRM, Communication\"]','[\"\"]',90,'paused'),(33,0,'Call Center Operator','TalkFast','Call Center Operations','Phoenix, AZ','full-time','2025-07-05',1,32000,45000,'Handle inbound/outbound calls.','[\"Good voice clarity\"]','[\"Shift allowance\"]','[\"Telephony, CRM\"]','[\"\"]',62,'active'),(34,0,'Account Manager','SalesWorks','Account Management','Austin, TX','full-time','2025-04-18',2,65000,90000,'Manage client accounts.','[\"Account management experience\"]','[\"Bonuses\", \"401k\"]','[\"Negotiation, CRM\"]','[\"\"]',84,'active'),(35,1,'Sales Executive','DigitalFlow','Sales','San Francisco, CA','full-time','2025-06-25',3,70000,100000,'Drive revenue by closing deals with clients.','[\"Proven sales experience in tech\"]','[\"Commission\", \"company car\", \"flexible hours\"]','[\"CRM tools\", \"negotiation\", \"prospecting\"]','[\"\"]',112,'active'),(36,0,'HR Specialist','PeopleFirst','Human Resources','Dallas, TX','full-time','2025-01-29',1,50000,70000,'Support HR operations.','[\"Knowledge of HR laws\"]','[\"Learning budget\"]','[\"HRIS, Payroll\"]','[\"\"]',95,'active'),(37,0,'Legal Counsel','LawWorks','Legal','San Francisco, CA','full-time','2025-03-10',5,120000,160000,'Provide legal advice.','[\"JD degree\"]','[\"Stock options\", \"bonuses\"]','[\"Contracts, Compliance\"]','[\"\"]',71,'active'),(38,0,'Administrative Assistant','OfficePro','Administration','San Diego, CA','full-time','2025-05-08',0,35000,50000,'Support office operations.','[\"Organizational skills\"]','[\"Flexible schedule\"]','[\"MS Office\"]','[\"\"]',68,'active'),(39,0,'Operations Manager','LogistiCore','Operations','Seattle, WA','full-time','2025-06-14',4,85000,115000,'Oversee daily operations.','[\"Ops management experience\"]','[\"Bonuses\", \"insurance\"]','[\"Lean, ERP\"]','[\"\"]',104,'active'),(40,0,'Procurement Specialist','SupplyMax','Procurement & Supply Chain','Chicago, IL','full-time','2025-07-02',3,60000,85000,'Handle procurement processes.','[\"Supply chain knowledge\"]','[\"Travel allowance\"]','[\"SAP, Negotiation\"]','[\"\"]',83,'active'),(41,0,'Project Coordinator','BuildIT','Project Management','Denver, CO','full-time','2025-05-19',2,55000,75000,'Coordinate project deliverables.','[\"Project experience\"]','[\"Team events\"]','[\"MS Project, Agile\"]','[\"\"]',97,'active'),(42,0,'Clinical Research Associate','MediCore','Clinical Research','Boston, MA','full-time','2025-06-05',3,80000,110000,'Conduct clinical trials.','[\"Life sciences degree\"]','[\"Conference travel\"]','[\"Clinical trials, Data collection\"]','[\"\"]',79,'active'),(43,0,'Nurse Practitioner','HealthFirst','Medical Services','San Diego, CA','full-time','2025-04-12',4,95000,130000,'Provide patient care.','[\"Nursing license\"]','[\"Health insurance\", \"bonuses\"]','[\"Patient Care, EMR\"]','[\"\"]',88,'active'),(44,0,'Pharmacist','WellCare Pharmacy','Pharmacy','Los Angeles, CA','full-time','2025-05-27',2,100000,140000,'Dispense and counsel on medications.','[\"Pharmacy degree\"]','[\"Insurance\", \"bonuses\"]','[\"Pharma knowledge\"]','[\"\"]',69,'active'),(45,1,'Biotech Engineer','GeneTech','Biotechnology','San Francisco, CA','full-time','2025-07-12',3,110000,150000,'Work on biotech product development.','[\"Biotech degree\"]','[\"Stock options\", \"equity\"]','[\"Biotech, Research\"]','[\"\"]',74,'active'),(46,0,'Environmental Scientist','EcoSolve','Environmental Science','Denver, CO','full-time','2025-03-15',2,70000,100000,'Study environmental impacts.','[\"Environmental science degree\"]','[\"Travel allowance\"]','[\"Research, GIS\"]','[\"\"]',66,'active'),(47,0,'Logistics Coordinator','TransLogix','Logistics','Houston, TX','full-time','2025-05-18',1,45000,60000,'Coordinate shipments.','[\"Logistics experience\"]','[\"Shift allowance\"]','[\"Supply chain, ERP\"]','[\"\"]',72,'active'),(48,0,'Manufacturing Engineer','ProdMax','Manufacturing','Detroit, MI','full-time','2025-06-08',3,70000,95000,'Optimize manufacturing processes.','[\"Manufacturing experience\"]','[\"Bonuses\", \"401k\"]','[\"Lean, CAD\"]','[\"\"]',78,'active'),(49,0,'Teacher','LearnWell Academy','Education & Training','Chicago, IL','full-time','2025-07-09',2,50000,70000,'Teach middle school students.','[\"Teaching certification\"]','[\"Insurance\", \"vacation\"]','[\"Teaching, Classroom management\"]','[\"\"]',119,'active'),(50,0,'Policy Analyst','GovInsights','Government & Public Policy','Washington, DC','full-time','2025-02-14',3,75000,100000,'Analyze public policies.','[\"Political science degree\"]','[\"Government pension\"]','[\"Policy analysis, Research\"]','[\"\"]',87,'active'),(51,0,'Program Coordinator','HelpNow','Non-Profit & Volunteer Programs','Boston, MA','full-time','2025-05-24',1,40000,55000,'Coordinate non-profit programs.','[\"Passion for social impact\"]','[\"Flexible hours\"]','[\"Event planning, Communication\"]','[\"\"]',99,'active'),(52,1,'Game Developer','Test Inc.','Game Developer','Helsinki, Finland','remote','2025-09-24',1,50000,94999,'test1','[\"\"]','[\"\"]','[\"\"]','[\"\"]',0,'active'),(53,1,'Lua Programmer','Test Inc.','Programmer','Tijuana, BC','full-time','2025-09-24',1,5000,10000,'We are looking for a programmer who knows has a knowledge of Lua Programming','[\"\"]','[\"test\"]','[\"\"]','[\"\"]',0,'active');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `referrals` VALUES (1,1,'2025-11-03','under_review','Software Engineer',2000,'Test'), (2,4,'2024-06-10','under_review','Machine Learning Engineer',2000,'Strong academic background and open-source contributions.');
=======
INSERT INTO `referrals` VALUES (1,4,'2024-06-10','under_review','Machine Learning Engineer',2000,'Strong academic background and open-source contributions.'),(2,7,'2024-05-22','interview_scheduled','Security Operations Center (SOC) Analyst',1500,'Great hands-on skills with SIEM tools and network defense.'),(3,8,'2024-07-01','hired','Performance Marketing Specialist',1800,'Extensive experience in digital campaigns and Google Ads.'),(4,1,'2025-11-03','under_review','Software Engineer',2000,'Test');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `rejected_applications` VALUES (1,1,2,3,'Lack of required experience.','2025-06-15',''),(2,2,5,4,'Position filled internally.','2025-07-01','');
=======
INSERT INTO `rejected_applications` VALUES (1,3,1,2,'Titulo equivocado','2025-10-17','Test'),(2,11,3,5,'Titulo equivocado','2025-10-22','');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
<<<<<<< HEAD
INSERT INTO `work_experience` VALUES (1,1,'Senior Frontend Developer','TechFlow Inc.','San Francisco, CA','2022-01-01','2025-07-24','Led frontend development for multiple high-traffic web applications.'),(2,2,'UX Designer','Pixel Studio','Austin, TX','2021-05-01',NULL,'Led end-to-end UX process for mobile applications.'),(3,2,'Junior Designer','CreativeSoft','Austin, TX','2017-02-01','2021-04-30','Supported design team in website revamps and branding.'),(4,3,'Data Engineer','CloudSolve Inc.','Seattle, WA','2021-06-01',NULL,'Built ETL workflows on AWS and integrated Apache Spark.'),(5,3,'Data Analyst','Zenix Solutions','Seattle, WA','2018-07-01','2021-05-30','Performed data cleaning, visualization, and dashboarding.'),(6,4,'NLP Research Scientist','NeuroNet Labs','New York, NY','2020-01-10',NULL,'Conducted research on large language models and published 4 papers in major AI conferences.'),(7,5,'DevOps Engineer','ScaleOps','Denver, CO','2018-06-01',NULL,'Managed CI/CD pipelines and infrastructure as code across multi-cloud environments.');
=======
INSERT INTO `work_experience` VALUES (1,1,'Senior Frontend Developer','TechFlow Inc.','San Francisco, CA','2022-01-01','2025-07-24','Led frontend development for multiple high-traffic web applications.'),(2,2,'UX Designer','Pixel Studio','Austin, TX','2021-05-01',NULL,'Led end-to-end UX process for mobile applications.'),(3,2,'Junior Designer','CreativeSoft','Austin, TX','2017-02-01','2021-04-30','Supported design team in website revamps and branding.'),(4,3,'Data Engineer','CloudSolve Inc.','Seattle, WA','2021-06-01',NULL,'Built ETL workflows on AWS and integrated Apache Spark.'),(5,3,'Data Analyst','Zenix Solutions','Seattle, WA','2018-07-01','2021-05-30','Performed data cleaning, visualization, and dashboarding.'),(6,4,'NLP Research Scientist','NeuroNet Labs','New York, NY','2020-01-10',NULL,'Conducted research on large language models and published 4 papers in major AI conferences.'),(7,5,'DevOps Engineer','ScaleOps','Denver, CO','2018-06-01',NULL,'Managed CI/CD pipelines and infrastructure as code across multi-cloud environments.'),(8,6,'HR Manager','PeopleFirst Co.','Miami, FL','2016-03-15',NULL,'Led recruitment and employee engagement for a team of 200+ employees.'),(9,7,'Cybersecurity Analyst','SecureLayer','Chicago, IL','2019-05-20',NULL,'Monitored network security and performed risk assessments.'),(10,8,'Digital Marketing Strategist','BrightMedia','Los Angeles, CA','2017-09-01',NULL,'Designed and executed SEO and PPC campaigns for multiple clients.'),(11,9,'QA Analyst','QualitySoft LLC','Los Angeles, CA','2021-01-01',NULL,'Performed automated and manual testing on SaaS applications.'),(12,14,'QA Analyst','QualitySoft LLC','Los Angeles, CA','2021-01-01',NULL,'Performed automated and manual testing.'),(13,16,'Design Engineer','AutoTech Motors','Detroit, MI','2019-06-01',NULL,'Led prototyping and testing for new vehicle models.'),(14,17,'Data Scientist','InsightAI','Toronto, Canada','2020-02-01',NULL,'Built predictive models and deployed ML pipelines.'),(15,18,'Nurse Practitioner','Children Health Center','Houston, TX','2016-09-01',NULL,'Provided pediatric care and supervised junior nurses.'),(16,19,'Senior Civil Engineer','GreenBuild Ltd.','Dublin, Ireland','2015-04-01',NULL,'Led infrastructure and green building projects.'),(17,20,'Digital Marketing Specialist','BrightAds Agency','Singapore','2018-08-01',NULL,'Ran digital campaigns, managed SEO/SEM accounts.'),(18,21,'Electrician','Lopez Electricals','Phoenix, AZ','2011-01-01',NULL,'Handled electrical installations and maintenance.'),(19,22,'Lead Fashion Designer','Studio Rossi','Milan, Italy','2016-03-01',NULL,'Designed collections and led creative teams.'),(20,23,'Executive Chef','La Bella Cucina','New York, NY','2012-05-01',NULL,'Created fine dining menus and led kitchen operations.'),(21,24,'Mathematics Teacher','Tokyo High School','Tokyo, Japan','2014-04-01',NULL,'Taught mathematics and prepared students for exams.'),(22,25,'Cybersecurity Analyst','SecureTech','Dubai, UAE','2018-07-01',NULL,'Conducted penetration tests and incident response.');
>>>>>>> 5ba11db2933637ff38f0c03492d02667c05eec87
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
