-- MySQL dump 10.13  Distrib 8.0.11, for Win64 (x86_64)
--
-- Host: localhost    Database: chat_db
-- ------------------------------------------------------
-- Server version	8.0.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access`
--

DROP TABLE IF EXISTS `access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `access` (
  `user_id` int(11) NOT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `ts` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access`
--

LOCK TABLES `access` WRITE;
/*!40000 ALTER TABLE `access` DISABLE KEYS */;
INSERT INTO `access` VALUES (1,'qSS4B3HVx9iA6QkGOnGKQe+VQfvhBGgMai2686VeodI=','2018-05-23 16:23:38'),(3,'KlBblgBsUSn5IEwzD+2AzddNcUCbXkaoq1rkLjoZNhk=','2018-05-23 15:40:35'),(4,'yaakBMkK0FiFmGgRMEGTn1wAg3FDampn3Nf9P9Zyqtg=','2018-05-23 11:44:12');
/*!40000 ALTER TABLE `access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (1,'TestCsss'),(2,'AllChat'),(3,'User1122'),(4,'New epic acht!'),(5,'sfsdf'),(6,'nene'),(7,'Проба пера');
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `body` text,
  `ts` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,1,'test msg1!','2018-05-22 15:40:51'),(2,1,1,'another msg1!!','2018-05-22 15:41:21'),(3,1,1,'it works!','2018-05-22 15:41:27'),(4,1,1,'Еее, первое сообщение!','2018-05-23 11:33:49'),(5,1,1,'Еще одно сообщение!!!','2018-05-23 11:37:52'),(6,1,1,'ыыыымяу','2018-05-23 11:39:38'),(7,2,1,'Кто здесь?','2018-05-23 11:40:18'),(8,2,1,'Прием!','2018-05-23 11:41:59'),(9,2,1,'Ась?','2018-05-23 11:43:33'),(10,2,1,'Есть хто?','2018-05-23 11:43:36'),(11,2,3,'Я тут!','2018-05-23 12:02:24'),(12,2,1,'Да ладно?','2018-05-23 12:02:33'),(13,1,1,'sss&','2018-05-23 12:19:38'),(14,1,1,'sfsdf','2018-05-23 12:19:41'),(15,2,3,'vzddd','2018-05-23 12:19:53'),(16,2,3,'fgdfg','2018-05-23 12:19:58'),(17,2,3,'sdf','2018-05-23 12:19:59'),(18,2,3,'er32','2018-05-23 12:20:01'),(19,2,1,'srfsdf3','2018-05-23 12:20:04'),(20,2,1,'fsdf','2018-05-23 12:20:14'),(21,2,3,'dfgdfg','2018-05-23 12:22:00'),(22,2,1,'dsf','2018-05-23 12:22:45'),(23,2,3,'vffd','2018-05-23 12:23:33'),(24,2,3,'ttt','2018-05-23 12:23:35'),(25,2,3,'sdnfjcsd','2018-05-23 12:23:37'),(26,2,1,'Фигня какая-то','2018-05-23 12:23:45'),(27,2,3,'Скууучно','2018-05-23 12:23:50'),(28,2,3,'fgdf','2018-05-23 12:24:51'),(29,1,3,'dfgfd','2018-05-23 12:25:14'),(30,1,3,'njf','2018-05-23 12:26:05'),(31,1,3,'sjdknfsd','2018-05-23 12:26:06'),(32,1,3,'njfgs','2018-05-23 12:26:07'),(33,2,3,'wrrwegf','2018-05-23 12:26:10'),(34,2,3,'sdgere','2018-05-23 12:26:11'),(35,2,3,'sdgdf','2018-05-23 12:26:12'),(36,2,1,'вот как-то все не мяу(','2018-05-23 12:27:38'),(37,2,1,'sndjkvnsdjkv','2018-05-23 12:37:56'),(38,2,1,'sndvjksnd','2018-05-23 12:37:57'),(39,2,1,'sdjkvbsjkd','2018-05-23 12:37:58'),(40,2,1,'snjkdvbskjd','2018-05-23 12:37:59'),(41,2,1,'snbfhvbier','2018-05-23 12:37:59'),(42,1,1,'ergerg','2018-05-23 12:38:04'),(43,1,1,'ergv','2018-05-23 12:38:05'),(44,2,1,'sfdgsdf','2018-05-23 12:40:15'),(45,2,1,'dfgds','2018-05-23 12:40:16'),(46,2,1,'fdghrethre','2018-05-23 12:40:23'),(47,2,1,'sdfsd','2018-05-23 12:42:05'),(48,2,1,'sfdg','2018-05-23 12:42:06'),(49,2,1,'fgefd','2018-05-23 12:42:40'),(50,2,1,'df','2018-05-23 12:42:43'),(51,2,1,'jjfkvfd','2018-05-23 12:43:22'),(52,2,1,'dfkvakj','2018-05-23 12:43:23'),(53,2,1,'ajnfdjkv','2018-05-23 12:43:23'),(54,1,1,'fdg','2018-05-23 12:43:33'),(55,1,1,'egfers','2018-05-23 12:44:16'),(56,1,1,'sdfgdsf','2018-05-23 12:44:36'),(57,1,1,'dsh','2018-05-23 12:44:38'),(58,2,1,'sfdsf','2018-05-23 12:48:10'),(59,2,1,'wefwef','2018-05-23 12:48:11'),(60,1,1,'dfsg','2018-05-23 12:48:15'),(61,1,1,'wrwetw','2018-05-23 12:48:16'),(62,2,3,'gbfgb','2018-05-23 12:48:32'),(63,1,3,'fdg','2018-05-23 12:48:35'),(64,4,1,'dfgdfg','2018-05-23 15:31:28'),(65,4,1,'sdfsdf','2018-05-23 15:31:30'),(66,6,3,'dfjgjkdfgjkfd','2018-05-23 15:40:38'),(67,6,3,'DDdssss','2018-05-23 15:40:41'),(68,6,3,'Уберчат!)','2018-05-23 15:40:49');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_to_chat`
--

DROP TABLE IF EXISTS `user_to_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_to_chat` (
  `user_id` int(11) DEFAULT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `unread` int(11) DEFAULT '0',
  UNIQUE KEY `UNIQ` (`user_id`,`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_to_chat`
--

LOCK TABLES `user_to_chat` WRITE;
/*!40000 ALTER TABLE `user_to_chat` DISABLE KEYS */;
INSERT INTO `user_to_chat` VALUES (1,1,0),(2,1,5),(2,2,3),(3,2,0),(3,1,0),(1,3,0),(1,4,0),(1,5,0),(4,1,0),(4,3,0),(1,6,0),(4,6,3),(3,6,0),(3,7,0),(1,7,0);
/*!40000 ALTER TABLE `user_to_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(255) DEFAULT NULL,
  `avatar` varchar(45) DEFAULT NULL,
  `socket_id` varchar(45) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `passwd` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'NikZ',NULL,'6Au1Zawv6AjThg90AAAJ','nikz','a029d0df84eb5549c641e04a9ef389e5'),(2,'AnyUser',NULL,NULL,'test','testpass'),(3,'user11',NULL,'1pFlbPDKV2elIC73AAAC','user','098f6bcd4621d373cade4e832627b4f6'),(4,'NikZ-BotClone',NULL,NULL,'niktest','b5997cee0d1ef3e5f3f6dc7a8b3ad7d7');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-23 16:33:56
