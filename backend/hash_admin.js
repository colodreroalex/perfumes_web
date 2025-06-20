const bcrypt = require('bcryptjs');

bcrypt.hash('x000138da4983', 10).then(hash => {
nsole.log('Hash bcrypt para password:', hash);
}); 