
const EventEmitter = require('./EventEmitter');
const Tick = require('./Tick');


class Volbars extends EventEmitter {

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
            volume: 0
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

        let total = this.agg.volume + tick.size;

        // If we're about to overflow into a new volume bar
        if ( total > this.resolution ) {

            // Get the remainder, chop off the extra overflowing quantity 
            let nextstart = total - this.resolution;

            // Volume is obviously going to be constant
            this.agg.volume = total - nextstart;

            if ( this.clearedunstarted )
                this.emit( 'bar', this.agg );

            this.clearedunstarted = true;
                    
            // For the timestamp, which is now variable, just use the tick timestamp of the first trade in this new volume bar
            this.agg.timestamp = tick.timestamp;
            this.agg.open = this.agg.close;
            this.agg.high = tick.price;
            this.agg.low = tick.price;
            this.agg.close = tick.price;
            this.agg.volume = nextstart; // Initialize next volume bar with overflow from previous bar
    
        } else { 
    
            this.agg.high = Math.max( this.agg.high, tick.price );
            this.agg.low = Math.min( this.agg.low, tick.price );
            this.agg.close = tick.price;
            this.agg.volume += tick.size;
    
        }        

        this.emit( 'tick', tick );

    }

}

module.exports = Volbars;