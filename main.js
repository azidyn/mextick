
const Aggregate = require('./Aggregate');

let agg = new Aggregate('./trade', '1h');

agg.on('bar', b => {

    console.log( b );
    
})

agg.start('XBTUSD');
