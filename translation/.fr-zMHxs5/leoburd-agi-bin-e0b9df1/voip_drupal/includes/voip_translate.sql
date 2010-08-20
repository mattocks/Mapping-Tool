-- phpMyAdmin SQL Dump
-- version 2.6.3-pl1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Sep 07, 2006 at 02:43 PM
-- Server version: 4.1.20
-- PHP Version: 4.3.9
-- 
-- Database: `voip_translation`
-- 

-- --------------------------------------------------------

-- 
-- Table structure for table `voip_phrases`
-- 

CREATE TABLE `voip_phrases` (
  `pid` int(10) unsigned NOT NULL auto_increment,
  `language` varchar(5) NOT NULL default '',
  `phrase` varchar(255) NOT NULL default '',
  `placeholders` varchar(255) default NULL,
  `phrase_hash` varchar(32) NOT NULL default '',
  `english_sentence_hash` varchar(32) NOT NULL default '',
  PRIMARY KEY  (`pid`),
  KEY `phrase_hash` (`phrase_hash`),
  KEY `english_sentence_hash` (`english_sentence_hash`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- Table structure for table `voip_voices`
-- 

CREATE TABLE `voip_voices` (
  `vid` int(10) unsigned NOT NULL auto_increment,
  `language` varchar(5) NOT NULL default '',
  `file_basename` varchar(255) NOT NULL default '',
  `available` int(2) NOT NULL default '0',
  PRIMARY KEY  (`vid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
