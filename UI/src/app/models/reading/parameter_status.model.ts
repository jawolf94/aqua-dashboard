/**
 * ParamaterStatus class represents a status for each paramater in a given reading
 */
export interface ParameterStatus{
    // ID Number of the related reading
    reading_id?: number;

    // Status of parameter. True if in expected range.
    ammonia_ppm: boolean;
    nitrite_ppm: boolean;
    nitrate_ppm: boolean;
    ph: boolean;
    temperature: boolean;
}
