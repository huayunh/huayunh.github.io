# Documentation for the steganography project

## Premise

In this documentation, I would guide you through the file structure, setting up the server, and interpretting the log files. I would assume you have *some* technical background — that is, you know how to run command line interface, and are familiar with basic computer terminologies, etc.

## Download the package

Since you are reading this documentation, I assume that you acquired the software package from us, and has just unzipped everything. Decompress it into a directory called, say, `steganography`, and take a look. You should receive the following files:

- server.js
- README.md
- public\
  - images\
    - abstract\
      - 1.jpg
      - 2.jpg
      - 3.jpg
      - ...
      - 10.jpg
    - bokeh\
      - ...
    - bricks\
      - ...
    - ...
  - compare.html
  - favicon.png
  - loading.svg
  - x.css
  - x.js

At the top level we have three items: `server.js `, `README.md`, and `public/`. 

`server.js` is the code to your server. It is written using Node.js (and the express.js framework). We need to set up the server here, because unlike a static webpage where nothing will get transmitted besides the webpage itself, here we need to store subjects' log data somewhere. And we need to store it in our server, with some server-side code to handle it.

`README.md` is this instruction page you are reading right now. 

`public/` is a directory where all the client-side assets & webpages are stored. Our server is configured to only serve files from the `public` directory, meaning that the subjects will never be able to access the `server.js`, `README.md`, or the log files generated in this process.

Inside the `public/` directory, you would see a directory called `images/`. This is where all the categories of images are stored. The images are grouped into their respective categories and are named as "1.jpg", "2.jpg", …, "10.jpg". There are 10 categories in total.

The other files inside the`public/` directory are files to render the webpage properly.

## Set up the whole thing

As mentioned in the previous section, we need to set up the server to make everything functional. This is broken down into two steps: 

1. make the server run locally (a playable version on your own computer)
2. Have the server run on the internet (can be accessed from other machines).

### Run it locally...

Go to [nodejs.org](nodejs.org) and install the latest Node.js onto your machine.

Once you are done, open your command line / terminal and navigate to your `steganography` directory:

```shell
$ cd steganography
```

