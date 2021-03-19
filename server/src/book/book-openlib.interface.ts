export interface IBookSearchResult {
    numFound: number,
    start: number,
    docs: IBookSearch[],
    num_found: number
} 

export interface IBookSearch {
    cover_i?: number,
    title: string,
    key: string, // '/works/:id'
    first_publish_year?: number,
    author_name?: string[],
    subject?: string[]
}

export interface IBookWorks {
    title: string,
    covers?: string[],
    subjects?: string[],
    key: string, // '/works/:id'
    authors?: {
        author: {
            key: string //'authors/:id'
        }
    }[] | {
        key: string
    }[],
    contributors?: {
        role: string,
        name: string
    }[]
}

export interface IAuthorAuthors {
    name?: string,
    fuller_name?: string,
    personal_name?: string
}