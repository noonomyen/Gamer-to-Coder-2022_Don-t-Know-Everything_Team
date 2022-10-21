const set = 10;
const range = 10;

var sum = 0;
for (let i = 0; i < set; i++) {
    // Arithmetic progression
    sum = (range / 2) * ((((i * range) + 1) * 2) + (range - 1))
    console.log(`set ${i + 1} = ${sum}`);
};