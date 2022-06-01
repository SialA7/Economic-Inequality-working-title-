# Data Plan
We identified two datasets that we plan on using to demonstrate the relationship between working poverty and labor rights. In general, we have chosen to limit our inquiry to data on the year 2017, the most recent year for which we have been able to find comprehensive data. 

## Working Poverty Rates

Our first dataset is the **International Labor Organization’s working poverty rate** data. In this dataset, the ILO provides the percentage of the working population that is impoverished in the global south; the ILO uses the World Bank standard of $1.90 a day as the poverty line, with less than $1.90 per day being categorized as “extremely poor,” $1.90 to $3.20 per day moderately poor, and $3.20 to $5.50 a day near poor. This data can be found at https://ilostat.ilo.org/topics/working-poor/# 

We will download the data as an excel file; in Excel we will adjust parameters and export as a csv file. Then, we will geocode the data using JavaScript. By default, the map will display the rate of extreme poverty for each country via a cloropleth map, with countries not included in the dataset blacked out. When users hover over country, a popup box will provide the rates of moderate poverty and near poverty. We may also use this data to create toggles to view only countries with low, medium, and high rates of poverty if possible.

## Labor Rights

Our second dataset is Pennsylvania State University’s **Labor Rights Indicators index**, which can be found at https://www.dept.psu.edu/liberalarts/WorkersRights/about. The scholars on the project identified 108 indicators of labor rights and 9 sources which documented violations of the rights. They created a scoring method wherein each violation yielded points added to the score, culminating in comprehensive data on indicators of labor rights. 

We will download the data as a .csv file and geocode the data using JavaScript. We will use the indicator data to create a labor rights layer documenting the overall index overlaid on top of the working poverty data which can be toggled on/of by a checkbox on the side of the map. The popup box will also contain data on how labor rights indicators weigh differently in law/in practice based on LRI data.  
