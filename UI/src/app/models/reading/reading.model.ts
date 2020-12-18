/**
 * Reading Class represents a singular tank reading and all measurements.
 */
export interface Reading{
    id?: number;
    timestamp?: Date;
    ammonia_ppm?: number;
    nitrite_ppm?: number;
    nitrate_ppm?: number;
    ph?: number;
    temperature?: number;
    manual?: boolean;
}
