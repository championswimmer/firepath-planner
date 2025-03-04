
### Initial Prompt 

Make a website that helps do personal financial planning for FIRE (financially independent retire early). 

First take these inputs from the user. 

- current savings (cash & cash equivalent) 
  - rate of growth of savings (% APR)
- current investments (equity, ETFs) 
  - expected rate of growth of investments (annually)
- current annual income 
  - expected Y-o-Y growth of income 
  - current % of spend 
  - current % of savings 
  - current % of investment 
  - sum of above 3 must be 100 (can use sliders for these) 

- expected rate of inflation 

- historical data 
  - first year from when user started earning
  - annual earnings of the user that year 
  - allow user to enter earnings from each year from that to now 

Now we will calculate future earnings and savings. 

1. first, assume savings and investments to be 0 and start from the year entered as first year of earning. extrapolate values from 0 to current savings & investments.
2. if annual earnings for intermediate years are given use that, or else extrapolate values between first year and current year linearly. 

Chart the following (use a library like chartjs or d3js)

1. earnings of past and 20 years of future (after 20 years, income will become  0 per year) 
2. savings of past + 40 years of future (every year savings % of income is added, plus existing savings grow at the rate mentioned)
3. investments of past + 40 years of future (every year investment % of income is added, plus existing investment grow at the rate mentioned)


### Update 1 

incorporate savings to be reduced by spending as well (spending comes from % given by user) 
if spending > savings of the year, then it will be reduced from investment


### Update 2 

value of investment is 0 for the years in past. it should not be 0 

value of investment should be 0 in the first year of income, and then it should linearly grow to the current value this year
