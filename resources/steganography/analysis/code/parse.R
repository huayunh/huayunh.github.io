# Author: Huayun Huang
# This file contains functions helpful to parse the .json log files
# we get directly from the server.

# load dependencies
library(jsonlite)             # for parsing the json
library(reshape2)         # for the pivot table
library(eba)                  # for the thurstone test

# return a list of all the subjects in the folder designated by <file.path>
print.all.subjects <- function(file.path, print.file.name = FALSE, category = "") {
	
	file.list <- list.files(path = file.path, pattern = ".*.json",full.names = TRUE, recursive = TRUE)
	num.subject <- length(file.list)
	
	for (i in 1:num.subject) {
		parsed_json = fromJSON(file.list[i])
		
		print.me = FALSE
		
		if (category != "") {
			if (parsed_json$category == category) {
				print.me = TRUE
			}
		} else {
			print.me = TRUE
		}
		
		if (print.me) {
			if (print.file.name) {
				print (file.list[i])
			}
			print (parsed_json$MTurkID)
		}
		
	}
	
}

# get the preference matrix we need to pass into the thurstone
# scaling algorithm
# parameter: 
# 		file.path: a string, represents the path to the log file
# 			(should have a file extension .json)
#		num.image: number of images 
# return:
# 		pref.matrix, a <num.image> -by- <num.image> matrix
get.preference.matrix <- function(file.path, num.image=10) {
	# load json data with the <file.path>
	parsed_json = fromJSON(file.path)
	
	# load the pairs of images and the selected image 
	# from the pair into a dataframe
	df_json = as.data.frame( cbind( parsed_json$pairs, parsed_json$selection ) )
	colnames( df_json ) = c( "im1", "im2", "selection" )
	
	# print (file.path)
	# print (parsed_json$MTurkID)
	
	# generate a new zero matrix to store the final result
	pref.matrix <- matrix(0, num.image, num.image)
	
	# practice pairs are the comparisons we'd like to skip
	practice.pairs <- parsed_json$practicePair
	
	# number of total comparisons this given subject did
	# should equal to <practice.pairs> + factorial(<num.image>)
	num.comparison <- length(df_json[,1])
	
	# iterate through all the comparisons
	for (j in (practice.pairs+1):num.comparison) {
		
		# images being compared
		img1 <- df_json[j, 1] + 1
		img2 <- df_json[j, 2] + 1
		
		# if img1 is chosen
		if (img1 == df_json[j, 3] + 1) {
			temp <- pref.matrix[img1, img2]
			pref.matrix[img1, img2] = temp + 1
		}
		# img2 is chosen
		else {
			temp <- pref.matrix[img2, img1]
			pref.matrix[img2, img1] = temp + 1
		}
		
	}
	
	return (pref.matrix)
}

# given path to the folder, return accumulated preference matrix
get.overall.preference.matrix <- function(file.path, num.image=10) {
	# get a list of log files
	file.list <- list.files(path = file.path, pattern = ".*.json")
	num.subject <- length(file.list)
	
	pref.matrix <- matrix(0, num.image, num.image)
	
	for (i in 1:num.subject) {
		
		pref.matrix <- pref.matrix + get.preference.matrix(paste(file.path, file.list[i], sep ="/"), num.image)
		
	}
	
	return(pref.matrix)	
}

# given a path to the folder holding a bunch of log files
# return a score matrix, with each column representing a subject
# row 1 of the score matrix is the log file name
# row 2-11 is the score for each image
# This function is used to estimate the preference of one single subject
# and see a general trends across different subjects
get.score.matrix <- function(file.path) {
	# get a list of log files
	file.list <- list.files(path = file.path, pattern = ".*.json")
	num.subject <- length(file.list)
	
	# 10 images per category
	num.image <- 10
	
	# create a new zero matrix to store the scoring of each subject, 
	# with the top row storing log file name, second row to store MTurk ID
	score.matrix <- matrix(0, num.image + 2, length(file.list))
	
	# iterate through each subject
	for (i in 1:num.subject) {
		
		# get the subject's preference matrix
		pref.matrix <- get.preference.matrix(
							paste(file.path, file.list[i], sep ="/"),
							num.image
							)
			
		# run the Thurstone scaling function 
		# on the preference matrix
		score <- thurstone( pref.matrix) $ estimate
		
		MTurkID <- fromJSON(paste(file.path, file.list[i], sep ="/")) $ MTurkID
		
		# update the column i with subject i's data
		score.matrix[,i][1] = substring(
								file.list[i], 
								first=0,
								last=nchar(file.list[i])-5
								)
								
		score.matrix[,i][2] = MTurkID
		score.matrix[,i][3:(num.image + 2)] = score
		
	}	
	return(score.matrix)
}

# given a path to a folder
# return the thurstone comparison based on the preference
# from all the subjects in that folder
get.overall.score.vector <- function(file.path) {
	
	num.image <- 10
	pref.matrix <- 	get.overall.preference.matrix(file.path, num.image)
	return(thurstone(pref.matrix))
	
}

# write.table(get.score.matrix('./log/MTurkAbstract'), file="./log/abstract.csv", sep=",")
