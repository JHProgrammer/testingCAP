namespace my.library;

entity Authors {
  key ID   : UUID;
  name     : String;
  country  : String;
}

entity Books {
  key ID       : UUID;
  title        : String;
  stock        : Integer;
  author       : Association to Authors;
  price        : Decimal(10,2);
}

entity Students {
  key ID       : UUID;
  fullName     : String;
  email        : String;
  active       : Boolean default true;
}

entity Borrowings {
  key ID         : UUID;
  book           : Association to Books;
  student        : Association to Students;
  borrowedAt     : DateTime;
  returned       : Boolean default false;
}
