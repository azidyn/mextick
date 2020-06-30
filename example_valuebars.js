
/*

    example_valuebars.js

        Outputs candlestick bars of a given fixed 'value' resolution by quantity of the underlying asset 
        in the case of XBTUSD, it would be the amount of XBT rather than USD contracts as per the 'volume' bars
        
*/

const CY = "\x1b[36m";
const WH = "\x1b[37m";

const fs = require('fs');
const Valuebars = require('./Valuebars');

let valb = new Valuebars({ files: './trade', resolution: 500000 }); // `resolution` is an XBT quantity

let bars = [];

// A new volume bar was closed
valb.on('bar', b => {

    bars.push( b );

    // Write the value bars to disk
    fs.writeFileSync('./xbt-value-bars-2020-50k.json', JSON.stringify( bars ));

    console.log(`${CY}[${b.timestamp.toISOString()}] BAR  | open=${b.open} high=${b.high} low=${b.low} close=${b.close} value=${b.value} XBT`);

})

// Price ticked up or down
valb.on('tick', t => {

    // Skip ZeroMinusTick and ZeroPlusTick trades
    // if ( !t.tick.includes('Zero') )
    //     console.log(`${WH}[${t.timestamp.toISOString()}] TICK | price=${t.price} side=${t.side} tick=${t.tick}`);
    
})

// Send us XBTUSD data
valb.start('XBTUSD');


