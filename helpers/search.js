module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: ""
    }

  if (query.keyword) {
    objectSearch.keyword = query.keyword;
  

    const regex = new RegExp(objectSearch.keyword, "i");

  objectSearch.regex = regex;

  }


return objectSearch;

}
//   keyword = req.query.keyword;

//     const regex = new RegExp(keyword, "i");
//     find.title = regex;
//   }

//   const products = await Product.find(find);
// }