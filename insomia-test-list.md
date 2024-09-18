## USERS

- get all users
- post a user

  - error tests
    - empty request body
    - missing properties
    - extra properties
    - invalid types for req.body types
    - incorrect formatting for specific properties
    - empty req body

- get a user by id

  - error tests
    - valid but non-existing userId
    - invalid userId

- delete a user by id

  - error tests
    - valid but non-existing userId
    - invalid userId

- update a user by id
  - error tests
    - valid but non-existing userId
    - invalid userId
    - invalid types on request body
    - incorrect formatting on request body
    - extra properties
    - empty req.body
