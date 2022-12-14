const express = require('express');
const router = express.Router();

// Controller - Admin
const AuthController = require("./../apps/controllers/auth");
const AdminController = require('./../apps/controllers/admin');
const CategoryController = require("./../apps/controllers/category");
const UserController = require('./../apps/controllers/user');
const ProductController = require("./../apps/controllers/product");
const CommentController = require("./../apps/controllers/comment");

// Controller - Site
const SiteController = require("./../apps/controllers/site")
// Controller - chat
const ChatController = require("./../apps/controllers/chat")
// middlewares
const AuthMiddleware = require('./../apps/middlewares/auth')
const UploadMiddleware = require('./../apps/middlewares/upload')

// Router

// admin
router.get('/admin/login', AuthMiddleware.checkLogin, AuthController.login);
router.post('/admin/login', AuthMiddleware.checkLogin, AuthController.postLogin);

router.get('/admin/logout',AuthMiddleware.checkAdmin, AdminController.logout);
router.get('/admin',AuthMiddleware.checkAdmin, AdminController.index);

router.get('/admin/products', AuthMiddleware.checkAdmin, ProductController.index);
router.get('/admin/products/create', AuthMiddleware.checkAdmin, ProductController.create); // cr prd
router.post('/admin/products/store',  AuthMiddleware.checkAdmin, UploadMiddleware.upload.single('thumbnail') , ProductController.store);    // post cr prd
router.get('/admin/products/edit/:id', AuthMiddleware.checkAdmin, ProductController.edit);
router.post('/admin/products/update/:id', AuthMiddleware.checkAdmin, UploadMiddleware.upload.single('thumbnail') , ProductController.update);
router.get('/admin/products/delete/:id', AuthMiddleware.checkAdmin, ProductController.del);

router.get('/admin/category', AuthMiddleware.checkAdmin, CategoryController.index);
router.get('/admin/category/create', AuthMiddleware.checkAdmin, CategoryController.create); // cr category
router.post('/admin/category/store', AuthMiddleware.checkAdmin, CategoryController.store);    // post cr category
router.get('/admin/category/edit/:id', AuthMiddleware.checkAdmin, CategoryController.edit);
router.post('/admin/category/update/:id', AuthMiddleware.checkAdmin, CategoryController.update);
router.get('/admin/category/delete/:id', AuthMiddleware.checkAdmin, CategoryController.del);

router.get('/admin/users', AuthMiddleware.checkAdmin, UserController.index);
router.get('/admin/users/create', AuthMiddleware.checkAdmin, UserController.create); // cr user
router.post('/admin/users/store', AuthMiddleware.checkAdmin, UserController.store);    // post cr user
router.get('/admin/users/edit/:id', AuthMiddleware.checkAdmin, UserController.edit);
router.post('/admin/users/update/:id', AuthMiddleware.checkAdmin, UserController.update);
router.get('/admin/users/delete/:id', AuthMiddleware.checkAdmin, UserController.del);

router.get('/admin/comment', AuthMiddleware.checkAdmin, CommentController.index);
router.post('/admin/comment/update/:id', AuthMiddleware.checkAdmin, CommentController.update);
router.get('/admin/comment/delete/:id', AuthMiddleware.checkAdmin, CommentController.del);

///////////////////////////// site
// router.get('/')
router.get('/', SiteController.home);
router.get('/category-:slug.:id', SiteController.category);
router.get('/product-:slug.:id', SiteController.product)
router.post("/product-:slug.:id", SiteController.comment); 
router.get("/search", SiteController.search);
router.get("/cart", SiteController.cart);

router.post("/update-cart", SiteController.updateCart)
router.get("/del-cart-:id", SiteController.delToCart)
router.post("/add-to-cart", SiteController.addToCart);

router.post("/order", SiteController.order)
router.get("/success", SiteController.success);
// // chat

router.get('/chat',AuthMiddleware.checkUser, ChatController.chat)
module.exports = router;