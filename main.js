
const Aggregate = require('./Aggregate');

let agg = new Aggregate('./trade', '1d');

agg.on('bar', b => {
    console.log( b );
})

agg.start('XBTUSD');


// const Tick = require('./Tick');


// let tick = new Tick('./trade');


// tick.on('tick', t => {
//     console.log( t );
// })


// tick.start('XBTUSD')
