const url: string = 'www.jan.kowalski.pl';

const arrOfPath = function makeUrl(url: string): string[] {
    return url.split('.');
}
//test split string - ok
//console.log(makeUrl(url));

function getRoot(): Promise<Data[]> {
    return fetch('https://raw.githubusercontent.com/pawelm87/ts-app/master/json/root.json')
        .then(resp => resp.json() as Promise<Data[]>);
}

//test request root.json - ok
//getRoot().then(root => console.log(root));

function getFile(address: string): Promise<Data> {
    return fetch(`https://raw.githubusercontent.com/pawelm87/ts-app/master/json/${address}`)
        .then(resp => resp.json() as Promise<Data>);
}

//test request file - ok
//getFile('pl/pl.json').then(resp => console.log(resp));

function getFirstFile() {
    return getRoot().then(resp => getFile(resp[0].address));
}

//test
//getFirstFile().then(resp => console.log(resp));

//zakładam ze dane juz mam z serwera teraz musze je przeszukiwac po tablicy i podazac za sciezka
function findPath()

interface Data {
    path: string,
    address: string,
    type: string
}
