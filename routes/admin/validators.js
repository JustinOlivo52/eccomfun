const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.export = {
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .custom(async (email) =>{
            const existingUser = await usersRepo.getOneBy({ email: email });
            if(existingUser){
                throw new Error('Email in use');
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 }),
    requirePasswordConfirmation:  check('passwordConfirmation')
        .trim()
        .isLength({ min:4, max: 20 })
        .custom((passwordConfirmation, { req })=>{
            if(passwordConfirmation !== req.body.password){
                throw new Error('Passwords must match');
            }
        }),
    requireEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must provide a vaild email')
        .custom(async (email) =>{
            const user = await usersRepo.getOneBy({ email });
            if(!user) {
                throw new Error('Email not found!');
            }
        }),
    requireVaildPasswordForUser:check('password')
    .trim()
    .custom( async (password, { req }) =>{
        const user = await usersRepo.getOneBy({ email: req.body.email });
        if(!user) {
            throw new Error('Invaild password')
        }

        const validPassword = await usersRepo.comparePasswords(
            user.password, 
            password
        );
        if(!validPassword) {
            throw new Error('Invalid password');
        }
    })
}