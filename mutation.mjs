export function mutateNumber(a, b){
    // calculate the distance between 2 values and create random value within that distance plus margin of 2.
    let d = Math.abs(a.x - b.x);
    let range = {
        min: (a.x > b.x ? b.x : a.x) - d / 2,
        max: (a.x > b.x ? a.x : b.x) + d / 2,
    }
    let x = range.min + Math.random() * (range.max - range.min);
    return x;
}