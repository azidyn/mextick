
const CY = "\x1b[36m";
const WH = "\x1b[37m";

const Aggregate = require('./Aggregate');

let agg = new Aggregate({ files: './trade', resolution: '1h' });

// A new bar was closed
agg.on('bar', b => {

    console.log(`${CY}[${b.timestamp.toISOString()}] BAR  | open=${b.open} high=${b.high} low=${b.low} close=${b.close}`);

})

// Price ticked up or down
agg.on('tick', t => {

    console.log(`${WH}[${t.timestamp.toISOString()}] TICK | price=${t.price} side=${t.side} tick=${t.tick}`);
    
})

// Send us ETHUSD data
agg.start('BCHH20');


