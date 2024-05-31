uniform vec2 resolution;
uniform float time;
varying vec2 vUv;


uint rng_state;

float random(int n)
{
    n = (n << 13) ^ n; 
    n = (n * (n*n*15731+789221) + 1376312589) & 0x7fffffff;
    return float(n) * (1.0 / 2147483647.0);
}

float squares(vec2 posLocal, float scaleDust, float amount, int seed){
    float width = random(seed) * scaleDust;
    float height = random(seed + 123) * scaleDust;
    float appear = step(random(seed + 456), amount);
    float opacity = random(seed + 890);

    width *= appear;
    height *= appear;

    bool squares = abs(posLocal.x) <= width && abs(posLocal.y) <= height;
    return float(squares) * opacity;
}


void main(){
    rng_state = uint(vUv.x * 1000. + 101.);



    float scaleCanvas = 200.;
    float scaleDust = 1.;
    float amount = .1;
    int layers = 5;


    float noise = 0.;
    for (int i = 0; i < layers; i++){
        
        vec2 pos = vUv * resolution / 1000.;

        int seedGlobal = 1234 * (i + 1);
        pos -= vec2(random(seedGlobal) / 10., random(seedGlobal + 567) / 10.);

        pos *= scaleCanvas;
        vec2 local = (fract(pos) - vec2(.5)) * 2.;
        pos = floor(pos);

        int seed = int(pos.x + pos.y * 123.8 * float(i + 1));

        noise += squares(local, scaleDust, amount, seed);
    }

    gl_FragColor = vec4(vec3(noise), 1.);
}