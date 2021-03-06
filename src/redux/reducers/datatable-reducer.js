import {
  DELETE,
  SORT,
  PAGINATION,
  CHANGE_PAGE_SIZE,
} from "../action-constants";


const filterRecords = (state) => {
  const lastIndex = state.currentPage * state.pageSize;
  const startIndex = lastIndex - state.pageSize;
  const tableData = state.data.slice(startIndex, lastIndex);
  return {
    ...state,
    totalPages: Math.ceil(state.data.length / state.pageSize),
    tableData,
  };
};


const INITIAL_STATE = {
  data: [],
  tableData: [],
  currentPage: 1, // index of current page
  totalPages: 1, // count of total number of pages
  numberOfButtons: 5, // maximum number of pagination buttons to be shown
  pageSize: 5, // number of rows in the table at a time
};

// after each operation set the totalPages

export default function dataTableReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case DELETE: {
      const index = state.data.findIndex(obj => obj.id === action.data.id);
      state.data.splice(index, 1);
      return filterRecords(state);
    }
    case SORT: {
      const { order, key } = action.data;
      const tableData = state.data.sort((a, b) => {
        const val = typeof a[key] === 'string' ? a[key].localeCompare(b[key]) : a[key] - b[key];
        if (order === 'ASC') return val;
        else return -val;
      });
      return filterRecords({ ...state, tableData });
    }
    case PAGINATION: {
      state.currentPage = action.data.pageNo;
      return filterRecords(state);
    }
    case CHANGE_PAGE_SIZE: {
      return filterRecords({ ...state, ...action.data });
    }
    default:
      if (action.data) {
        state.data = action.data;
      }
      return filterRecords(state);
  }
}
