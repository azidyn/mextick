
const EventEmitter = require('./EventEmitter');
const Tick = require('./Tick');

// Add your own resolutions here
const RESOLUTION = {
    '15m':  15 * 1000 * 60,
    '1h': 1 * 1000 * 60 * 60,
    '4h': 4 * 1000 * 60 * 60,
    '1d': 24 * 1000 * 60 * 60,
}

class Aggregate extends EventEmitter {

    constructor( options ) {
        super();
 
        
        // this.sendticks = options.sendticks; // Redundant, just don't subscribe to `tick` even if not needed doh
        this.tick = new Tick({ files: options.files, nozeroes: false });

        this.tick.on('tick', this.newtick.bind(this) );
        this.tick.on('eof', this.lasttick.bind(this) );

        this.label = options.resolution;
        this.resolution = RESOLUTION[ this.label ];

        this.lastopen = -1;

        this.agg = {
            resolution: this.label,
            timestamp: null,
            open: 0,
            high: 0,
            low: 0,
            close: 0,
            volume: 0
        };

        this.clearedunstarted = false;

    }

    start( symbol ) {
        this.tick.start( symbol );
    }

    lasttick( ) {

        this.agg.timestamp = new Date( this.lastopen );
        this.emit( 'bar', this.agg );        

    }

    newtick( tick ) {

        // Get millisecond timestamp of this tick
        let timestamp = tick.timestamp.getTime();
        
        // Using `this.resolution` as a reference, calculate the millisecond open time of the current bar (in the past)
        let openms = timestamp - ( timestamp % this.resolution );
    
        // Hack for first unstarted bar, this will produce invalid data for the first bar
        if ( this.lastopen == -1 ) 
            this.lastopen = openms;
    

        // Trades have been sent out of order (after bar has closed)
        if ( openms < this.lastopen ) {
            console.error('ERROR: price data sent after close!');
        }
    
        // If the open time of the current tick inside a bar of interval `this.resolution` is not equal to previous
        // open time, then this tick starts a new bar
        if ( openms != this.lastopen ) {

            // Emit the previous bar, now it has closed
            this.agg.timestamp = new Date( this.lastopen );

            // Skip the first bar as we cannot guarantee we have the first trade in this bar to calculate an accurate OHL(c)
            // This is *slightly* problematic.
            // You can make an assumption that the first tick of the file you process from BitMEX historical
            // data is indeed the very first (i.e. there is no previous data we've missed). This isn't really 
            // the case in a live situation when consuming a stream. But for this offline use case you can 
            // probably remove this 'unstarted' logic from code and restore the missing bar.
            if ( this.clearedunstarted )
                this.emit( 'bar', this.agg );

            this.clearedunstarted = true;
                    
            // Note that, on TradingView at least, the `open` price is always equal to the previous `close` price
            // I wasn't sure if the open price was the actual price of the first trade in the new bar? That seemed like it might be correct but no.
            // No idea if this is a matter of convention or a 'standard' but if you check on tv this is how they do it hey-ho.
            this.agg.open = this.agg.close;

            this.agg.high = tick.price;
            this.agg.low = tick.price;
            this.agg.close = tick.price;
            this.agg.volume = tick.size;

            this.lastopen = openms;
    
        } else { 
    
            this.agg.high = Math.max( this.agg.high, tick.price );
            this.agg.low = Math.min( this.agg.low, tick.price );
            this.agg.close = tick.price;
            this.agg.volume += tick.size;
    
        }        

        this.emit( 'tick', tick );

    }

}

module.exports = Aggregate;