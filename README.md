# final-project-starter-code

Any new implementation of JS Typewriter Effect: https://codepen.io/daviddcarr/pen/XVyQMM

Datasets:
(1) global-level.csv
Source 1: https://climate.nasa.gov/vital-signs/
Source 2: https://ourworldindata.org/energy-mix

Duration: 1965-2019
Countries: Global

Info:
"Primary Energy Consumption (TWh):"
Calculated based on the 'substitution method' which takes account of the inefficiencies
in fossil fuel production by converting non-fossil energy into the energy inputs required if they had the same conversion losses as fossil fuels.

Variables:
"co2_avg": average C02 concentration
"temp": global average temperature {relative}
"fossil fuels (TWh)": global energy consumption from fossil fuels (Oil + Coal + Gas)
"renewables (TWh)": global energy consumption form renewable energy (Wind + Hydropower + Nuclear + Traditional Biomass + Biofuels + Solar + Other Renewables)
"ALL Fuels": fossil fuels + renewable

(2) country-level.csv
Source: https://github.com/owid/co2-data {Our world in Data}

Duration: 1965-2016
Countries: ['Australia', 'Austria', 'Belgium', 'Brazil', 'Bulgaria', 'Canada',
       'Chile', "China (People's Republic of)", 'Colombia', 'Cyprus',
       'Czech Republic', 'Denmark', 'Finland', 'France',
       'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia',
       'Ireland', 'Italy', 'Japan', 'Korea',
       'Luxembourg',  'Mexico', 'Netherlands',
       'New Zealand', 'Norway', 'OECD - Total', 'Poland', 'Portugal',
       'Romania', 'Saudi Arabia', 'Slovak Republic', 'South Africa',
       'Spain', 'Sweden', 'Switzerland', 'Turkey', 'United Kingdom',
       'United States']

Information:
--We recalculate carbon emissions to CO2. The primary data sources on CO2 emissions—the Global Carbon Project, for example—typically report emissions in tonnes of carbon. We have recalculated these figures as tonnes of CO2 using a conversion factor of 3.664.
--We calculate per capita figures. All of our per capita figures are calculated from our metric Population, which is included in the complete dataset. These population figures are sourced from Gapminder and the UN World Population Prospects (UNWPP).

Variables:
'co2': country tonnes of carbon produced
'co2_per_gdp': country tonnes of carbon produced / gdp
'share_global_co2': country tonnes of carbon produces / global tonnes of carbon
'co2_per_capita': tonnes of carbon / population
'co2_per_unit_energy': tonnes of carbon / primary_energy_consumption
'primary_energy_consumption': primary_energy_consumption ALL source (TWh)
'energy_per_capita':primary_energy_consumption / population
'energy_per_gdp': primary_energy_consumption / gdp
'population': annual country Population
'gdp': country's GDP

(3) country-all_ghg.csv
Source: https://stats.oecd.org/Index.aspx?DataSetCode=AIR_GHG

Duration: 1990-2018
Countries: ['Australia', 'Austria', 'Belgium', 'Brazil', 'Bulgaria', 'Canada',
       'Chile', "China (People's Republic of)", 'Colombia', 'Cyprus',
       'Czech Republic', 'Denmark', 'Finland', 'France',
       'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia',
       'Ireland', 'Italy', 'Japan', 'Korea',
       'Luxembourg',  'Mexico', 'Netherlands',
       'New Zealand', 'Norway', 'OECD - Total', 'Poland', 'Portugal',
       'Romania', 'Saudi Arabia', 'Slovak Republic', 'South Africa',
       'Spain', 'Sweden', 'Switzerland', 'Turkey', 'United Kingdom',
       'United States']

Variables:
'GHG': ALL greenhouse gas emissions in Tonnes of CO2_equivalent 
