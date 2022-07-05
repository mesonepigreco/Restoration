export function norm(vector2) {
    return Math.sqrt(vector2.x* vector2.x + vector2.y*vector2.y);
}

export function random_poisson(mean) {
    var L = Math.exp(-mean);
    var p = 1.0;
    var k = 0;

    do {
        k++;
        p *= Math.random();
    } while (p > L);

    return k - 1;
}