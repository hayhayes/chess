import { configureStore } from "@reduxjs/toolkit";
import chessBoardReducer from "../features/chessBoardSlice";

export const store = configureStore({
    reducer: {
      chessBoard: chessBoardReducer,
    },
});