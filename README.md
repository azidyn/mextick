
# mextick
Simple example of how to parse historical trade data and emit ticks and aggregate trade bin events (i.e. candlestick bars)

This could be the basis needed to build a very accurate backtesting system able to process intrabar price tick events.


### How to use 

First thing you need is some trade data which can be downloaded for free as `.csv.gz` (zipped csv files) found on BitMEX's public cloud archive here:

https://public.bitmex.com/?prefix=data/trade/
**IMPORTANT NOTE THIS WEBSITE ONLY SEEMS TO WORK ON THE Chrome WEB BROWSER**

Download the files and unzip the CSVs into the `trade` folder.


Install the dependency 

```
npm install
```

Import the module:
```js
    const Aggregate = require('./Aggregate');
```

Instantiate the object, passing:

1. the folder containing the csv files you downloaded
2. the bar resolution you want e.g. 1h, 4h, 15m etc (see Aggregate.js for more info)
3. whether you want ticks sent or not

```js
let agg = new Aggregate({ files: './trade', resolution: '1h', sendticks: true });
```

Then subscribe to the events that Aggregate class will fire:


```js
    agg.on('bar', bar => { /* do whatever with your bar */ });

    agg.on('tick', tick => { /* do whatever with your tick */ });
```

Finally, start the system, specifying which symbol you're interested in.
Note that **all** of the BitMEX symbols are supported!:

```js
    agg.start('ETHUSD');
```

### Notes:

The system processes every single file in the `trade` folder in order. 

Suggested improvement exercise: aggregate the trade `size` property to include `volume` with the bar data :)

