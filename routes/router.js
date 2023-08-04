const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')
const postsController = require('../controllers/postsController')
const commentController = require('../controllers/commentController')
const userController = require('../controllers/userController')

const passport = require('passport')

router.post('/sign-up', authController.sign_up_post);
router.post('/log-in', authController.log_in_post);

router.get('/posts', postsController.get_all_posts);
router.post('/posts', passport.authenticate('jwt', {session: false}), postsController.add_post);

router.get('/posts/:pid', postsController.get_single_post);
router.delete('/posts/:pid', passport.authenticate('jwt', {session: false}), postsController.delete_post);
router.put('/posts/:pid', passport.authenticate('jwt', {session: false}), postsController.update_post_likes)

router.put('/posts/:pid/publish', passport.authenticate('jwt', {session: false}), postsController.update_post_publish_status);

router.get('/posts/:pid/comments', commentController.get_all_comments);
router.post('/posts/:pid/comments', passport.authenticate('jwt', {session: false}),  commentController.add_comment);

router.get('/posts/:pid/comments/:cid', commentController.get_single_comment);
router.put('/posts/:pid/comments/:cid', passport.authenticate('jwt', {session: false}), commentController.update_comment_likes);
router.delete('/posts/:pid/comments/:cid', passport.authenticate('jwt', {session: false}), commentController.delete_comment);

router.get('/users/:uid', userController.get_user_posts);


module.exports = router;