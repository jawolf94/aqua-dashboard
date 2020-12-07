/** 
 * Represents all paramaters and their corresponding labels.
*/
export interface ParamLabels{
    ammonia_ppm?:Label
    nitrite_ppm?:Label 
    nitrate_ppm?:Label
    ph?:Label 
    temperature?:Label
    timestamp?:Label
    pct_change?:Label
    filter_change?:Label
}

/**
 * Represents icons, units, labels, and display type for a param.
 */
export interface Label{
    label?:string
    unit?:string
    icon?:string
    type?:string
}