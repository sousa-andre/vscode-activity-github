import fetch, { RequestInit } from 'node-fetch';

export default class GraphQLCLient {
    constructor(private url: string, private options: RequestInit) {
        if (this.options.body !== undefined) {
            throw Error(
                'options argument should not have body attribute defined.'
            );
        }
    }

    async request(query: string) {
        this.options.body = JSON.stringify({ query });
        this.options.method = 'POST';
        this.options.headers = {
            ...this.options.headers,
        };
        const res = await fetch(this.url, this.options);
        return await res.json();
    }
}
