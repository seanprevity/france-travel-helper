import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import {
  User,
  City,
  Bookmark,
  Rating,
  Description,
  Weather,
  Image,
} from "@/types/drizzleTypes";
import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import { FiltersState } from ".";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "User",
    "City",
    "Region",
    "Bookmark",
    "Rating",
    "Description",
  ],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const authUser = await getCurrentUser();

          // Get user from DB
          let userResponse = await fetchWithBQ(`/users/${authUser.userId}`);

          // If not found, create user
          if (userResponse.error && userResponse.error.status === 404) {
            userResponse = await createNewUserInDatabase(
              authUser,
              idToken,
              fetchWithBQ
            );
            if (userResponse.error) {
              throw new Error("Failed to create user record");
            }
          }

          const userData = userResponse.data as User;

          const userWithCognitoId: User = {
            ...userData,
            cognitoId: authUser.userId,
          };

          return { data: userWithCognitoId };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error.message || "Could not fetch user data",
            },
          };
        }
      },
      providesTags: ["User"],
    }),

    // bookmark calls
    getBookmarks: build.query<Bookmark[], { user: User }>({
      query: ({ user }) => ({
        url: `/bookmarks/${user.cognitoId}`,
        method: "GET",
      }),
      providesTags: ["Bookmark"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to get bookmarks.",
        });
      },
    }),

    checkBookmark: build.query<boolean, { user: User; insee: string }>({
      query: ({ user, insee }) => ({
        url: `/bookmarks/${user.userId}/${insee}`,
        method: "GET",
      }),
      providesTags: ["Bookmark"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to check bookmark.",
        });
      },
    }),

    deleteBookmark: build.mutation<
      any,
      { inseeCode: string; cognitoId: string }
    >({
      query: ({ inseeCode, cognitoId }) => ({
        url: `/bookmarks/${cognitoId}`,
        method: "DELETE",
        body: { inseeCode },
      }),
      invalidatesTags: ["Bookmark"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Bookmark deleted successfully.",
          error: "Failed to delete bookmark.",
        });
      },
    }),

    setBookmark: build.mutation<
      any,
      { inseeCode: string; cognitoId: string; state: boolean }
    >({
      query: ({ inseeCode, cognitoId, state }) => ({
        url: `/bookmarks/${cognitoId}`,
        method: state === true ? "POST" : "DELETE",
        body: { inseeCode },
      }),
      invalidatesTags: ["Bookmark"],
      async onQueryStarted( { state }, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: state === true ? "Bookmark added successfully." : "Bookmark removed successfully.",
          error: "Failed to set bookmark.",
        });
      },
    }),

    // Cities / Department calls
    getCities: build.query<City[], Partial<FiltersState>>({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          populationMin: filters.population?.[0],
          populationMax: filters.population?.[1],
          region: filters.region,
          densityMin: filters.density?.[0],
          densityMax: filters.density?.[1],
          department: filters.department,
          academie: filters.academie,
          altitudeMin: filters.altitude?.[0],
          altitudeMax: filters.altitude?.[1],
          latitude: filters.latitude,
          longitude: filters.longitude,
          insee: filters.insee,
        });

        return { url: "cities", params };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ codeInsee }) => ({
                type: "City" as const,
                codeInsee,
              })),
              { type: "City", id: "LIST" },
            ]
          : [{ type: "City", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch cities.",
        });
      },
    }),

    getCity: build.query<City, { latitude: number; longitude: number }>({
      query: ({ latitude, longitude }) => ({
        url: `/cities/${latitude}/${longitude}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to get city by latitude and longitude.",
        });
      },
    }),

    getCityByInsee: build.query<City, { insee: string }>({
      query: ({ insee }) => ({
        url: `/cities/${insee}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to get city by insee.",
        });
      },
    }),

    getRandomCity: build.query<City, void>({
      query: () => ({
        url: `/cities/random`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to get random city.",
        });
      },
    }),

    // ratings calls
    getCityRatings: build.query<Rating, { insee: string }>({
      query: ({ insee }) => ({
        url: `/ratings/city/${insee}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to get city ratings.",
        });
      },
    }),

    // description calls
    getDescription: build.query<Description, { insee: string; lang: string }>({
      query: ({ insee, lang }) => ({
        url: `/descriptions?insee=${insee}&lang=${lang}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to get description.",
        });
      },
    }),
    // Image call
    getImages: build.query<Image[], { insee: string }>({
      query: ({ insee }) => ({
        url: `/descriptions/images?insee=${insee}`,
        method: "GET",
      }),
      transformResponse: (response: { images: any[] }) =>
        response.images.map(({ url, description }) => ({ url, description })),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to get images.",
        });
      },
    }),
    // Weather call
    getWeather: build.query<Weather, { latitude: number; longitude: number }>({
      query: ({ latitude, longitude }) => ({
        url: `/descriptions/weather?lat=${latitude}&lng=${longitude}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to get weather.",
        });
      },
    }),

    // Location Search call
    searchLocation: build.query<City[], { input: string }>({
      query: ({ input }) => ({
        url: `/cities/search/${input}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to search location.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useGetBookmarksQuery,
  useDeleteBookmarkMutation,
  useCheckBookmarkQuery,
  useGetCitiesQuery,
  useGetCityQuery,
  useGetCityByInseeQuery,
  useLazyGetRandomCityQuery,
  useGetCityRatingsQuery,
  useGetDescriptionQuery,
  useGetImagesQuery,
  useSetBookmarkMutation,
  useGetWeatherQuery,
  useSearchLocationQuery,
} = api;

export const { endpoints } = api;
export const getCity = api.endpoints.getCity;
