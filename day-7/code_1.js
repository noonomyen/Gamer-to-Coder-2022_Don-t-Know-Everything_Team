const set = 10;
const range = 10;

for (let i = 0; i < set; i++) {
    let sum = 0;
    for (let ii = (i * range) + 1; ii <= (i + 1) * range; ii++) {
        sum += ii;
    };
    console.log(`set ${i + 1} = ${sum}`);
};