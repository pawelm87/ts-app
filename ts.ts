const pathToServer: string = 'https://raw.githubusercontent.com/pawelm87/ts-app/master/json/';

function getPathFromUrl(url:string): string {
    return url.split('.').pop();
}

function deleteLastPath(url:string): string {
    const splitUrl = url.split('.');
    splitUrl.pop();
    return splitUrl.join('.');
}

function connectUrlAfterRedirect(oldUrl: string, redirectUrl: string): string {
    return oldUrl + '.' + redirectUrl;
}

function getRouting(path: string): Promise<RoutingEntry[]> {
    return fetch(pathToServer + path)
        .then(function (resp) {
            if (resp.status === 200)
                return resp;
            else
                throw `Error: function getRouting. Wrong path to root file: ${resp.url}`;
        })
        .then(resp => resp.json() as Promise<RoutingEntry[]>);
}
//test request file - ok
//getRouting('pl/pl.json').then(resp => console.log(resp));

function getRootRouting(): Promise<RoutingEntry[]> {
    return getRouting('root.json');
}
//test request root.json - ok
//getRootRouting().then(root => console.log(root));

function getServerContent(path: string): Promise<string> {
    return fetch(pathToServer + path)
        .then(function (resp) {
            if (resp.status === 200)
                return resp;
            else
                throw `Error: function getServerContent. No file to read.`;
        })
        .then(resp => resp.text());
}
//test - ok
//getServerContent('pl/kowalski/jan/www/www.txt').then(resp => console.log(resp));

function findRoutingEntryByPath(arrayOfRouting: RoutingEntry[], path: string): RoutingEntry {
    for (let i = 0; i < arrayOfRouting.length; i++) {
        if (arrayOfRouting[i].path === path)
            return arrayOfRouting[i];
        }
        throw `Error: function findRoutingEntryByPath. Don't find path "${path}" in your Url, 
        please check did you write correct path or file on this path don't exist`;
}
//test - ok
//getRootRouting().then(resp => findRoutingEntryByPath(resp, 'pl')).then(resp => console.log(resp));

function handleUrl(url: string, arrayOfRoutingEntry: RoutingEntry[]): Promise<string> {
    const executeByRoutingEntryType = (url: string, routingEntry: RoutingEntry): Promise<string>  => {
        switch (routingEntry.type){
            case 'proxy':
                return getRouting(routingEntry.address)
                    .then(resp => handleUrl(url, resp));
            case 'server':
                return getServerContent(routingEntry.address);
            case 'redirect':
                return getFileByUrl(connectUrlAfterRedirect(url, routingEntry.address));
            default:
                throw `Error: function IsProxy. 
            Wrong or less "type" in ${JSON.stringify(routingEntry)} it must by "proxy" or "server", check it`;
        }
    };

    const pathToCheck = getPathFromUrl(url);
    const routingEntry = findRoutingEntryByPath(arrayOfRoutingEntry, pathToCheck);
    return executeByRoutingEntryType(deleteLastPath(url), routingEntry);
}
//test - ok

function getFileByUrl(url: string): Promise<string> {
    return getRootRouting()
        .then(resp => handleUrl(url, resp));
}

getFileByUrl('www.janusz.kowalski.pl').then(resp => console.log(resp)).catch(error => console.log(error));

interface RoutingEntry {
    path: string,
    address: string,
    type: string
}
