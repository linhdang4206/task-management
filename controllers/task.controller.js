const Task = require("../models/task.models");

const paginationHelper = require("../helpers/pagination");

const searchHelper = require("../helpers/search.js");

// Get
module.exports.index = async (req, res) => {
  const find = {
    $or: [
         { createdBy: req.user.id }, 
         { listUser: req.user.id }
   ],
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  if (objectSearch.keyword) {
    find.title = {
      $regex: objectSearch.keyword,
      $options: "i",
    };
  }


  const initPagination = {
    currentPage: 1,
    limitItems: 2,
  };

  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper(initPagination, req.query, countTasks);

  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  }

  const tasks = await Task.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);

  res.json({
    data: tasks,
  });
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });

    if (!task) {
      return res.status(404).json({
        message: "Không tìm thấy"
      });
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Không tìm thấy"
    });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne({
      _id: id
    }, {
      status: status
    })

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công"
    });

  } catch (error) {
    res.json({
      code: 404,
      message: "Cập nhật trạng thái không thành công"
    });
  }
};

module.exports.changeMulti = async (req, res) => {
  try {
    const {
      ids,
      key,
      value
    } = req.body;

    switch (key) {
      case "status":
        await Task.updateMany({
          _id: {
            $in: ids
          }
        }, {
          status: value
        });
        return res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công"
        });
      case "deleted":
        await Task.updateMany({
          _id: {
            $in: ids
          }
        }, {
          deleted: true,
          deletedAt: new Date()
        });
        return res.json({
          code: 200,
          message: "Xoá thành công"
        });
      default:
        return res.json({
          code: 404,
          message: "Không tồn tại"
        });
    }
  } catch (error) {
    return res.json({
      code: 404,
      message: "Không tồn tại"
    });
  }
}

module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
      data: data
    });

  } catch (error) {
    res.json({
      code: 404,
      message: "Lỗi"
    });
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
      data: data
    });

  } catch (error) {
    return res.json({
      code: 404,
      message: "Lỗi"
    });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Task.findByIdAndUpdate(id, {
      deleted: true,
      deletedAt: new Date()
    }, {
      new: true,
    });

    return res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
      data: data
    });

  } catch (error) {
    return res.json({
      code: 404,
      message: "Lỗi"
    });
  }
};