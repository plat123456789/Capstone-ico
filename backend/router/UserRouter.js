const express = require("express");
const jwt = require('jwt-simple');
// const config = require('../config');
const passport = require('passport');
const axios = require('axios');
const bcrypt = require('../utils/bcrypt');
require('dotenv').config();

module.exports = class UserRouter {
    constructor(userService) {
        this.userService = userService;
    }

    router() {
        let router = express.Router();
        router.post('/auth/login', this.localLogin.bind(this));
        router.post('/auth/signup', this.localSignUp.bind(this));
        router.post('/auth/facebook', this.facebookLogin.bind(this));
        router.get('/user/profilePic', passport.authenticate('jwt', { session: false }), this.fetchProfilePic.bind(this));
        router.post('/user/profilePic', passport.authenticate('jwt', { session: false }), this.uploadProfilePic.bind(this));

        return router;
    }

    async localLogin(req, res) {
        try {
            if (!req.body.email || !req.body.password) {
                res.status(400).send("Invalid email or password");
            }
            var email = req.body.email;
            var password = req.body.password;
            const result = await this.userService.localLogin(email, password);
            if (result[0]) {
                let pwMatch = await bcrypt.checkPassword(password, result[0].pw);
                if (!pwMatch) { res.status(400).send("Incorrect password") }
                var payload = {
                    id: result[0].id,
                    alias: result[0].alias,
                    photo: result[0].photo,
                    is_admin: result[0].is_admin
                };
                var token = jwt.encode(payload, process.env.JWT_SECRET);

                res.json({
                    token: token,
                    is_admin: result[0].is_admin
                });
            } else {
                res.status(400).send('User not found');
            }
        } catch (err) {
            res.sendStatus(401).json(err);
        }
    }

    async localSignUp(req, res) {
        try {
            let checkEmail = await this.userService.verifyUserByEmail(req.body.email);
            if (checkEmail.length > 0) { res.status(400).send("User already registered") }
            let hash = await bcrypt.hashPassword(req.body.password)
            let newUser = await this.userService.localSignUp(req.body.email, hash, req.body.username);
            let userDetails = await this.userService.getUserDetailsById(newUser[0]);
            var payload = {
                id: newUser[0],
                alias: userDetails[0].alias,
                photo: userDetails[0].photo,
                is_admin: userDetails[0].is_admin
            };
            var token = jwt.encode(payload, process.env.JWT_SECRET);

            res.json({
                token,
                is_admin: userDetails[0].is_admin
            });
        } catch (err) {
            res.sendStatus(401).json(err);
        }
    }

    async facebookLogin(req, res) {
        if (req.body.access_token) {
            var accessToken = req.body.access_token;
            try {
                let data = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}`);
                if (data.data.error) { res.status(400).send("Error on verifying FB Access Token"); }
                console.log(data);
                let userId;
                let user = await this.userService.findUserByOAuthId('facebook', data.data.id);
                if (user[0]) {
                    userId = user[0].id
                } else {
                    let newUser = await this.userService.facebookSignUp(data.data.name, data.data.id);
                    console.log(newUser);
                    userId = newUser[0];
                }
                let userDetails = await this.userService.getUserDetailsById(userId);
                let payload = {
                    id: userId,
                    alias: userDetails[0].alias,
                    photo: userDetails[0].photo,
                    is_admin: userDetails[0].is_admin
                }

                // Return the JWT token after checking
                var token = jwt.encode(payload, process.env.JWT_SECRET);
                console.log({ token, userId })
                res.json({
                    token,
                    is_admin: userDetails[0].is_admin
                });
            } catch (err) {
                res.sendStatus(401).json(err);
            }

        } else {
            res.sendStatus(401);
        }
    }

    verifyUserByEmail(req, res) {
        this.userService.verifyUserByEmail(req.query.email)
            .then((result) => {
                if (result.length > 0) { return res.json({ check: "fail" }) }
                else if (result.length === 0) { return res.json({ check: "pass" }) }
            })
    }

    fetchProfilePic(req, res) {
        this.userService.fetchProfilePic(req.user.id)
            .then((result) => {
                res.json({ profilePic: result[0] });
            })
    }

    uploadProfilePic(req, res) {
        this.userService.uploadProfilePic(req.user.id, req.body)
            .then((result) => {
                res.json(result);
            })
    }
}