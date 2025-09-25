import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { 
  UserDto, 
  FindAllUsersResponseInterface,
  BasePaginationInterface,
  IPaginationQuery,
  IUpdateUserRequest,
} from '@inventory/shared-types';







interface UsersState {
  users: UserDto[];
  selectedUser: UserDto | null;
  loading: boolean;
  errorMessage: string | null;
  // Use shared pagination interface
  pagination: BasePaginationInterface & {
    totalPages: number;
  };
  // Use shared query interface structure
  filters: Pick<IPaginationQuery, 'search'> & {
    searchTerm: string;
    role: string;
    department: string;
    status: string;
  };
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  errorMessage: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    next: "",
    prev: null,
    totalPages: 0,
  },
  filters: {
    search: "",
    searchTerm: "",
    role: "All",
    department: "All",
    status: "All",
  },
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.errorMessage = null;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
      state.loading = false;
    },
    setUsers: (state, action: PayloadAction<UserDto[]>) => {
      state.users = action.payload;
      state.loading = false;
      state.errorMessage = null;
    },
    addUser: (state, action: PayloadAction<UserDto>) => {
      state.users.unshift(action.payload);
    },
    updateUser: (state, action: PayloadAction<{ id: string; updates: IUpdateUserRequest }>) => {
      const index = state.users.findIndex((user:UserDto) => user.username === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.updates };
      }
      if (state.selectedUser?.username === action.payload.id) {
        state.selectedUser = { ...state.selectedUser, ...action.payload.updates };
      }
    },
    // removeUser: (state, action: PayloadAction<string>) => {
    //   state.users = state.users.filter(user => user.id !== action.payload);
    //   if (state.selectedUser?.id === action.payload) {
    //     state.selectedUser = null;
    //   }
    // },
    setSelectedUser: (state, action: PayloadAction<UserDto | null>) => {
      state.selectedUser = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<UsersState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action: PayloadAction<Partial<UsersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.pagination = initialState.pagination;
      state.errorMessage = null;
    },
    // // New actions using shared types
    // setUsersFromApi: (state, action: PayloadAction<UsersApiResponse>) => {
    //   const { users, ...paginationData } = action.payload;
    //   state.users = users.map(mapUserDtoToUser);
    //   state.pagination = { 
    //     ...paginationData, 
    //     totalPages: Math.ceil(paginationData.total / paginationData.limit) 
    //   };
    //   state.loading = false;
    //   state.error = null;
    // },
    // setUserFromDto: (state, action: PayloadAction<UserDto>) => {
    //   const user = mapUserDtoToUser(action.payload);
    //   const index = state.users.findIndex(u => u.uuid === user.uuid);
    //   if (index !== -1) {
    //     state.users[index] = user;
    //   } else {
    //     state.users.unshift(user);
    //   }
    //   state.selectedUser = user;
    // },
    // updateFiltersFromQuery: (state, action: PayloadAction<Partial<UsersQuery>>) => {
    //   if (action.payload.search !== undefined) {
    //     state.filters.searchTerm = action.payload.search;
    //     state.filters.search = action.payload.search;
    //   }
    // },
  },
});

export const {
  setLoading,
  setError,
  setUsers,
  addUser,
  updateUser,
  // removeUser,
  setSelectedUser,
  setPagination,
  setFilters,
  clearFilters,
  clearUsers,
  // New actions using shared types
  // setUsersFromApi,
  // setUserFromDto,
} = usersSlice.actions;