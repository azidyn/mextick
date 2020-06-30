
const EventEmitter = require('./EventEmitter');
const Tick = require('./Tick');


class Valuebars extends EventEmitter {

    constructor( options ) {
        super();
 
        this.tick = new Tick({ files: options.files, nozeroes: false });

        this.tick.on('tick', this.newtick.bind(this) );
        this.tick.on('eof', this.lasttick.bind(this) );

        this.resolution = options.resolution;

        this.agg = {
            resolution: options.resolution,
            timestamp: null,
            open: 0,
            high: 0,
            low: 0,
            close: 0,
            value: 0
        };

        this.clearedunstarted = false;

    }

    start( symbol ) {
        this.tick.start( symbol );
    }

    lasttick( ) {

        this.emit( 'bar', this.agg );        

    }

    newtick( tick ) {

        // e.g. 10,000 contracts at $5000.00 = 2.0 XBT
        const value = tick.size / tick.price;

        let total = this.agg.value + value;

        // If we're about to overflow into a new value bar
        if ( total > this.resolution ) {

            // Get the remainder, chop off the extra overflowing quantity 
            let nextstart = total - this.resolution;

            // Value is obviously going to be constant
            this.agg.value = total - nextstart;

            if ( this.clearedunstarted )
                this.emit( 'bar', this.agg );

            this.clearedunstarted = true;
                    
            // For the timestamp, which is now variable, just use the tick timestamp of the first trade in this new value bar
            this.agg.timestamp = tick.timestamp;
            this.agg.open = this.agg.close;
            this.agg.high = tick.price;
            this.agg.low = tick.price;
            this.agg.close = tick.price;
            this.agg.value = nextstart;         // Initialize next value bar with overflow from previous bar
    
        } else { 
    
            this.agg.high = Math.max( this.agg.high, tick.price );
            this.agg.low = Math.min( this.agg.low, tick.price );
            this.agg.close = tick.price;
            this.agg.value += value;
    
        }        

        this.emit( 'tick', tick );

    }

}

module.exports = Valuebars;