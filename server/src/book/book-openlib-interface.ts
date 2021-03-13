export interface IBookSearchResultOpenLib {
    numFound: number,
    start: number,
    docs: IBookOpenLib[],
    num_found: number
} 

export interface IBookOpenLib {
    cover_i?: number,
    title: string,
    key: string, // '/works/id'
    first_publish_year?: number,
    author_name?: string[],
    subject?: string[]
}