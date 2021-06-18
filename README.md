<h1 align="center"> <strong>MetaWeather SPA </strong> </h1>

# Quick Start

Just clone the repository, **run**:

> $ npm install

Run the command **on both** "root" **and** "metaweather-example-app" **folders** to download both
React and Express dependencies, then just run:

> $ npm start

on the root folder.
<br><br><br>

# Progress Tracking Alternative

I apologize for not doing exactly as asked, but I genuinely forgot about reading that requirement.<br><br>

I'm gonna try breaking down the steps as best as I can:

## Step 1

After creating an app through the CLI, I set up the search-bar and started fiddling with some GET requests.<br>
The first problem that arose was the CORS one, ofcourse, to which I found various solutions:<br>

1. Using a browser plugin that changes its configuration so that any site you visit can make requests to any server.
2. Using the server hosting the website, or in this case a local express server to make the requests through node, which has no restrictions for CORS like browsers do.
3. Free hosting websites like Netlify have their own ways of achieving this (i.e. serveless functions)
4. I completely avoided using public CORS-anywhere domains to do the trick as they were all restricted in some way.

For your convenience and future deployability there is already an express server connected to my React app to do the fetching.

## Step 2

The second step I took after I got the search bar working made me side-step a lot.<br>
I immediately wanted an accurate suggestion bar to help me with typing, and since I had 2 days, I could spend at least 1 in trying to make that work.<br>
This led me to querying the APIs database on every keystroke, but then I read that the API was not to be queried more than once per minute, which I took as a "Please don't spam it, the bandwith is limited" sign. I tried e-mailing Jason to inform about all the requests I'm gonna make only to find out the e-mail provided doesn't work. <br>
I spent Wednesday trying to create an index of all city names the API supports through javascript scripts running on node. I ran requests for every english letter and after removing all duplicates and stripping down the lists to just the city names I got a very usable file of only 4KB.

## Step 3

On Thursday I finished all core functionality early, and then started fine-tuning it until I was satisfied. Here's a small list of all small additions: <br>

1. If a search query returns back 1 result, it will immediately fetch the city weather for you. Results are shown only when 2 or more cities come up.
2. Very basic error handlers, one for getting an error back from the API, and one for getting 0 results on your search.
3. Added 2 kinds of loaders on the page, one when using the searchbar and one for when the user clicks on a search result.
4. Added animated transitions to all component mounts/dismounts.
5. Made sure it's responsive for mobiles.
   <br><br><br><br>

## Answers to obvious questions:

**Q**. Why didn't you module this more?<br>
**A**. I thought one js file would be ok, but then got excited and filled it up. Function and variable names are pretty self-explanatory though so it's not that hard working with 1 file that big.

**Q**. Why didn't you use more open-source libraries like moment.js, react-select, tailwindCSS etc to achieve the same and/or better results?<br>
**A**. I understand the appeal of these libraries, but whenever I'm given an opportunity to learn how to do it myself and save some KBs off the final page load I can't resist.
