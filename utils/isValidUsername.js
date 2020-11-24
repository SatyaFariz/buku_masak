/*This answer is useful
246

^(?=.{4,30}$)(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$
 └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
       │         │         │            │           no _ or . at the end
       │         │         │            │
       │         │         │            allowed characters
       │         │         │
       │         │         no __ or _. or ._ or .. inside
       │         │
       │         no _ or . at the beginning
       │
       username is 4-30 characters long

^(?=.{4,30}$)(?![_.])(?!.*[_.]{2})(?=.*[a-z])([a-z0-9._]+)(?<![_.])$
 └─────┬────┘└───┬──┘└─────┬─────┘└────┬────┘└─────┬─────┘└───┬───┘
       │         │         │           │           │          no _ or . at the end
       │         │         │           │           │
       │         │         │  at least 1 letter    allowed characters
       │         │         │
       │         │         no __ or _. or ._ or .. inside
       │         │
       │         no _ or . at the beginning
       │
       username is 4-30 characters long
*/

module.exports = (username) => {
  const regexp = /^(?=.{4,30}$)(?![_.])(?!.*[_.]{2})(?=.*[a-z])([a-z0-9._]+)(?<![_.])$/
  return regexp.test(username)
}