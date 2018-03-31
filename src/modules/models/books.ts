import {Schema, model} from "mongoose";
import {BooksModel, IbooksD} from "./Ibooks";

const booksSchema: Schema = new Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    pages: {
        type: Number,
        index: true,
        required: true
    },
    author: {
        type: String,
        index: true,
        required: true
    }
});


export const booksModel: BooksModel<IbooksD> = model<IbooksD>("Books", booksSchema) as BooksModel<IbooksD>;
