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



#### B1. Read in COUNTRY-LEVEL DATA
country = read.csv("./country-level.csv", stringsAsFactors = F)

# Drop Row Index column
country <- subset(country, select = -c(X))

# Simplify column names:
names(country) <- c("Location", "Year", 
                    "CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", 
                    "Population", "GDP", "Group1", "Group2", "Group3", "Group4", "Group5", 
                    "Growth_CO2", "Growth_Primary_Energy", "Growth_Pop",
                    "Growth_CO2_per_GDP", "Growth_CO2_per_Capita", "Growth_Energy_per_GDP", "Growth_Energy_per_Capita")

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
                     "CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", 
                     "Growth_CO2", "Growth_Primary_Energy", "Growth_Pop", "Growth_CO2_per_GDP", "Growth_CO2_per_Capita", "Growth_Energy_per_GDP", "Growth_Energy_per_Capita")]


# Re-shape to match example:
country <- gather(country, Metric, Value, CO2:Growth_Energy_per_Capita, factor_key=TRUE)







#### B2. Read in COUNTRY-LEVEL DATA: 90s
country90s = read.csv("./country-level-90s.csv", stringsAsFactors = F)

# Drop Row Index column
country90s <- subset(country90s, select = -c(X))

# Simplify column names:
names(country90s) <- c("Location", "Year", 
                    "CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", 
                    "Population", "GDP", "Group1", "Group2", "Group3", "Group4", "Group5", 
                    "Growth_CO2", "Growth_Primary_Energy", "Growth_Pop", "Growth_CO2_per_GDP", "Growth_CO2_per_Capita", "Growth_Energy_per_GDP", "Growth_Energy_per_Capita")

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
                           "CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", 
                           "Growth_CO2", "Growth_Primary_Energy", "Growth_Pop", "Growth_CO2_per_GDP", "Growth_CO2_per_Capita", "Growth_Energy_per_GDP", "Growth_Energy_per_Capita")]


# Re-shape to match example:
country90s <- gather(country90s, Metric, Value, CO2:Growth_Energy_per_Capita, factor_key=TRUE)


# Add a 90s label to the metrics:
country90s$Metric <- paste0(country90s$Metric, "_90s")





#### B3. MERGE THE TWO DATA SETS  
data <- rbind(x = country90s, 
              y = country)







#### B4. CREATE DATA MANIPULATION VARIABLES AND RE-SHAPE DATA:

# GROUP: Question 3

data$Group1 <- as.character(data$Group1)
data$Group2 <- gsub(1, 2, as.character(data$Group2))
data$Group3 <- gsub(1, 3, as.character(data$Group3))
data$Group4 <- gsub(1, 4, as.character(data$Group4))
data$Group5 <- gsub(1, 5, as.character(data$Group5))

data$Group = paste(data[,8], data[,9], data[,10], data[,11], data[,12])


# PARAMETER: Question 1
CO2_vars = c("CO2", "CO2_per_GDP", "Share_of_Global_CO2", "CO2_per_Capita", "CO2_per_Unit_Energy", "Growth_CO2", "Growth_CO2_per_GDP", "Growth_CO2_per_Capita", 
             "CO2_90s", "CO2_per_GDP_90s", "Share_of_Global_CO2_90s", "CO2_per_Capita_90s", "CO2_per_Unit_Energy_90s", "Growth_CO2_90s", "Growth_CO2_per_GDP_90s", "Growth_CO2_per_Capita_90s")
energy_vars = c("Primary_Energy_Consumption", "Energy_per_Capita", "Energy_per_GDP", "Growth_Primary_Energy", "Growth_Energy_per_GDP", "Growth_Energy_per_Capita",
                "Primary_Energy_Consumption_90s", "Energy_per_Capita_90s", "Energy_per_GDP_90s","Growth_Primary_Energy_90s", "Growth_Energy_per_GDP_90s", "Growth_Energy_per_Capita_90s")

data$Parameter <- ifelse(data$Metric %in% CO2_vars, "CO2",
                         ifelse(data$Metric %in% energy_vars, "Primary_Energy_Consumption", NA))


# TIME FRAME: Question 2
data$Time <- ifelse(grepl("_90s", data$Metric, fixed = TRUE), 1990, 1965)

# ABSOLUTE vs RELATIVE: Question 4 (Manip 1)
data$Manip1 <- ifelse(grepl("Growth", data$Metric, fixed = TRUE), "Growth", "Absolute")

                 
# DENOMINATOR: Question 5 (Manip 2)
data$Manip2 <- ifelse(grepl("per_Capita", data$Metric, fixed = TRUE), "Population",
                      ifelse(grepl("per_GDP", data$Metric, fixed = TRUE), "GDP", "Absolute"))

  

                 
#### B6. CLEAN UP AND WRITE TO CSV
data <- subset(data, select = -c(Group1, Group2, Group3, Group4, Group5, Population, Pop_Quartile, GDP , GDP_Quartile))
data <- data[c("Year", "Year_num", "Location",  "Parameter", "Time", "Group", "Manip1", "Manip2", "Metric", "Value")]

# Remove extra variables that could corrupt graph
data <- subset(data, ! Metric %in% c("Growth_Pop", "Growth_Pop_90s"))
data <- subset(data, ! Metric %in% c("Share_of_Global_CO2_90s", "CO2_per_Unit_Energy_90s", "Share_of_Global_CO2", "CO2_per_Unit_Energy"))

# Write CSV
write.csv(data, "reshaped_country_data.csv", row.names = F)

# For Sanity Checks
test1 <- subset(data, Parameter == "CO2" & Time == 1965 &  Manip1 == "Absolute" & Manip2 == "Absolute")
test2 <- subset(data, Parameter == "CO2" & Time == 1990 &  Manip1 == "Absolute" & Manip2 == "Absolute")



