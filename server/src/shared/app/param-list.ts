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
        const firstPair = this.list[0]
        let formattedUrl = url+`?${firstPair.name}=${firstPair.value}`
        this.list.splice(0, 1).forEach(pair => {
            formattedUrl+=`&${pair.name}=${pair.value}`
        })
        return formattedUrl
    }
}
