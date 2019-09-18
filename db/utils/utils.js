exports.formatDates = list => {
  return list.map(element => {
    const newObj = { ...element };
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
};

exports.makeRefObj = list => {
  return list.reduce((newObj, acc) => {
    newObj[acc.title] = acc["article_id"];
    return newObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(element => {
    const newElement = { ...element };
    newElement.author = newElement.created_by;
    newElement.created_at = new Date(newElement.created_at);
    newElement.article_id = articleRef[newElement["belongs_to"]];
    delete newElement["belongs_to"];
    delete newElement["created_by"];
    return newElement;
  });
};
