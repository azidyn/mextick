

/*

    example_volbars.js

        Outputs candlestick bars of a given fixed volume resolution
        
        Instead of splitting the data by time e.g. hourly bars, split by a given volume quantity
        instead e.g. 10 million contract bars 

*/

const CY = "\x1b[36m";
const WH = "\x1b[37m";

const Valuebars = require('./Valuebars');

let valb = new Valuebars({ files: './trade', resolution: 100000 }); // `resolution` is an XBT quantity

// A new volume bar was closed
valb.on('bar', b => {

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


