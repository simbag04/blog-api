const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')
const postsController = require('../controllers/postsController')
const commentController = require('../controllers/commentController')

router.post('/sign-up', authController.sign_up_post);
router.post('/log-in', authController.log_in_post);

router.get('/posts', postsController.get_all_posts);
router.post('/posts', postsController.add_post);

router.get('/posts/:pid', postsController.get_single_post);
router.delete('/posts/:pid', postsController.delete_post);
router.put('/posts/:pid', postsController.update_post_likes)

router.put('/posts/:pid/publish', postsController.update_post_publish_status);

router.get('/posts/:pid/comments', commentController.get_all_comments);
router.post('/posts/:pid/comments', commentController.add_comment);

router.get('/posts/:pid/comments/:cid', commentController.get_single_comment);
router.put('/posts/:pid/comments/:cid', commentController.update_comment_likes);
router.delete('/posts/:pid/comments/:cid', commentController.delete_comment);


module.exports = router;