# Authored by Shing-hon Lau, Adapted by Huayun Huang
# 
# parameters: 
# 		num.in.cell = # of subject we want
# 		model = a 10-vector, indicating the "true" complexity
#		tolerance = a number representing how "close" the simulated result 
# 		num.runs = # of simulations
# returns:
# 		a float that represents the ratio of accepted matrices to total matrices 
#		generated
# algorithm:
#		As described by the comments in the code, this function runs simulations using 
# 		randomly generated matrices, and count the number of matrices that yield a 
# 		thurstone scaling score as expected.

thurstone.power.analysis <- function(num.in.cell, model, tolerance = 0.2, num.runs = 10000){
	
	# to make things easier, first entry of model vector is always 0
	model[1] = 0.0
	
	# to decrease the computation time
	tolerance.squared <- tolerance **2
	

	# required by the thurstone() function
	library(eba)

	# counter for accepted matrices. Initialized to 0.
	power <- 0
	
	# in our experiment, we have 10 images to compare the complexity
	num.items = 10

	# generate <num.runs> preference matrices
	for(i in 1:num.runs){
		
		# init a new 10-by-10 preference matrix, set all the entries to 0
		pref.mat <- matrix(0, nrow = num.items, ncol = num.items)
		
		# for each entry in the matrix
		for(j in 1:num.items){
			for(k in 1:num.items){
				
				# set the diagonal entries to be all 0
				if(j == k){
					pref.mat[j,k] <- 0
				
				# pnorm(model[j] - model[k]) is the likelihood that
				# any given subject will choose image #j over image #k 
				} else if (j < k){
					pref.mat[j,k] <- rbinom(1, num.in.cell, pnorm(model[j] - model[k]))
					
				# if we have pref.mat[k,j] subjects choose k over j, then we have 
				# (<num.in.cell> - pref.mat[k,j]) subjects choose j over k.
				} else {
					pref.mat[j,k] <- num.in.cell - pref.mat[k,j]
				}
			}
		}
		
		# apply the thurstone scaling to the simulated preference matrix, result
		# in a thurstone scaling score 
		thurstone.fit <- thurstone(pref.mat)
		
		# if the distance between each entry of the result vector 
		# "thurstone.fit$estimate" and the entry of our model is less than
		# or equal to the tolerance, then we consider the result to be "close enough" to 
		# our final vector and accept this result. Reject it otherwise. 
		power <- power + ifelse(all((model - thurstone.fit$estimate)**2 <= tolerance.squared),1,0)
		
		#end of one simulation
		
	}
	
	# return (the number of valid matrices / total number of matrices generated)
	return(power/num.runs)

}

thurstone.power.analysis.with.random.uniformly.distributed.model<- function(num.subjects,tol,num.models = 1000, num.matrices = 1000) {
	power <- 0.0
	for (i in 1:num.models) {
		model <- rnorm(10)
		power <- power + thurstone.power.analysis(num.subjects, model, tol, num.matrices)
	}
	return(power/num.models)
}

# with num.subject, how many from file.path would yield a result close enough to model?
# if we have <num.subject> many subjects, how likely that they will yield a result close to the "true" model
thurstone.power.analysis.on.stability <- function(num.subject, file.path, model, tol = 0.2, num.runs = 10, num.image=10) {
	
	file.list <- list.files(path = file.path, pattern = ".*.json", full.names = TRUE)
	num.subject = min(num.subject, length(file.list))
	
	power <- 0
	
	tolerance.squared <- tol ** 2
	
	for (i in 1: num.runs) {
		
		# get a new sample of file names
		samp <- sample(file.list, num.subject)
		
		M <- matrix(0, num.image, num.image)
		
		for (j in 1: num.subject) {
			M = M + get.preference.matrix(samp[j], num.image)
		}
		
		score <- thurstone(M)$estimate
		
		power <- power + ifelse(all((model - score)**2 <= tolerance.squared),1,0)
		
	}
	
	return (power/num.runs)
}

# run tests on different parameters
# # tol <- 0.2
# print(thurstone.power.analysis(80, model, tol))
# print(thurstone.power.analysis(90, model, tol))
# print(thurstone.power.analysis(100, model, tol))
# print(thurstone.power.analysis(110, model, tol))
# print(thurstone.power.analysis(120, model, tol))