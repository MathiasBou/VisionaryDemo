
--
-- Tabellenstruktur für Tabelle `demo_events`
--

CREATE TABLE IF NOT EXISTS `demo_events` (
`id` int(11) NOT NULL,
  `session` varchar(32) NOT NULL,
  `event_dttm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `event_type` varchar(32) NOT NULL,
  `user_ip` varchar(32) NOT NULL,
  `user_lon` varchar(32) NOT NULL,
  `user_lat` varchar(32) NOT NULL,
  `user_system` varchar(1024) NOT NULL,
  `user_scenario` text NOT NULL,
  `detail1` varchar(1024) NOT NULL,
  `detail2` varchar(1024) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;
