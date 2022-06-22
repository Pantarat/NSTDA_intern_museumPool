-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2022 at 04:32 AM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recommend`
--

-- --------------------------------------------------------

--
-- Table structure for table `object_keyword_relation`
--

CREATE TABLE `object_keyword_relation` (
  `id` int(11) NOT NULL,
  `object_id` int(11) NOT NULL,
  `keyword_id` int(11) NOT NULL,
  `score` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `object_keyword_relation`
--
ALTER TABLE `object_keyword_relation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_thistable_with_object` (`object_id`),
  ADD KEY `fk_thistable_with_keyword` (`keyword_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `object_keyword_relation`
--
ALTER TABLE `object_keyword_relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `object_keyword_relation`
--
ALTER TABLE `object_keyword_relation`
  ADD CONSTRAINT `fk_thistable_with_keyword` FOREIGN KEY (`keyword_id`) REFERENCES `keyword` (`id`),
  ADD CONSTRAINT `fk_thistable_with_object` FOREIGN KEY (`object_id`) REFERENCES `object` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
