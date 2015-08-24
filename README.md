This program scraped about 800,000 reviews from yelp. It is an expansion of another project, [sentimentAnalysis](https://github.com/emoreno619/sentimentAnalysis) For further explanation, see my blog https://medium.com/@emoreno619

Documentation of procedure that produced data set:

1) searched on Yelp for 'food' in each city (on 8/4/15)
2) collected yelp urls of first 1000 locations (total of >11k) that resulted
   for each city
3) cities are 10 largest US cities by population + San Francisco (including
   in no particular order: NYC, LA, Chicago, San Jose, Houston, Dallas, San
   Diego, San Antonio, Philadelphia, Phoenix)
4) Note: my getUrls() scraping algorithm isn't the most efficient,
   and in fact contains much repetition and includes sponsored results.
   So, the data produced by that algorithm was tidied in postgres, by
   removing duplicates and designated sponsored, advertisement results
