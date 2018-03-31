import {PaginateModel, Document} from "mongoose";

export interface IbooksD extends Document {
    name?: String;
    pages?: Number;
    author?: String;
}

export interface BooksModel<T extends Document> extends PaginateModel<T> {
}
