using { my.library as lib } from '../db/schema';

@protocol: ['odata', 'rest']
service LibraryService {

  entity Books as projection on lib.Books;
  entity Authors as projection on lib.Authors;
  entity Students as projection on lib.Students;
  entity Borrowings as projection on lib.Borrowings;

  action borrowBook(bookID: UUID, studentID: UUID) returns String;
  action returnBook(borrowingID: UUID) returns String;
  action activateStudent(studentID: UUID) returns String;
  action countBorrowedBooks(studentID: UUID) returns Integer;
}
