/**
 * Reading Class represents a singular tank reading and all measurements.
 */
export class Reading{
    constructor(
        public timestamp?: Date,
        public ammonia_ppm?: Number,
        public nitrite_ppm?: Number,
        public nitrate_ppm?: Number,
        public ph?: Number,
        public temperature?: Number,
        public manual?: boolean
    ){}
}