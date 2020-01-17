const express = require("express");

const Actions = require("../helpers/actionModel");

const router = express.Router();

//GET all actions -- tested and working

router.get("/", (req, res) => {
  Actions.get()
    .then(allActions => {
      res.status(200).json(allActions);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "there was an error retreiving actions" });
    });
});

//GET one action by id -- tested and working

router.get("/:id", (req, res) => {
  const id = req.params.id;

  Actions.get(id)
    .then(action => {
      if (action === null) {
        res.status(404).json({ message: "action does not exist" });
      } else {
        res.status(200).json(action);
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "there was an error retreiving the action" });
    });
});

//POST new action on project -- posting, but can't trigger specific error messages

router.post("/", (req, res) => {
  const { project_id, description, notes } = req.body;

  Actions.insert(req.body)
    .then(newAction => {
      if (!project_id) {
        return res.status(404).json({
          message: "the project with the specified id does not exist"
        });
      } else if (!description || !notes) {
        return res
          .status(400)
          .json({ message: "action must have description and notes" });
      } else {
        res.status(201).json(newAction);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "there was an error while saving the action to the database"
      });
    });
});

//UPDATE action by id -- tested and working

router.put("/:id", (req, res) => {
  const updateId = req.params.id;
  const { description, notes } = req.body;

  Actions.update(updateId, req.body)
    .then(updated => {
      if (!description || !notes) {
        res.status(400).json({
          message: "please provide description and notes for the action"
        });
      } else if (!updatedId) {
        res.status(404).json({
          message: "the action with the specified id does not exist"
        });
      } else {
        res.status(200).json(updated);
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "there was an error while updating the action" });
    });

  Actions.get(updateId)
    .then(res.json(req.body))
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "the action information could not be modified" });
    });
});

//DELETE action by id --tested and working

router.delete("/:id", (req, res) => {
  const deleteId = req.params.id;

  Actions.remove(deleteId).then(deletedAction => {
    if (!deleteId) {
      res
        .status(400)
        .json({ message: "the project with the specified id does not exist" });
    } else {
      res.status(200).json(deletedAction);
    }
  });
});

module.exports = router;
