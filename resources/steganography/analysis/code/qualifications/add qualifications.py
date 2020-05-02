""" 

the following code would include everyone from the given batch csv file <fromBatch> 
into the UPDATE_<qualification> of <toWorkers>

"""

import csv

# from category batch file
fromBatch = '../log/survey response/Batch_3814573_batch_results.csv'

# to my workers list file
toWorkers = '../log/survey response/User_1448191_workers.csv'

# qualification name
qualification = 'Has Completed OfficeSupply'


# to store MTurk ID from <fromBatch>
subjects = set()

# to store the updated CSV list
newFilesGenerated = []

# read from given <fromBatch>
with open(fromBatch, 'r') as csvfile:
	readCSV = csv.reader(csvfile, delimiter=',')

	hasReadHeader = False

	for row in readCSV:
		if not hasReadHeader:
			workerIdColumn = row.index('WorkerId')
			hasReadHeader = True
		else:
			subjects.add(row[workerIdColumn])

# read the existing worker file <toWorkers>
with open(toWorkers, 'r') as csvfile:
	readCSV = csv.reader(csvfile, delimiter=',')
	hasReadHeader = False

	for row in readCSV:
		if not hasReadHeader:
			workerIdColumn = row.index('Worker ID')
			updateColumn = row.index('UPDATE-%s' % (qualification))
			if (updateColumn == -1):
				raise Exception('no such qualification name as \"%s\"' % (qualification))
			hasReadHeader = True
		else:
			if (row[workerIdColumn] in subjects):
				row[updateColumn] = '1'
		newFilesGenerated += [row]

# update <toWorkers>
with open(toWorkers, 'wb') as csvfile:
	writeCSV = csv.writer(csvfile)
	writeCSV.writerows(newFilesGenerated)

print "Update success."
