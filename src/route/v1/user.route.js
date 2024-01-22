import express from "express";
import { saveUser, deleteUser, getUser, updateUser, login, getUserAll } from "../../controller/user.controller.js";
import { checkAccess, verifyToken } from "../../middleware/auth.js";
import { roles } from "../../utils/constant.js";
const router = express.Router();

router.get('/test',
    async (req, res) => {
        try {
            res.status(200).send({ message: 'success'});
        } catch(e) {
            console.log(e);
            res.status(500).send(JSON.parse(e.message));
        }
    });

router.post('/', async (req, res) => {
    try {
        await saveUser(req, res, req.app.get('database'))
    } catch(e) {
        console.log(e)
        res.status(500).send(e);
    }
});

router.post('/login', async (req, res) => {
    try {
        await login(req, res, req.app.get('database'))
    } catch(e) {
        console.log(e)
        res.status(500).send(e);
    }
});

router.put('/:userId',
    verifyToken,
    checkAccess([roles.admin, roles.user]),
    async (req, res) => {
        try {
            await updateUser(req, res, req.app.get('database'))
        } catch(e) {
            console.log(e);
            res.status(500).send(JSON.parse(e.message));
        }
    });

router.get('/:userId',
    verifyToken,
    checkAccess([roles.admin, roles.user]),
    async (req, res) => {
        try {
            await getUser(req, res, req.app.get('database'))
        } catch(e) {
            console.log(e);
            res.status(500).send(JSON.parse(e.message));
        }
    });

router.get('/',
    verifyToken,
    checkAccess([roles.admin]),
    async (req, res) => {
        try {
            await getUserAll(req, res, req.app.get('database'))
        } catch(e) {
            console.log(e);
            res.status(500).send(JSON.parse(e.message));
        }
    });
router.delete('/:userId',
    verifyToken,
    checkAccess([roles.admin]),
    async (req, res) => {
    try {
        await deleteUser(req, res, req.app.get('database'))
    } catch(e) {
        res.status(500).send(JSON.parse(e.message));
    }
});

export default router;