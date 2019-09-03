import json
from os import listdir

def printComparisonMatrix(logPath, category, length, logFileOrder = -1):

    # get a list of file names with the right prefix

    if (logFileOrder != -1):
        fileList = [[f for f in listdir(logPath) if (f[:len(category)] == category)][logFileOrder]]
    else: 
        fileList = [f for f in listdir(logPath) if (f[:len(category)] == category)]

    # for file in fileList:
    #     print file[len(category)+1:-5]

    result = [[ 0 for i in xrange(length)] for j in xrange(length)]

    for fileName in fileList:
        data = json.loads(open('%s/%s' % (logPath, fileName), 'r').read())

        # for i in xrange(data['practicePair'], len(data['pairs'])):
        for i in xrange(5, len(data['pairs'])):
            image0 = data['pairs'][i][0]
            image1 = data['pairs'][i][1]

            if (image0 == data['selection'][i]): 
                result[image0][image1] += 1
            else:
                result[image1][image0] += 1

    # print the result
    # interpret the result:
    ## '2' at result[r][c] means 2 people think image r is more complex than image c
    for i in xrange(len(result)):
        for j in xrange(len(result[i])):
            print str(result[i][j]) + ',',
        print 

def printRankingOrder (result): 
    lines = result.split('\n')
    for i in xrange(len(lines)):
        if len(lines[i]) > 4 and lines[i][:4] == ' [1]':
            scores_raw = (lines[i][8:] + ' ' + lines[i+1][8:]).split(' ')
            scores = [float(s) for s in scores_raw if s != '']
            # print scores
            sortedScores = sorted(scores)
            # print sortedScores

            for j in xrange(len(scores)): 
                scores[j] = sortedScores.index(scores[j]) + 1

            # print scores

            for score in scores: 
                print score
            
            probability_score = lines[i+4][13:].split(' ')
            print probability_score[0][:-1]
            print probability_score[-1]

'''
# --------- Begin R Code ---------

# load dependencies
library(eba)                  # for the thurstone test

comp_matrix <- matrix(c(0, 6, 4, 6, 3, 2, 0, 1, 1, 2,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
2, 6, 0, 2, 1, 1, 1, 0, 1, 0,
0, 6, 4, 0, 2, 0, 0, 0, 0, 2,
3, 6, 5, 4, 0, 2, 1, 2, 0, 2,
4, 6, 5, 6, 4, 0, 4, 4, 2, 3,
6, 6, 5, 6, 5, 2, 0, 4, 3, 5,
5, 6, 6, 6, 4, 2, 2, 0, 2, 3,
5, 6, 5, 6, 6, 4, 3, 4, 0, 5,
4, 6, 6, 4, 4, 3, 1, 3, 1, 0), ncol=10, nrow=10, byrow=TRUE)

# run the Thurstone scaling function on the comparison matrix
thurstone( comp_matrix)

# --------- End R Code ---------
'''

printComparisonMatrix ('./log', 'clouds', 10)
printRankingOrder("""

Thurstone-Mosteller model (Case V)

Parameter estimates:
 [1]   0.00000  -0.45736  -0.46703   0.09811  -2.11306  -1.90393  -0.96089
 [8]   0.96029   1.13724   1.50748

Goodness of fit (-2 log likelihood ratio):
    G2(36) = 38.75, p = 0.3465
     """)
