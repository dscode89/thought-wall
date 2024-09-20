## To Do

- go through models and look at refactoring functions into possible reusable util functions
- go through tests and make sure that test descriptions are uniform
- add tests for a validatePassword, validateEmail, validate name fields util functions
- rethink name regex as maybe they should not contain spaces? get everything else done nd go back an refactor this
- write down all of the possible ways a client can interact and go through integration tests using insomnia with the developer database
- add a healthcheck endpoint
- add an endpoint for getting the api documentation
- add error tests for empty req body values as currently you can update a user with empty values - done
  - do the same for thoughts - done
- find out why nothing is returned when trying to update userId when patching a thought - done
- fix thoughts model fetchThoughtsBYSer Id
