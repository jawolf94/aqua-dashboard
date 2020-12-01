/**
 * ParamaterStatus class represents a status for each paramater in a given reading
 */
export class ParameterStatus{
    // ID Number of the related reading
    reading_id?: number;

    // Status of parameter. True if in expected range.
    ammonia_ppm?: Boolean;
    nitrite_ppm?: Boolean;
    nitrate_ppm?: Boolean;
    ph?: Boolean;
    temperature?: Boolean;
}