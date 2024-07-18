/**
 * 
 * @param {Number} A 
 * @param {Number} B 
 * @param {Number} t 
 * @returns {Number}
 */

function liniarInterpol(A, B, t){
    return A + (B - A)* t;
}

/**
 * @typedef {{x: Number, y:Number}} Point 
 * @typedef {{x: Number, y: Number, offset: Number}} OffsetedPoint
 * @param {Point} A 
 * @param {Point} B 
 * @param {Point} C 
 * @param {Point} D 
 * @returns {OffsetedPoint | null}
 * function for returning the coordinates of the intersecting point of 2 segments
 */
function getIntersection(A, B, C, D){
    let uUpper = (A.x-B.x)*(C.y-A.y) - (C.x-A.x)*(A.y-B.y);
    let tUpper = (D.x-C.x)*(A.y-C.y) - (D.y-C.y)*(A.x-C.x);
    let lower = (D.y-C.y)*(B.x-A.x) - (D.x-C.x)*(B.y-A.y);


    if(lower != 0){
        const uRatio = uUpper / lower;
        const tRatio = tUpper / lower;

        if(tRatio >= 0 && tRatio <= 1 && uRatio >= 0 && uRatio <= 1){
            return {
                x: liniarInterpol(A.x, B.x, tRatio),
                y: liniarInterpol(A.y, B.y, tRatio),
                offset: tRatio
            }
        }
    }
    
    return null;
    
}

/**
 * @typedef {{x: Number, y:Number}} Point
 * @param {Point[]} polygon1 
 * @param {Point[]} polygon2 
 * @returns {Boolean}
 */
function polygonsIntersection(polygon1, polygon2){
    for(let i = 0; i < polygon1.length; ++i){
        for(let j = 0; j < polygon2.length; ++j){
            const collision = getIntersection(
                    polygon1[i], 
                    polygon1[(i+1) % polygon1.length],
                    polygon2[j],
                    polygon2[(j+1) % polygon2.length]
            );

            if(collision)
                return true;
        }
    }
    return false;
}


/**
 * 
 * @param {Number} value 
 * @returns {RGBA Value}
 */
function rgbaFromValue(value){
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return  "rgba("+R+", "+G+", "+B+", "+alpha+")";
}