We now need to install `express.js`, a node.js library, onto your machine. Go to [expressjs.com](https://expressjs.com/en/starter/installing.html) and follow the instruction.

Now while you are inside the `steganography` directory, start the server: 

```shell
$ node server.js
```

Your server is running! Try visiting [http://0.0.0.0:8080/compare.html](http://0.0.0.0:8080/compare.html) and see the magic yourself. If your machine complains about how Node.js is trying to break through your firewall, allow the access.

### Serve it on the internet...

Now leave the server running in your command line window as it is. This step configures your router by forwarding the port to your local machine. We are using a Verizon router (model MI424WR) in our experiment; depending on your router manufacturer, you might need to do it slightly differently.

**Login to your router.** You should be able to find your router's local ip address via your own computer's network settings. In our case, it's `192.168.1.1`.

**Go to the port forwarding / application configuration page.** Again, the actual wording might be different.

**Apply new rule to your configuration**. Forward the network traffic to your desired machine & port. In my case, I forward it to my own MacBook, `FUBAR` (with a local IP address `192.168.1.5`). 

"Application to forward" select `HTTP`.Then click "advanced >>" button. 

"Forward to port" -> Specify. Enter `8080`, because that's the port our server is listening to. 

**Then save / activate the configuration.** If you still have the Node.js server running, you should now be able to visit the website at `http://{your ip address}/compare.html` where `{your ip address}` is your broadband IP address (visit [whatismyipaddress.com](whatismyipaddress.com), for example, to find out your broadband IP address). 

## URL parameters

You can control parameters of the web app by altering the URL given to the Turkers. ([How to change parameters?](https://www.bigleap.com/blog/what-are-url-parameters/]))

- `sequential=1` makes the order of the image to be sequential and fixed. The images will be presented in the order `[[0,1],[0,2],[0,3], ...,[0,9],[1,2],[1,3],...,[8,9]]`. By default, the order of images are randomized.
- `orderMatters=1` is saying that the orders of the image pair matters, and both should be present to the subject. That is, both "1.jpg on the left, 2.jpg on the right" and "2.jpg on the left, 1.jpg on the right" will be present. When `orderMatters=1` is present, there would be no practice and `practice` parameter is ignored. By default, orderMatters is turned off and only `[0,1]` or `[1,0]` will be used (but not both).
- `category` specifies which category is used. As for now there are 3 categories in total: `['bricks','bokeh','abstract']`. Setting `category=1`, for example, will give us pictures from the `bokeh` category. By default, the script will choose an arbitrary category first, and serve all the images from that category.
- `debug=1` will enable the debug mode, which will superimpose a label of the image (like, having "1" on top of "1.jpg", "9" on "9.jpg"). When the user finishes the whole session, a window will be prompt to download their log file locally (in addition to the log file being stored on the server.)
- `practice` specify the number of practices we want. When `orderMatters` is not set, we would have 10 * 9 / 2 = 45 pairs of images to compare. However, because (1) the Turker might be unfamiliar with the form experiment and need time to adjust and (2) we need to verify whether the Turker is really doing what they are told to do or is just gaming the system, we would want to have a few practice comparisons at the beginning of the 45 pairs. By default, we would have 5 practice comparisons, meaning that we would have 5 + 45 = 50 comparisons in total. The 5 pracitice comparisons are randomly chosen from the 45 comparisons but with order swapped, meaning that if we have `[…,[4,1], …, [2,4], …, [7,8], …, [8,5], …, [2,1], …]` in the 45 comparisons, then we might have `[5,8], [4,2], [1,4], [1,2], [8,7]` as the 5 practice comparisons, prepended to the front of the 45 comparisons. To turn the practice off, simply set `practice=0`.

## A walkthrough from the subject's perspective

Note the whole thing does not render properly on IE/Edge due to JavaScript incompatibility. We've tested the whole thing on Safari & Chrome & Firefox though. 

An Amazon Mechanical Turk worker ("Turker") sees the task and clicks into it. Inside the task page, the Turker sees a link to our application, and is instructed to first complete the study the link points to, and then complete a survey. The subject clicks into the link and is taken to our web app page.

Inside the web app, the Turker would be first presented with some instructions, which contains qualifications of the study, description to the task, compensation information, etc., pretty much like a consent form. At the bottom of that page, the subject will be presented a text input field to enter their Mechanical Turk Worker ID. The Turker enters their ID, and is taken to the next page. (If the Turker ID is not alphanumeric, the page would not proceed)

(Insert some screenshots of the subject comparing their stuff here)

(Perhaps a video would explain this better)

After the Turker is finished with all the 50 comparisons, the Turker is told to go back to the survey page at Amazon Mechanical Turk Worker site.

## Log file

After a subject finishes their thing, you would see a new directory, called `log/`, is created in the directory where your application sits (in our case, the `steganography` directory). Inside, you would see a new log file is generated, following the naming scheme `category-UNIXTimeStamp.json`. Here, the `category` represents the category that the subject goes through, and the `UNIXTimeStamp` represents, in millisecond, the UNIX timestamp when the server receives the data.

Our data is stored as JSON files. Inside the JSON file, there are a few fields: 

* `startTime` denotes when the subject lands on the first page. The time is recorded in UNIX timestamp, in millisecond. This time is not influenced by the Turker's time zone, however if the time on their computer is inaccurate, the time obtained here can be inaccurate, too. 
* `pairs` is a list of image pairs. For example, `[0, 8]` indicates that the for that particular comparison, "1.jpg" was on the left, and "9.jpg" was on the right. Note that the whole thing is zero-indexed.
* `selection` is a list of selection that the subject made. Note that this is also zero-indexed. 
* `reactionTime` records how long it takes (in milliseconds) a subject from seeing both images to click on the "next" button in the web page.
* `category` is the category name of this set of images. 
* `userAgent` records down subjects' browser & OS info.
* `MTurkID` is the Amazon Mechanical Turk ID reported by the subject at the beginning of the study session.

## License

Everything you see in the package is all right reserved and is credit to Huayun Huang (the programmer) and Roy Maxion (the photographer).

The csafe logo is copyrighted by Center for Statistics and Applications in Forensic Evidence. 