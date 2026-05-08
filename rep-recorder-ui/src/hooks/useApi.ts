import axios from "axios";
import type { PaginatedList } from "~/types/common-types";
import type { CreateRepSetSchemeRequest, RepSetScheme } from "~/types/rep-set-scheme-types";

export type IApi = ReturnType<typeof useApi>;

export default function useApi() {

  //const apiBaseAddress = "https://localhost:7113";
  //const apiBaseAddress = "https://lawfirmapi-gdage3hffjgugkeh.uksouth-01.azurewebsites.net";
  const apiBaseAddress = import.meta.env.VITE_API_URL;

  /* if we don't set the user id header, the API will return a 401 error.
     This is because the API is protected by an authentication middleware that requires a user id to be provided in the header. 
     In a real application, we would get the user id from the authentication context or from a cookie, but for this example, 
     we will just hardcode it
  */
  const config = {
    headers: {
      "X-User-Id": "aaaaaaaa-0000-0000-0000-000000000001",
    },
  };

  return {
    getRepSetSchemes: async (pageNumber: number, pageSize: number, sortBy: string, sortOrder: string) => {
      const url =
        `${apiBaseAddress}/repSetScheme` +
        `?pageNumber=${pageNumber + 1}` +
        `&pageSize=${pageSize}` +
        `&sortBy=${sortBy}` +
        `&sortOrder=${sortOrder}`;
      const { data } = await axios.get<PaginatedList<RepSetScheme>>(url, config);
      return data;
    },

    createRepSetScheme: async (request: CreateRepSetSchemeRequest) => {
      const { data } = await axios.post<RepSetScheme>(
        `${apiBaseAddress}/repSetScheme`,
        request,
        config,
      );
      return data;
    },
    deleteRow: async (id: string) => {
      await axios.delete(`${apiBaseAddress}/repSetScheme/${id}`, config);
    }
  };
}
