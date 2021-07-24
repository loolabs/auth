export class ParamPair {
    public name: string
    public value: string
    constructor(name: string, value: string) {
        this.name = name
        this.value = value
    }
}

export class ParamList {
    public list: Array<ParamPair>
    constructor(list: Array<ParamPair>) {
        this.list = list
    }

    public getFormattedUrlWithParams(url: string) : string {
        //generate appropriate url param suffix given the paramlist
        return url + '?' + this.list.map(({ name, value }) => `${name}=${value}`).join('&')
    }
}
