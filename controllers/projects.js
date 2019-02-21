const Projects = require("../models/projects");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

// post by id
exports.postById = (req, res, next, id) => {
  Projects.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, project) => {
      if (err || !project) {
        res.status(400).json({
          error: err
        });
      }
      req.project = project;
      next();
    });
};

// get project
exports.getProjects = (req, res) => {
  const projects = Projects.find()
    .populate("postedBy", "_id name")
    .select("_id title body")
    .then(projects => {
      res.json({ projects });
    })
    .catch(err => console.log(err));
};

//create project
exports.createProject = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }

    let project = new Projects(fields);

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    project.postedBy = req.profile;

    if (files.photo) {
      project.photo.data = fs.readFileSync(files.photo.path);
      project.photo.contentType = files.photo.type;
    }
    project.save((err, result) => {
      if (err) {
        res.status(400).json({
          error: err
        });
      }

      res.json(result);
    });
  });
};

// all post by user
exports.postsByUser = (req, res) => {
  Projects.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, projects) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json({ projects });
    });
};

// is poster
exports.isPoster = (req, res, next) => {
  let isPoster =
    req.project && req.auth && req.project.postBy._id == req.auth._id;
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized"
    });
  }
  next();
};

// update projects
exports.updateProject = (req, res, next) => {
  let project = req.project;
  project = _.extend(project, req.body);
  project.updated = Date.now();
  project.save((err, project) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json(post);
  });
};

// delete projects
exports.deleteProject = (req, res) => {
  let project = req.project;
  project.remove((err, project) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      message: "Post deleted successfuly"
    });
  });
};
