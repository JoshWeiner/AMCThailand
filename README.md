# AMCThailand - Thomas Lee, Claire Liu, JiaJie Mai, Joshua Weiner

### Description of data set(s).

Link to data set: https://docs.google.com/spreadsheets/u/1/d/133Eb4qQmOxNvtesw2hdVns073R68EZx4SfCnP4IGQf8/htmlview?sle=true&exportFormat=csv

Ah yes, the 2016 election. We aim to look at and analyze the reuslts of the election using this tab-separated sheet. What will be looking at, you might be asking? Well, we can view vote breakdowns by state, party, and even the shifts in votes over the years.

We aim to show, for example, normalized stacked bar charts which would demonstrate how votes for "other" might have cost candidates the victory in certain states, or how voter turnout in each state changed from 2012. And, we also aim on using cartograms to show this breakdown by state. This might help us gain a little more insight into 'what went wrong' and how we can better understand the trends of the election.

### Explanation, in broad strokes if necessary, of how you aim to make this data come alive.

We plan to the data using a normalized stacked bar chart, as demonstrated here: 
https://observablehq.com/@d3/stacked-normalized-horizontal-bar
And we plan on showing more data broken down by state using a cartogram, as shown here:
https://vida.io/documents/s5qo5Gwrct5HNxAD2

This way of demonstrating data is primarily visual. Often, charts and graphs while visible essentially just simplify numbers, but on our cartogram will allow users to see percentages by state for all three votes: Democrat, Republican, and other. Our normalized stacked bar chart will show how the race to 50% of the vote in each state will have been determined by a decrease in voter turnour or votes for 'other'.

Out user interaction will focus primarily on comparisons, they can look at different series of data (swing states vs non-swing states, 2016 turnout vs 2012 turnout) to compare how this election was different than the last. Hopefully, this can foster a new understanding of how attidues across American have changed.

This will allow users to see where voter turnout is an issue, it will provoke questions as to why people voted for other if they really believed that there were two bad options in 2016. And furthermore, it will provoke the question as to why people who didn't like anyone running even voted at all.

### Explanation of D3 feature utilization.

Since we are creating a normalized bar chart, we will be showing percentage of the vote for all three options for each state. The benefit of using the normalized bar chart in this instance is that it allows us to show all states within the same parameters of the graph, vote counts going from 0-100% instead of in the millions. This allows users to much more clearly identify what percentage of the vote each candidate recieved without having to do the math themselves. In fact, we plan on puttin a 50% line in the middle of the chart to show the threshold needed to win the state and how each candidate did or did not do that.

Our cartogram will allow for a separate visualization. We can show the margins by which each candidate won the state with a color-gradient visualization or the presense of bars on each state (as per the example). Users will be able to show comparisons with 2012 margins, changes in voter numbers, and view the importance of just swing states on this map. It allows us to get a much broader geographic view and we can essentially match the state data from our sheet with the id number of each state on the map to achieve this.

As the default, our data visualization will display the vote turnouts for each state and the normalized bar chart to see votes for Democrat, Republican, and 'other'. However, we will implement a user interactive feature where the user can explicitly decide which data sets they want to view: such as 2016 turnout compared to 2012 turnout, or the vote breakdown in swing states specifically. We will also allow the users to change the year in which we look at vote margins (as this is the only 2012 data besides general turnout this sheet has).

### Sketch/Mock-up of envisioned visualization
![alt text](https://raw.githubusercontent.com/JoshWeiner/AMCThailand/master/mockup.png)

## LAUNCH CODES

1. Activate your virtual environment 
```
$ python3 -m venv venv
$ . venv/bin/activate
```

2. Clone our repo 
```
$ git clone git@github.com:JoshWeiner/AMCThailand.git
```

3. Switch to our directory 
```
$ cd AMCThailand
```

4. Install the required packages 
```
$ pip install -r requirements.txt
```

5. Run app.py 
```
$ python app.py
```

6. Open your web browser and go to http://127.0.0.1:5000/

7. Explore our app!
