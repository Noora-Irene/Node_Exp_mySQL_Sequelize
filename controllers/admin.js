const Article = require('../models/article');

exports.getAddArticle = (req, res, next) => {
   res.render('admin/edit-article', {
      pageTitle: 'Lisää tuote',
      path: '/admin/add-article',
      editing: false
   });
};

exports.postAddArticle = (req, res, next) => {
   const title = req.body.title;
   const image = req.body.image;
   const price = req.body.price;
   const description = req.body.description;
   req.user
      .createArticle({
         title: title,
         image: image,
         price: price,
         description: description
      })
      .then(result => {
         console.log('Article created');
         res.redirect('/admin/articles');
      })
      .catch(err => {
         console.log(err);
      });
};

exports.getEditArticle = (req, res, next) => {
   const editMode = req.query.edit;
   if (!editMode) {
      return res.redirect('/');
   }
   const artId = req.params.articleId;
   req.user
      .getArticles({ where: { id: artId } })
      .then(articles => {
         const article = articles[0];
         if (!article) {
            return res.redirect('/');
         }
         res.render('admin/edit-article', {
            pageTitle: 'Manage Articles',
            path: '/admin/edit-article',
            editing: editMode,
            article: article
         });
      })
      .catch(err => console.log(err));
};

exports.postEditArticle = (req, res, next) => {
   const artId = req.body.articleId;
   const updatedTitle = req.body.title;
   const updatedImage = req.body.image;
   const updatedPrice = req.body.price;
   const updatedDescription = req.body.description;
   Article.findByPk(artId)
      .then(article => {
         article.title = updatedTitle;
         article.image = updatedImage;
         article.price = updatedPrice;
         article.description = updatedDescription;
         return article.save();
      })
      .then(result => {
         console.log('Article updated')
         res.redirect('/admin/articles');
      })
      .catch(err => {
         console.log(err);
      });
};

exports.getArticles = (req, res, next) => {
   req.user
      .getArticles()
      .then(articles => {
         res.render('admin/articles', {
            arts: articles,
            pageTitle: 'Admin Articles',
            path: '/admin/articles'
         });
      })
      .catch(err => console.log(err));
};

exports.postDeleteArticle = (req, res, next) => {
   const artId = req.body.articleId;
   Article.findByPk(artId)
      .then(article => {
         return article.destroy();
      })
      .then(result => {
         console.log('Article destroyed')
         res.redirect('/admin/articles');
      })
      .catch(err => console.log(err));
};