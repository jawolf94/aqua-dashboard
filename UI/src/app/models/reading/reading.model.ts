/**
 * Reading Class represents a singular tank reading and all measurements.
 */
export class Reading{
    constructor(
        public id?: number,
        public timestamp?: Date,
        public ammonia_ppm?: number,
        public nitrite_ppm?: number,
        public nitrate_ppm?: number,
        public ph?: number,
        public temperature?: number,
        public manual?: boolean
    ){}
}