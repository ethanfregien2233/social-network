const { Thoughts, Users } = require('../models');

const thoughtsController = {
    createThought(req, res) {
        Thoughts.create(req.body)
      .then((dbThoughtsData) => {
        return Users.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { Thoughts: dbThoughtsData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought created without userid' });
        }
        res.json({ message: 'Thought created!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getAllThoughts(req, res) {
    Thoughts.find()
      .sort({ createdAt: -1 })
      .then((dbThoughtsData) => {
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  getThoughtById(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with submitted id!' });
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  

  updateThought(req, res) {
    Thoughts.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with submitted id!' });
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  deleteThought(req, res) {
    Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with submitted id!' });
        }
        return Users.findOneAndUpdate(
          { Thought: req.params.thoughtId },
          { $pull: { Thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user with submitted id!' });
        }
        res.json({ message: 'Thought deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  addReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with submitted id!' });
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  removeReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with submitted id!' });
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtsController;