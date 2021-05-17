# PROGRAM NAME: 6.859 - Final Project
# DESCRIPTION: Identify "failles"
# PROGRAMMER(S): Axelle Clochard
# DATE WRITTEN: 5/05/2021





# STEP 0. SET UP WORKSPACE AND LOAD DATA
# ---------------------------------------------------------------------------------------------------#
# ---------------------------------------------------------------------------------------------------#


# A. SET WORKSPACE PARAMS
# ------------------------#
rm(list = ls()) 

# Set working directory to where file is
# script.dir <- dirname(rstudioapi::getActiveDocumentContext()$path)
# setwd(script.dir)
setwd('C:/Users/axell/OneDrive/Documents/MIT/6.859/A4/final-project-call-of-data/data/output')


# install packages if necessary
packages <- c("ggplot2",
              "plyr",
              "scales",
              "dplyr",
              'stringr',
              "tidyr",
              "purrr",
              "gridExtra",
              "grid",
              "xlsx", 
              "reshape2", 
              "stargazer", 
              "Hmisc", 
              "readxl",
              "httr",
              "Hmisc",
              "ipumsr",
              "R.utils",
              "maps",
              "rgdal",
              "ggtext",
              "data.table",
              "icd.data")

install_list <- packages[!(packages %in% installed.packages()[,"Package"])]
if(length(install_list)) install.packages(install_list)

lapply(packages, require, character.only = TRUE)



# # B. READ IN DATA
# # ------------------------#
# 
# #### B1. Read in GLOBAL DATA
# global = read.csv("./global_data.csv", stringsAsFactors = F)
# 
# # Simplify column names:
# names(global) <- gsub("..TWh.|..Twh.", "_TWh", names(global))  
# names(global) <- c("X", "Year", "Population", "CO2_Avg", "Temperature", "Fossil_Fuels_TWh", "Renewables_TWh", "All_Fuels" )
# 
# # Convert Year to a Data
# global$Year <- as.Date(ISOdate(global$Year, 1, 1)) 
# 
# # Add a Location and GDP Identifier
# global$Location <- "World"
# global$GDP <- NA
# 
# # Drop Row Index column
# global <- subset(global, select = -c(X))
# 
# 
# # Re-Organize
# global <- global[c("Year", "Location", "Population", "GDP","CO2_Avg", "Temperature", "Fossil_Fuels_TWh", "Renewables_TWh", "All_Fuels")]
# 
# # Re-shape to match example:
# global <- gather(global, Metric, Value, CO2_Avg:All_Fuels, factor_key=TRUE)
# 
# # Write to CSV
# write.csv(global, "reshaped_global_data.csv", row.names = F)




#### B2. Read in COUNTRY-LEVEL DATA
country = read.csv("./country-level.csv", stringsAsFactors = F)

# Drop Row Index column
country <- subset(country, select = -c(X))

# Simplify column names:
names(country) <- c("Location", "Year", 
                    "CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", 
                    "Population", "GDP", "Group1", "Group2", "Group3", "Group4", "Group5", 
                    "Growth_CO2", "Growth_Primary_Energy", "Growth_Pop")

# Convert Year to a Data
country$Year_num <- country$Year 
country$Year <- as.Date(ISOdate(country$Year, 1, 1)) 


# Country Grouping Variables
country_2016 <- subset(country, Year_num == 2016) %>%
                mutate(GDP_Quartile = ntile(GDP, 4)) %>%
                mutate(Pop_Quartile = ntile(Population, 4))

country <- merge(x = country,
                 y = subset(country, Year_num == 2016) %>%
                     mutate(GDP_Quartile = ntile(GDP, 4),
                            Pop_Quartile = ntile(Population, 4))%>%
                     subset(., select = c(Location, GDP_Quartile, Pop_Quartile)),
                 
                 by = "Location")



# Re-Organize
country <- country[c("Year", "Year_num", "Location", "Population", "Pop_Quartile","GDP", "GDP_Quartile", "Group1", "Group2", "Group3", "Group4", "Group5", 
                     "CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", "Growth_CO2", "Growth_Primary_Energy", "Growth_Pop")]


# Re-shape to match example:
country <- gather(country, Metric, Value, CO2:Growth_Pop, factor_key=TRUE)



#### B3. Read in COUNTRY-LEVEL DATA: 90s
country90s = read.csv("./country-level-90s.csv", stringsAsFactors = F)

# Drop Row Index column
country90s <- subset(country90s, select = -c(X))

# Simplify column names:
names(country90s) <- c("Location", "Year", 
                    "CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", 
                    "Population", "GDP", "Group1", "Group2", "Group3", "Group4", "Group5", 
                    "Growth_CO2", "Growth_Primary_Energy", "Growth_Pop")

# Convert Year to a Data
country90s$Year_num <- country90s$Year 
country90s$Year <- as.Date(ISOdate(country90s$Year, 1, 1)) 


# Country Grouping Variables
country_2016 <- subset(country90s, Year_num == 2016) %>%
  mutate(GDP_Quartile = ntile(GDP, 4)) %>%
  mutate(Pop_Quartile = ntile(Population, 4))

country90s <- merge(x = country90s,
                    y = subset(country90s, Year_num == 2016) %>%
                        mutate(GDP_Quartile = ntile(GDP, 4),
                              Pop_Quartile = ntile(Population, 4))%>%
                        subset(., select = c(Location, GDP_Quartile, Pop_Quartile)),
                 by = "Location")



# Re-Organize
country90s <- country90s[c("Year", "Year_num", "Location", "Population", "Pop_Quartile","GDP", "GDP_Quartile", "Group1", "Group2", "Group3", "Group4", "Group5", 
                     "CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", "Growth_CO2", "Growth_Primary_Energy", "Growth_Pop")]


# Re-shape to match example:
country90s <- gather(country90s, Metric, Value, CO2:Growth_Pop, factor_key=TRUE)


# Add a 90s label to the metrics:
country90s$Metric <- paste0(country90s$Metric, "_90s")




#### B3. MERGE THE TWO DATA SETS AND WRITE TO CSV
data <- rbind(x = country90s, 
              y = country)


write.csv(data, "reshaped_country_data.csv", row.names = F)

