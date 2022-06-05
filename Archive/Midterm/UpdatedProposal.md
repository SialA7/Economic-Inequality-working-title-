# Economic-Inequality
We are Laborinth! We are interested in exploring the relationship between working poverty and labor issues; our goal is to combine web-mapping and case studies as a way to explore these connections on both global and individual levels.

## Team members
### *Edryna Ahmed*
<img width="150" alt="edryna" src="https://user-images.githubusercontent.com/102548069/166313201-bfe017b9-f539-40ed-888f-8ac38a683fd5.png">
Edryna Ahmed is a fourth-year at the University of California, Los Angeles studying Economics with a minor in Digital Humanities. She is a big foodie who is always trying to make the most out of every day.

### *Jack Witherspoon*
<img width="150" alt="jack" src="https://user-images.githubusercontent.com/102548069/166313285-1670e669-3f05-4e26-91eb-db6a7ff2a15e.png">
Jack Witherspoon is a fourth-year at the University of California, Los Angeles studying Economics with a minor in Accounting. He is a driven and ambitious individual, determined to make the most out of his education and future professional endeavors in the financial services industry. In his free time, he enjoys cooking, reading and trying new foods.

### *Annika Sial*
<img width="150" alt="annika" src="https://user-images.githubusercontent.com/102548069/166313144-06c4e1a3-a75c-45c4-b9f2-4f70ae074d91.png">
Annika Sial is a fourth-year student studying English and minoring in conservation biology. She is generally passionate about protecting the public interest but particularly interested in promoting human rights, animal rights, and environmental justice.


## Overview
We aim to tell the story of working poverty on a global scale. Our final map will display the relationships between working poverty and labor rights to demonstrate how rights in the workplace can also affect working poverty rates. The working poverty rate shows the number of people who are employed but still under the poverty line: according to the [International Labor Organization](https://ilo.org/wcmsp5/groups/public/---dgreports/---stat/documents/publication/wcms_696387.pdf) , more than 20% of employed persons lived in poverty in 2018. While the percentage of working poor in the global population has been steadily declining since 2000, the decline has slowed in the last decade, and it is important to bring renewed interest to this topic. We plan to complete case studies on countries with the highest and lowest rates of working poverty to showcase more in-depth stories and details about labor rights, but we are initially looking to display information labor rights and working poverty on our map. Our final map will display labor rights information by default in a chloropleth map and include toggles for different levels of working poverty so viewers can see the correlation between working poverty and labor rights. Viewers will also be able to click into select countries to read relevant case studies.

## Methodology
For this project, web mapping will articulate a special visualization of different areas of the world that have different levels of poverty. Within a globalization context, working poverty by country can help us understand the different correlations each country's poverty level has to supply chains, private property rights or labor rights. To capture the scale of poverty, the map will not only educate others about these correlations but have a clearer view of how poverty is connected to economic inequality.

## Workflow
* Week 3
    * Finalizing which datasets to use
    * Brainstorm research questions we want to explore
* Week 4
    * Analyze the data set and see what variables we want to use
    * Finalize research questions
    * Work on UX Design report
* Week 5
    * Begin mapping data
    * Begin coding website
* Week 6
    * Select countries we want to further research and highlight
* Week 7
    * Finish the basic map
    * Adding more interactive elements to the map
* Week 8 - 10
    * Finishing Touches
* Finals Week
    * Finished
    
## Technical Scope
* Git:
    * Git will be used to create our group repository and store the code for our website and analysis
* Leaflet:
    * Leaflet will be used to create our map visualization and showcase the geographic components of our research
* HTML:
    * HTML will serve as the backbone language of our website
* Javascript:
    * Javascript will help to create the interactive components of our website
* CSS:
    * CSS will be the coding language we use to stylize our website

## Geographic Scope 
The scope of our project looks to explore global data to best compare different labor standards between countries.

## UX Design
Our goal with the UX design was to create a simple, easy to navigate website that spotlights our data and case studies. The website has an interactive navigation bar with three tabs, one for the Map, one page about us and the project, and one page about our data sources. For the map, we will use the labor rights indicators data as a chloropleth map and the working poverty data, which each level in a different layer, as circlemarkers. In addition to adding case studies, which will be indicated by stars on the map for select countries that the user can click on to navigate to a case study, we will also incorporate a search bar that allows viewers to navigate to a particular country.
![wireframe2](https://user-images.githubusercontent.com/102548069/166314035-cebb8694-d234-4510-b88e-dcbc4dc74a7c.PNG)
![wireframe3](https://user-images.githubusercontent.com/102548069/166314039-ef953088-baab-4b14-bf09-69db0d01264e.PNG)

We chose a color palette with a focus on dark colors with a few light accents to draw attention to our data. 
![DH151ColorPalette](https://user-images.githubusercontent.com/102548069/166314652-f2de8ac2-25c5-4782-87f1-5e70b9d4f759.png)

## Data
We identified two datasets that we used to demonstrate the relationship between working poverty and labor rights.

The first is the [International Labor Organization’s working poverty rate data](https://ilostat.ilo.org/topics/working-poor/#). In this dataset, the ILO provides the percentage of the working population that is impoverished in the global south; the ILO uses the World Bank standard of $1.90 a day as the poverty line, with less than $1.90 per day being categorized as “extremely poor,” $1.90 to $3.20 per day moderately poor, and $3.20 to $5.50 a day near poor.

The second dataset is [Pennsylvania State University’s Labor Rights Indicators index](https://www.dept.psu.edu/liberalarts/WorkersRights/about). The scholars on the project identified 108 indicators of labor rights and 9 sources which documented violations of the rights. They created a scoring method wherein each violation yielded points added to the score, culminating in comprehensive data on indicators of labor rights.
Methodology

In order to use these datasets on our map, we downloaded, cleaned, and consolidated the datasets. This involved removing non-essential variables and non-numerical values, geocoding the data, and combining our two datasets based on common location values. This yielded one csv file with geocoded labor rights and working poverty (including extremely poor, moderately poor, and near poor) data. We then parsed the data in our csv file in java to map the data. 
