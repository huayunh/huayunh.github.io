""" 

the following code would include everyone from the given batch csv file <fromBatch> 
into the UPDATE_<qualification> of <toWorkers>

"""

import csv

# to my workers list file
toWorkers = '../log/survey response/User_1448191_workers.csv'

# qualification name
qualification = 'has completed meta'

subjects = set([

"A1NF6PELRKACS9",
"A2CKYCHQGXUI10",
"A2UTHXLZL8TNBK",
"A2WNW8A4MOR7T7",
"A26RPQDD0RQEHL",
"A1RWNYJA5X25YH",
"A9EVF0SO2IUJ0",
"A3QMAS3KVQTPW0",
"A70L26UXLTGLC",
"AHV4U78TUUDKI",
"A2341KCW7BI2NS",
"A2WTDVHVVORNDU",
"A14NP6X071S7GK",
"A1IHI23KH87K5W",
"AVWU9JDY5G81E",
"A218S9QMWS15U",
"A37M4OVE9R80G",
"A2LV5432PV1S39",
"A2R0YYUAWNT7UD",
"A22KRF782ELLB0",
"A2SKH7WZUEDGGI",
"AHEJHFN0VV6E3",
"A3QZMGTVA4VO44",
"A2APPZDU0VS9LN",
"AKX5RHHO8BIUX",
"A1MIR0TP081SKT",
"A2F0X4LN9N4O4C",
"A2J6MMNWUJQUXS",
"A16FY9L7QTDNRW",
"A2M6ON3DU45IEO",
"A2HNP1YL1IBFMU",
"A14NP6X071S7GK",
"A16FY9L7QTDNRW",
"A1IHI23KH87K5W",
"A1MIR0TP081SKT",
"A1NF6PELRKACS9",
"A1RWNYJA5X25YH",
"A218S9QMWS15U",
"A22KRF782ELLB0",
"A2341KCW7BI2NS",
"A26RPQDD0RQEHL",
"A2APPZDU0VS9LN",
"A2F0X4LN9N4O4C",
"A2HNP1YL1IBFMU",
"A2J6MMNWUJQUXS",
"A2LV5432PV1S39",
"A2M6ON3DU45IEO",
"A2R0YYUAWNT7UD",
"A2SKH7WZUEDGGI",
"A2UTHXLZL8TNBK",
"A2WNW8A4MOR7T7",
"A2WTDVHVVORNDU",
"A37M4OVE9R80G",
"A3QMAS3KVQTPW0",
"A3QZMGTVA4VO44",
"A70L26UXLTGLC",
"A9EVF0SO2IUJ0",
"AHEJHFN0VV6E3",
"AHV4U78TUUDKI",
"AKX5RHHO8BIUX",
"AVWU9JDY5G81E"
])

# to store the updated CSV list
newFilesGenerated = []

# read the existing worker file <toWorkers>
with open(toWorkers, 'r') as csvfile:
	readCSV = csv.reader(csvfile, delimiter=',')
	hasReadHeader = False

	counter = 0
	for row in readCSV:
		if not hasReadHeader:
			try:
				workerIdColumn = row.index('WorkerId')
			except ValueError:
				workerIdColumn = row.index('Worker ID')
			updateColumn = row.index('UPDATE-%s' % (qualification))
			hasReadHeader = True
		else:
			if (row[workerIdColumn] in subjects):
				row[updateColumn] = '1'
				subjects.remove(row[workerIdColumn])
				counter += 1
		newFilesGenerated += [row]

# update <toWorkers>
with open(toWorkers, 'wb') as csvfile:
	writeCSV = csv.writer(csvfile)
	writeCSV.writerows(newFilesGenerated)

print "Successfully assigned qualification type to %d subject(s)." % counter

if (subjects):
	print "the following subject(s) is on your list but not found in your csv file:"
	print subjects
