import { useEffect, useState } from "react";

//redux
import { useSelector } from "react-redux";
import { selectAuthJwtToken } from "features/auth/authSlice";
import {
  selectCurrentOpenLibrarySearch,
  //   selectCurrentUsersAddedSearch,
  //   selectIsSearchingOpenLibrary,
} from "features/search/searchSlice";

//graphql
import {
  getSdk,
  SearchBookInput,
  Search_BaseBook_All_Fragment,
} from "gql/generated/gql-types";
import { GraphQLClient } from "graphql-request";
import { GQL_ENDPOINT, MAX_BOOKS_PER_QUERY } from "consts";

const useBookSearch = (pageNumber: number) => {
  const jwtToken = useSelector(selectAuthJwtToken);
  const currentOpenLibrarySearch = useSelector(selectCurrentOpenLibrarySearch);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState<Search_BaseBook_All_Fragment[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const searchBook = async (args: {
    input: SearchBookInput;
    offset: number;
    limit: number;
  }) => {
    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    });
    const sdk = getSdk(client);
    const { searchOnlineBooks } = await sdk.searchOnlineBooks(args);
    return searchOnlineBooks;
  };

  useEffect(() => {
    setBooks([]);
  }, [currentOpenLibrarySearch]);

  useEffect(() => {
    if (currentOpenLibrarySearch) {
      setLoading(true);
      setError(false);

      //process value input
      const parts = currentOpenLibrarySearch.split("/");
      let input: SearchBookInput = {};
      if (parts[0]) {
        input.title = parts[0];
      }
      if (parts[1]) {
        input.author = parts[1];
      }
      const search = async () => {
        try {
          const books = await searchBook({
            input,
            offset: MAX_BOOKS_PER_QUERY * pageNumber,
            limit: MAX_BOOKS_PER_QUERY,
          });

          setBooks((prevBooks) => {
            return [...prevBooks, ...books];
          });
          setLoading(false);
          setError(false);
          if (books.length < MAX_BOOKS_PER_QUERY) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        } catch (e) {
          setError(true);
        }
      };

      search();
    }
  }, [currentOpenLibrarySearch, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
