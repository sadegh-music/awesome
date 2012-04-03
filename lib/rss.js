var db  = require('./db'),
    rss = require('rss');

var generate = exports.generate = function(){
  return '<?xml version="1.0" encoding="UTF-8"?>\
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title><![CDATA[title]]></title><description><![CDATA[description]]></description><link>http://example.com</link><generator>NodeJS RSS Module</generator><lastBuildDate>Tue, 03 Apr 2012 07:37:16 GMT</lastBuildDate><atom:link href="http://example.com/rss.xml" rel="self" type="application/rss+xml"/><item><title><![CDATA[item title]]></title><description><![CDATA[use this for the content. It can include html.]]></description><link>http://example.com/article4?this&amp;that</link><guid isPermaLink="false">1123</guid><dc:creator><![CDATA[Guest Author]]></dc:creator><pubDate>Sat, 26 May 2012 19:30:00 GMT</pubDate></item></channel></rss>';
}
