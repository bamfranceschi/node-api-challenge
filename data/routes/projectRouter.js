const express = require("express");

const Projects = require("../helpers/projectModel");

const router = express.Router();

//GET all projects --tested and working
router.get("/", (req, res) => {
  Projects.get()
    .then(allProjects => {
      res.status(200).json(allProjects);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "there was an error retreiving projects" });
    });
});

//GET one project by id --tested and working

router.get("/:id", validateProjectId, (req, res) => {
  const id = req.params.id;
  Projects.get(id)
    .then(project => {
      //   if (project === null) {
      //     res.status(404).json({ message: "no project by that Id" });
      //   } else {
      res.status(200).json(project);
      //   }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "there was an error retreiving project" });
    });
});

//GET one project's actions --tested and working

router.get("/:id/actions", (req, res) => {
  const projectId = req.params.id;

  Projects.getProjectActions(projectId)
    .then(actionList => {
      if (actionList.length === 0) {
        res.status(404).json({ message: "no project by that Id" });
      } else {
        res.status(200).json(actionList);
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "there was an error retreiving project actions" });
    });
});

//POST new project --posting works

router.post("/", (req, res) => {
  const { name, description } = req.body;

  Projects.insert(req.body)
    .then(project => {
      if (!name || !description) {
        res.status(400).json({
          message: "please provide a name and description for the project"
        });
      } else {
        res.status(201).json(project);
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "there was an error while saving the new project" });
    });
});

//PUT project by id --tested and working

router.put("/:id", (req, res) => {
  const updateId = req.params.id;
  const { name, description } = req.body;

  Projects.update(updateId, req.body)
    .then(updated => {
      if (!name || !description) {
        res.status(400).json({
          message: "please provide name and description for the project"
        });
      } else if (!updateId) {
        res.status(404).json({
          message: "the project with the specified id does not exist"
        });
      } else {
        res.status(200).json(updated);
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "there was an error while updating the project" });
    });

  Projects.get(updateId)
    .then(res.json(req.body))
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "the project information could not be modified" });
    });
});

//DELETE project by id --tested and working

router.delete("/:id", (req, res) => {
  const deleteId = req.params.id;

  Projects.remove(deleteId).then(deletedProject => {
    if (deletedProject === 0) {
      res
        .status(400)
        .json({ message: "the project with the specified id does not exist" });
    } else {
      res.status(200).json(deletedProject);
    }
  });
});

function validateProjectId(req, res, next) {
  Projects.get(req.params.id).then(project => {
    if (!project) {
      res.status(404).json({ message: "invalid project id" });
    } else {
      res.status(201).json(project);
    }
  });
  next();
}

module.exports = router;
