import { useEffect, useState } from "react";

//redux
import { useSelector } from "react-redux";
import { selectAuthJwtToken } from "features/auth/authSlice";
import {
  selectCurrentUsersAddedSearch,
  //   selectIsSearchingOpenLibrary,
} from "features/search/searchSlice";

//graphql
import {
  getSdk,
  SearchAddedBooksQueryVariables,
  BookFilter,
  Search_Book_Parts_Fragment,
} from "gql/generated/gql-types";
import { GraphQLClient } from "graphql-request";
import { GQL_ENDPOINT, MAX_BOOKS_PER_QUERY } from "consts";

const useBookSearch = (pageNumber: number) => {
  const jwtToken = useSelector(selectAuthJwtToken);
  const currentUsersAddedSearch = useSelector(selectCurrentUsersAddedSearch);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState<Search_Book_Parts_Fragment[]>([]);
  const [endCursor, setEndCursor] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(-1);
  const [hasMore, setHasMore] = useState(true);

  const searchBooks = async (args: SearchAddedBooksQueryVariables) => {
    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    });
    const sdk = getSdk(client);
    let { first, after, filter } = args;
    if (!first) {
      first = MAX_BOOKS_PER_QUERY;
    }
    const { searchAddedBooks } = await sdk.searchAddedBooks({
      first,
      after,
      filter,
    });
    return searchAddedBooks;
  };

  useEffect(() => {
    setBooks([]);

    setEndCursor("");
    setCurrentPage(-1);
  }, [currentUsersAddedSearch]);

  useEffect(() => {
    if (pageNumber === 0) {
      setBooks([]);

      setEndCursor("");
      setCurrentPage(-1);
    }
  }, [pageNumber]);

  useEffect(() => {
    if (currentUsersAddedSearch && pageNumber === currentPage + 1) {
      setLoading(true);
      setError(false);

      //process value input
      const parts = currentUsersAddedSearch.split("/");
      let filter: BookFilter = {};
      if (parts[0]) {
        filter.title = parts[0];
      }
      if (parts[1]) {
        filter.author = parts[1];
      }

      let args: SearchAddedBooksQueryVariables = {
        filter,
      };

      if (endCursor) {
        args = {
          ...args,
          after: endCursor,
        };
      }

      const search = async () => {
        try {
          const res = await searchBooks(args);

          let books: Search_Book_Parts_Fragment[] = [];
          if (res.page.edges) {
            res.page.edges.forEach((e) => {
              if (e.node) {
                books.push(e.node);
              }
            });
          }

          setBooks((prevBooks) => {
            return [...prevBooks, ...books];
          });
          setLoading(false);
          setError(false);
          setHasMore(res.page.pageInfo ? res.page.pageInfo.hasNextPage : false);
          setEndCursor(res.page.pageInfo?.endCursor || "");
          setCurrentPage(pageNumber);
        } catch (e) {
          setLoading(false);
          setError(true);
        }
      };

      search();
    }
  }, [currentUsersAddedSearch, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
