# Folder structure for ./analysis folder

In this folder, you will find everything derived from the raw data. All the raw data, either downloaded from Amazon Mechanical Turk website, or copied from our server, is located in the `./log` folder instead. 

```
└── /analysis
    |── README.md                                  // this file
    |── /code                                      // stores source code
        |── parse.R                                // parse data, generate matrices, etc
        |── /power analysis
            |── How the algorithm works.md         // how thurstone_power_analysis.R works
            └── thurstone_power_analysis.R         // code to power analysis
        └── /qualifications                        // codes to blacklist subjects
            |── add qualifications by list.py      // add qualification to subjects from a list
            |── add qualifications.py              // add qualification to subjects from a csv file 
            └── blacklist.py                       // blacklisted
    └── /results                                   // stores the data analysis results
        |── /Individual Scores By Category         // TS score based on data from individual subjects
            |── ...
        |── /numbers files                         // .number files we used to analyze survey response
            |── ...                                // all files have been exported to csv
        |── /Survey Response By Category           // exported from /numbers files
            |── ...
        |── Batch Details.csv                      // details for each batch
        |── Demographics by Category.csv           // demographic stats based on mturk survey responses
        |── Log File Stats by Category.csv         // log file stats & power analysis info
        |── reasonsWhySubjectsChooseOnePicOverAnother.csv
        |── Steganography Image Score.csv          // overall TS score for the 100 images
        |── Categorical Score.csv                  // TS scores by categories, before shifting
        |── rankings of every category.pdf         // TS score for each category, with images, before shifted by meta category
```